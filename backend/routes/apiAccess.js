/**
 * @fileoverview API Access Routes
 * @description Routes for B2B API access requests
 */

const express = require('express');
const router = express.Router();
const apiAccessService = require('../services/apiAccessService');
const { verifyToken } = require('../middleware/auth');

/**
 * POST /api/api-access/request
 * Submit a new API access request
 * Requires authentication
 */
router.post('/request', verifyToken, async (req, res, next) => {
    try {
        const { organizationName, contactEmail, useCase, expectedRequests, description } = req.body;

        // Validation
        if (!organizationName || !contactEmail || !useCase || !expectedRequests) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: organizationName, contactEmail, useCase, expectedRequests'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(contactEmail)) {
            return res.status(400).json({
                success: false,
                message: 'Format email tidak valid'
            });
        }

        // Validate use case
        const validUseCases = ['lms_integration', 'research', 'EdTech', 'corporate_training', 'other'];
        if (!validUseCases.includes(useCase)) {
            return res.status(400).json({
                success: false,
                message: 'Use case tidak valid'
            });
        }

        // Validate expected requests
        const validTiers = ['1000', '10000', '50000', '100000'];
        if (!validTiers.includes(expectedRequests)) {
            return res.status(400).json({
                success: false,
                message: 'Volume tier tidak valid'
            });
        }

        const result = await apiAccessService.createRequest(
            { organizationName, contactEmail, useCase, expectedRequests, description },
            req.user.id
        );

        res.status(201).json({
            success: true,
            ...result
        });

    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/api-access/status
 * Get user's own API access request status
 * Requires authentication
 */
router.get('/status', verifyToken, async (req, res, next) => {
    try {
        const status = await apiAccessService.getUserRequestStatus(req.user.id);

        res.json({
            success: true,
            data: status
        });

    } catch (error) {
        next(error);
    }
});

module.exports = router;
