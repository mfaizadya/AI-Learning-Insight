const axios = require('axios');
const db = require('../db/connection');
const { hashPassword } = require('../utils/auth');

/**
 * VERIFIKASI ADMIN FLOW
 * ---------------------
 * 1. Create/Promote Admin User
 * 2. Login as Admin
 * 3. Fetch Requests (GET /api/api-access/requests)
 * 4. Approve a Pending Request
 * 5. Verify Tenant & Key Creation
 */

const API_URL = 'http://localhost:3000/api';
const ADMIN_EMAIL = 'admin@cerdasku.id';
const ADMIN_PASS = 'admin123';

async function runAdminVerification() {
    try {
        console.log('🚀 Memulai Verifikasi Admin Flow...\n');

        // 1. CREATE ADMIN
        console.log('1️⃣  Memastikan Admin User Exists...');
        try {
            const result = await db.query('SELECT id FROM users WHERE email = ?', [ADMIN_EMAIL]);
            console.log('   🔍 Query Result Type:', typeof result, Array.isArray(result));

            // Handle both mysql2 standard [rows, fields] and my wrapper (rows) possibilities
            let users = [];
            if (Array.isArray(result) && Array.isArray(result[0])) {
                users = result[0]; // [rows, fields]
                console.log('   (Detected [rows, fields] format)');
            } else if (Array.isArray(result)) {
                users = result; // rows
                console.log('   (Detected rows format)');
            }

            if (users.length === 0) {
                const hashed = await hashPassword(ADMIN_PASS);
                await db.execute(
                    'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
                    ['Super Admin', ADMIN_EMAIL, hashed, 'admin']
                );
                console.log('   ✅ Admin Created.');
            } else {
                // Ensure role is admin
                await db.execute('UPDATE users SET role = "admin" WHERE email = ?', [ADMIN_EMAIL]);
                console.log('   ✅ Admin Exists (Role refreshed).');
            }
        } catch (dbErr) {
            console.error('   ❌ DB Error:', dbErr);
            throw dbErr;
        }

        // 2. LOGIN
        console.log('\n2️⃣  Login sebagai Admin...');
        let token;
        try {
            const res = await axios.post(`${API_URL}/auth/login`, {
                email: ADMIN_EMAIL,
                password: ADMIN_PASS
            });
            token = res.data.data.token;
            console.log('   ✅ Login Berhasil.');
        } catch (err) {
            throw new Error('Login Gagal: ' + err.message);
        }

        // 3. FETCH REQUESTS
        console.log('\n3️⃣  Mengambil Daftar Request...');
        let targetRequestId;
        try {
            const res = await axios.get(`${API_URL}/api-access/requests`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { status: 'pending' }
            });
            const requests = res.data.data; // Expecting { success: true, data: [...] }
            console.log(`   ✅ Ditemukan ${requests ? requests.length : 0} pending requests.`);

            if (requests && requests.length > 0) {
                targetRequestId = requests[0].id;
                console.log(`   🎯 Target Request ID untuk Approval: ${targetRequestId}`);
            } else {
                console.log('   ⚠️ Tidak ada pending request untuk diapprove.');
            }
        } catch (err) {
            console.error('   ❌ Fetch Requests Flask:', err.response?.data || err.message);
            throw new Error('Fetch Requests Gagal');
        }

        // 4. APPROVE REQUEST
        if (targetRequestId) {
            console.log(`\n4️⃣  Menyetujui Request ID ${targetRequestId}...`);
            try {
                const res = await axios.post(
                    `${API_URL}/api-access/requests/${targetRequestId}/approve`,
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                console.log('   ✅ Approval Berhasil:', res.data.message);
                console.log('   🔑 API Key Generated:', res.data.data.apiKey);

                // 5. VERIFY DB
                console.log('\n5️⃣  Verifikasi Database (Tenant/Key)...');
                const [keys] = await db.query(
                    'SELECT * FROM api_keys WHERE tenant_id = ?',
                    [res.data.data.tenantId]
                );
                const [accessReq] = await db.query(
                    'SELECT status FROM api_access_requests WHERE id = ?',
                    [targetRequestId]
                );

                if (keys.length > 0 && accessReq[0].status === 'approved') {
                    console.log('   ✅ Database Verified: Key Created & Request Approved.');
                    console.log('\n✨ ADMIN TEST PASSED ✨');
                } else {
                    console.error('   ❌ Database Verification Failed!');
                }

            } catch (err) {
                console.error('   ❌ Approval Gagal:', err.response?.data || err.message);
            }
        }

        process.exit(0);

    } catch (error) {
        console.error('\n❌ Admin Verification Error:', error.message);
        process.exit(1);
    }
}

runAdminVerification();
