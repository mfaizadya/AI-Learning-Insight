/**
 * @fileoverview API Access Request Service
 * @description Service layer for handling B2B API access requests
 * Implements CRUD operations and approval workflow with tenant/key creation
 */

const db = require('../db/connection');
const crypto = require('crypto');

/**
 * Generate API key using cryptographically secure random bytes
 * @param {string} type - 'live' or 'sandbox'
 * @returns {object} { key, hash, prefix }
 */
const generateApiKey = (type = 'sandbox') => {
    const prefix = type === 'live' ? 'ck_live_' : 'ck_sandbox_';
    const randomPart = crypto.randomBytes(24).toString('hex');
    const key = `${prefix}${randomPart}`;
    const hash = crypto.createHash('sha256').update(key).digest('hex');

    return {
        key,           // Full key (return to user once, never store)
        hash,          // Store this in database
        prefix         // For identification
    };
};

/**
 * Get rate limit based on expected requests tier
 * @param {string} tier - Expected requests tier
 * @returns {number} Rate limit per minute
 */
const getRateLimitForTier = (tier) => {
    const tierMap = {
        '1000': 50,      // Low volume: 50 req/min
        '10000': 100,    // Medium: 100 req/min
        '50000': 200,    // High: 200 req/min
        '100000': 500    // Enterprise: 500 req/min
    };
    return tierMap[tier] || 100;
};

/**
 * Create a new API access request
 * @param {object} data - Request data from form
 * @param {string} userId - ID of the requesting user
 * @returns {Promise<object>} Created request
 */
const createRequest = async (data, userId) => {
    const { organizationName, contactEmail, useCase, expectedRequests, description } = data;

    // Check if user already has a pending request
    const [existing] = await db.execute(
        `SELECT id FROM api_access_requests 
         WHERE user_id = ? AND status = 'pending'`,
        [userId]
    );

    if (existing.length > 0) {
        const error = new Error('Anda sudah memiliki request yang sedang diproses');
        error.statusCode = 400;
        throw error;
    }

    // Check if user already has approved access
    const [approved] = await db.execute(
        `SELECT id FROM api_access_requests 
         WHERE user_id = ? AND status = 'approved'`,
        [userId]
    );

    if (approved.length > 0) {
        const error = new Error('Anda sudah memiliki akses API yang disetujui');
        error.statusCode = 400;
        throw error;
    }

    const [result] = await db.execute(
        `INSERT INTO api_access_requests 
         (user_id, organization_name, contact_email, use_case, expected_requests, description)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, organizationName, contactEmail, useCase, expectedRequests, description || null]
    );

    return {
        id: result.insertId,
        status: 'pending',
        message: 'Request berhasil disubmit. Tim kami akan meninjau dalam 1-2 hari kerja.'
    };
};

/**
 * Get all API access requests (for admin)
 * @param {object} options - Query options
 * @returns {Promise<array>} List of requests
 */
const getAllRequests = async (options = {}) => {
    const { status, page = 1, limit = 20 } = options;
    const offset = (page - 1) * limit;

    let query = `
        SELECT 
            r.id,
            r.user_id,
            r.organization_name,
            r.contact_email,
            r.use_case,
            r.expected_requests,
            r.description,
            r.status,
            r.reviewed_by,
            r.reviewed_at,
            r.rejection_reason,
            r.tenant_id,
            r.created_at,
            u.name as requester_name,
            u.email as requester_email
        FROM api_access_requests r
        JOIN users u ON r.user_id = u.id
    `;

    const params = [];

    if (status) {
        query += ' WHERE r.status = ?';
        params.push(status);
    }

    query += ' ORDER BY r.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [requests] = await db.execute(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM api_access_requests';
    if (status) {
        countQuery += ' WHERE status = ?';
    }
    const [countResult] = await db.execute(countQuery, status ? [status] : []);

    return {
        data: requests,
        pagination: {
            page,
            limit,
            total: countResult[0].total,
            totalPages: Math.ceil(countResult[0].total / limit)
        }
    };
};

/**
 * Get single request by ID
 * @param {number} requestId - Request ID
 * @returns {Promise<object>} Request details
 */
const getRequestById = async (requestId) => {
    const [requests] = await db.execute(
        `SELECT 
            r.*,
            u.name as requester_name,
            u.email as requester_email
         FROM api_access_requests r
         JOIN users u ON r.user_id = u.id
         WHERE r.id = ?`,
        [requestId]
    );

    if (requests.length === 0) {
        const error = new Error('Request tidak ditemukan');
        error.statusCode = 404;
        throw error;
    }

    return requests[0];
};

/**
 * Approve API access request
 * Creates tenant and generates API key
 * @param {number} requestId - Request ID to approve
 * @param {string} adminId - Admin user ID who approves
 * @returns {Promise<object>} Approval result with API key
 */
const approveRequest = async (requestId, adminId) => {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // Get request details
        const [requests] = await connection.execute(
            'SELECT * FROM api_access_requests WHERE id = ? AND status = ?',
            [requestId, 'pending']
        );

        if (requests.length === 0) {
            const error = new Error('Request tidak ditemukan atau sudah diproses');
            error.statusCode = 404;
            throw error;
        }

        const request = requests[0];

        // Create slug from organization name
        const slug = request.organization_name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
            .substring(0, 50) + '-' + Date.now().toString(36);

        // Create tenant
        const [tenantResult] = await connection.execute(
            `INSERT INTO tenants (name, slug, tier, contact_email)
             VALUES (?, ?, 'sandbox', ?)`,
            [request.organization_name, slug, request.contact_email]
        );

        const tenantId = tenantResult.insertId;

        // Generate API key
        const apiKeyData = generateApiKey('sandbox');
        const rateLimit = getRateLimitForTier(request.expected_requests);

        // Insert API key
        await connection.execute(
            `INSERT INTO api_keys (tenant_id, key_hash, key_prefix, name, scopes, rate_limit)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                tenantId,
                apiKeyData.hash,
                apiKeyData.prefix,
                `${request.organization_name} - Primary Key`,
                JSON.stringify(['predict', 'usage:read']),
                rateLimit
            ]
        );

        // Update request status
        await connection.execute(
            `UPDATE api_access_requests 
             SET status = 'approved', 
                 reviewed_by = ?, 
                 reviewed_at = NOW(),
                 tenant_id = ?
             WHERE id = ?`,
            [adminId, tenantId, requestId]
        );

        await connection.commit();

        return {
            success: true,
            message: 'Request disetujui. API Key berhasil dibuat.',
            data: {
                tenantId,
                apiKey: apiKeyData.key, // Return this ONCE to show to admin/user
                rateLimit,
                tier: 'sandbox'
            }
        };

    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

