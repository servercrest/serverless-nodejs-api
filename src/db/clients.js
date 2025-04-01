const { neon, neonConfig } = require('@neondatabase/serverless');
const { drizzle } = require('drizzle-orm/neon-http');
const secrets = require('../lib/secrets');

async function getDbClient() {
    try {
        const dbUrl = await secrets.getDatabaseUrl();
        if (!dbUrl) {
            throw new Error("Database URL is not available.");
        }

        neonConfig.fetchConnectionCache = true;
        const sql = neon(dbUrl);
        console.log("Successfully connected to the database");
        return sql;
    } catch (error) {
        console.error("Error setting up the database client:", error);
        throw new Error("Failed to connect to the database");
    }
}

async function getDrizzleDbClient() {
    try {
        const sql = await getDbClient();  // This ensures we first get the db client.
        const drizzleDbClient = drizzle(sql);
        console.log("Successfully set up Drizzle ORM client");
        return drizzleDbClient;
    } catch (error) {
        console.error("Error setting up Drizzle client:", error);
        throw new Error("Failed to set up Drizzle ORM client");
    }
}

module.exports.getDbClient = getDbClient;
module.exports.getDrizzleDbClient = getDrizzleDbClient;
