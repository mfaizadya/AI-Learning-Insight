const axios = require('axios');
const db = require('../db/connection');

/**
 * SIMULASI PARTNER / LMS JOURNEY
 * ------------------------------
 * Skenario:
 * 1. Registrasi User Baru (Role: User biasa yang ingin upgrade jadi Partner)
 * 2. Login untuk dapatkan Token
 * 3. Mengisi Form Request API Access (POST /api/api-access/request)
 * 4. Verifikasi Data masuk ke Database
 */

const API_URL = 'http://localhost:3000/api';
const EMAIL = `partner.lms.${Date.now()}@example.com`; // Unique email
const PASSWORD = 'password123';

async function runSimulation() {
    try {
        console.log('🚀 Memulai Simulasi Partner Flow...\n');

        // 1. REGISTER
        console.log(`1️⃣  Mendaftarkan User Baru: ${EMAIL}`);
        try {
            await axios.post(`${API_URL}/auth/register`, {
                username: "Partner LMS Demo",
                email: EMAIL,
                password: PASSWORD
            });
            console.log('   ✅ Register Berhasil.');
        } catch (err) {
            console.error('   ❌ Register Gagal:', err.response?.data?.message || err.message);
            process.exit(1);
        }

        // 2. LOGIN
        console.log(`\n2️⃣  Login untuk mendapatkan Token`);
        let token;
        try {
            const res = await axios.post(`${API_URL}/auth/login`, {
                email: EMAIL,
                password: PASSWORD
            });
            token = res.data.data.token;
            console.log('   ✅ Login Berhasil. Token:', token ? token.substring(0, 20) + '...' : 'UNDEFINED');
        } catch (err) {
            console.error('   ❌ Login Gagal:', err.response?.data?.message || err.message);
            process.exit(1);
        }

        // 3. REQUEST API ACCESS
        console.log(`\n3️⃣  Mengajukan Request API Access (Sebagai LMS)`);
        const payload = {
            organizationName: "PT. Contoh Edukasi Indonesia",
            contactEmail: "developer@company.com",
            useCase: "lms_integration",
            expectedRequests: "10000",
            description: "Kami ingin integrasi fitur pattern recognition ke Moodle kampus kami."
        };

        try {
            const res = await axios.post(`${API_URL}/api-access/request`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('   ✅ Request Terkirim:', res.data.message);
        } catch (err) {
            console.error('   ❌ Request API Gagal:', err.response?.data?.message || err.message);
            console.error('   Details:', err.response?.data);
            process.exit(1);
        }

        // 4. VERIFIKASI DATABASE
        console.log(`\n4️⃣  Verifikasi Database (Backend Check)`);
        const rows = await db.query(
            `SELECT id, organization_name, status, created_at FROM api_access_requests WHERE contact_email = ?`,
            ["developer@company.com"]
        );

        if (rows && rows.length > 0) {
            console.log("   ✅ Data Ditemukan di Database:");
            const firstRow = rows[0]; // db.query returns array of rows
            console.table(rows);
            console.log("\n✨ TEST PASSED: Siklus Pendaftaran Partner Berhasil.");
        } else {
            console.error("   ❌ Data TIDAK Ditemukan di Database!");
        }

        process.exit(0);

    } catch (error) {
        console.error('\n❌ Simulasi Error:', error.message);
        process.exit(1);
    }
}

runSimulation();
