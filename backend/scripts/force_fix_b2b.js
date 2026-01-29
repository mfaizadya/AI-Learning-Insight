const db = require('../db/connection');

async function forceFix() {
    try {
        console.log('🛠️  STARTING COMPREHENSIVE FIX FOR B2B TABLES...');

        // 1. Reset Migration History
        console.log('1️⃣  Cleaning migration history...');
        await db.execute("DELETE FROM migrations WHERE filename LIKE '003%'");
        console.log('   ✅ Migration history cleared.');

        // 2. Drop potential partial tables (ORDER MATTERS due to FKs)
        console.log('2️⃣  Dropping tables if exist...');
        await db.execute("DROP TABLE IF EXISTS usage_logs");
        await db.execute("DROP TABLE IF EXISTS api_keys");
        await db.execute("DROP TABLE IF EXISTS api_access_requests");
        await db.execute("DROP TABLE IF EXISTS tenants");
        console.log('   ✅ Clean cleanup.');

        // 3. Define SQL for ALL B2B Tables (Tenants -> Keys -> Logs -> Requests)
        console.log('3️⃣  Defining Schema...');

        const sqlStatements = [
            // A. TENANTS
            `CREATE TABLE tenants (
              id INT NOT NULL AUTO_INCREMENT,
              name VARCHAR(255) NOT NULL,
              slug VARCHAR(100) NOT NULL,
              tier ENUM('sandbox', 'basic', 'premium', 'enterprise') NOT NULL DEFAULT 'sandbox',
              contact_email VARCHAR(255) DEFAULT NULL,
              webhook_url VARCHAR(500) DEFAULT NULL,
              is_active BOOLEAN NOT NULL DEFAULT TRUE,
              created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              PRIMARY KEY (id),
              UNIQUE KEY uk_tenants_slug (slug),
              KEY idx_tenants_active (is_active)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci`,

            // B. API KEYS (Depends on tenants)
            `CREATE TABLE api_keys (
              id INT NOT NULL AUTO_INCREMENT,
              tenant_id INT NOT NULL,
              key_hash VARCHAR(64) NOT NULL,
              key_prefix VARCHAR(20) NOT NULL,
              name VARCHAR(100) DEFAULT NULL,
              scopes JSON DEFAULT NULL,
              rate_limit INT DEFAULT 100,
              expires_at TIMESTAMP NULL DEFAULT NULL,
              last_used_at TIMESTAMP NULL DEFAULT NULL,
              is_active BOOLEAN NOT NULL DEFAULT TRUE,
              created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
              PRIMARY KEY (id),
              UNIQUE KEY uk_api_keys_hash (key_hash),
              KEY idx_api_keys_tenant (tenant_id),
              KEY idx_api_keys_prefix (key_prefix),
              KEY idx_api_keys_active (is_active),
              CONSTRAINT fk_api_keys_tenant FOREIGN KEY (tenant_id) 
                REFERENCES tenants (id) ON DELETE CASCADE ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci`,

            // C. USAGE LOGS (Depends on tenants, api_keys)
            `CREATE TABLE usage_logs (
              id BIGINT NOT NULL AUTO_INCREMENT,
              tenant_id INT NOT NULL,
              api_key_id INT DEFAULT NULL,
              endpoint VARCHAR(100) NOT NULL,
              method VARCHAR(10) NOT NULL DEFAULT 'GET',
              status_code INT NOT NULL,
              response_time_ms INT DEFAULT NULL,
              request_ip VARCHAR(45) DEFAULT NULL,
              tokens_used INT DEFAULT 0,
              created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
              PRIMARY KEY (id),
              KEY idx_usage_tenant (tenant_id),
              KEY idx_usage_api_key (api_key_id),
              KEY idx_usage_created (created_at),
              KEY idx_usage_endpoint (endpoint),
              CONSTRAINT fk_usage_tenant FOREIGN KEY (tenant_id) 
                REFERENCES tenants (id) ON DELETE CASCADE ON UPDATE CASCADE,
              CONSTRAINT fk_usage_api_key FOREIGN KEY (api_key_id) 
                REFERENCES api_keys (id) ON DELETE SET NULL ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci`,

            // D. API ACCESS REQUESTS (Depends on users, tenants)
            `CREATE TABLE api_access_requests (
              id INT NOT NULL AUTO_INCREMENT,
              user_id INT NOT NULL,
              organization_name VARCHAR(255) NOT NULL,
              contact_email VARCHAR(255) NOT NULL,
              use_case ENUM('lms_integration', 'research', 'EdTech', 'corporate_training', 'other') NOT NULL,
              expected_requests ENUM('1000', '10000', '50000', '100000') NOT NULL,
              description TEXT DEFAULT NULL,
              status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
              reviewed_by INT DEFAULT NULL,
              reviewed_at TIMESTAMP NULL DEFAULT NULL,
              rejection_reason TEXT DEFAULT NULL,
              tenant_id INT DEFAULT NULL,
              created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              PRIMARY KEY (id),
              KEY idx_api_requests_user (user_id),
              KEY idx_api_requests_status (status),
              KEY idx_api_requests_created (created_at),
              CONSTRAINT fk_api_requests_user FOREIGN KEY (user_id) 
                REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
              CONSTRAINT fk_api_requests_tenant FOREIGN KEY (tenant_id) 
                REFERENCES tenants (id) ON DELETE SET NULL ON UPDATE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci`,

            // E. INDEX for API Requests
            `CREATE INDEX idx_api_requests_email ON api_access_requests (contact_email)`
        ];

        // 4. Execute
        console.log(`4️⃣  Executing ${sqlStatements.length} Schema Statements...`);
        for (const sql of sqlStatements) {
            process.stdout.write('.');
            await db.execute(sql);
        }
        console.log('\n   ✅ All B2B Tables Created.');

        // 5. Mark as Applied
        console.log('5️⃣  Marking migration as done...');
        await db.execute("INSERT INTO migrations (filename) VALUES (?)", ['003_add_api_access_requests.sql']);
        console.log('   ✅ Migration recorded.');

        console.log('\n🎉 FIX COMPLETED! B2B INFRASTRUCTURE IS READY.');
        process.exit(0);

    } catch (err) {
        console.error('\n❌ FIX FAILED:', err.message);
        process.exit(1);
    }
}

if (require.main === module) {
    forceFix();
}