/**
 * Reject API access request
 * @param {number} requestId - Request ID to reject
 * @param {string} adminId - Admin user ID who rejects
 * @param {string} reason - Rejection reason
 * @returns {Promise<object>} Rejection result
 */
const rejectRequest = async (requestId, adminId, reason) => {
    const [result] = await db.execute(
        `UPDATE api_access_requests 
         SET status = 'rejected', 
             reviewed_by = ?, 
             reviewed_at = NOW(),
             rejection_reason = ?
         WHERE id = ? AND status = 'pending'`,
        [adminId, reason || 'Tidak memenuhi kriteria', requestId]
    );

    if (result.affectedRows === 0) {
        const error = new Error('Request tidak ditemukan atau sudah diproses');
        error.statusCode = 404;
        throw error;
    }

    return {
        success: true,
        message: 'Request ditolak.'
    };
};

/**
 * Get user's own API access request status
 * @param {string} userId - User ID
 * @returns {Promise<object|null>} Request status or null
 */
const getUserRequestStatus = async (userId) => {
    const [requests] = await db.execute(
        `SELECT 
            r.id,
            r.organization_name,
            r.status,
            r.created_at,
            r.reviewed_at,
            r.rejection_reason,
            t.slug as tenant_slug
         FROM api_access_requests r
         LEFT JOIN tenants t ON r.tenant_id = t.id
         WHERE r.user_id = ?
         ORDER BY r.created_at DESC
         LIMIT 1`,
        [userId]
    );

    return requests.length > 0 ? requests[0] : null;
};

module.exports = {
    createRequest,
    getAllRequests,
    getRequestById,
    approveRequest,
    rejectRequest,
    getUserRequestStatus
};
