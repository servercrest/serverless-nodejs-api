const { drizzle } = require('drizzle-orm/neon-serverless');
const { migrate } = require('drizzle-orm/postgres-js/migrator');
const schema = require('../db/schema');
const secrets = require('../lib/secrets');
require('dotenv').config();

const { Pool, neonConfig } = require('@neondatabase/serverless');
const ws = require('ws');

async function performMigration() {
    const dbUrl = await secrets.getDatabaseUrl();
    if (!dbUrl) {
        console.log('No database URL found');
        return;
    }

    // Configure WebSocket for Neon serverless
    neonConfig.webSocketConstructor = ws;

    const pool = new Pool({ connectionString: dbUrl });
    pool.on('error', err => console.error('Pool error:', err));

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const db = await drizzle(client, { schema });

        console.log('Starting migration...');
        await migrate(db, { migrationsFolder: 'src/migrations' });
        console.log('Migration complete');

        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error during migration:', err);
        throw err; // Re-throwing the error to be caught outside
    } finally {
        try {
            client.release();
        } catch (releaseError) {
            console.error('Error releasing client:', releaseError);
        }
        await pool.end();
    }
}

if (require.main === module) {
    console.log("Running migrations...");
    performMigration()
        .then(() => {
            console.log("Migrations done");
            process.exit(0); // Successful exit
        })
        .catch(err => {
            console.error('Migrations failed:', err);
            process.exit(1); // Exit with error code
        });
}
