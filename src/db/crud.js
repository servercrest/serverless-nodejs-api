const { desc, eq } = require('drizzle-orm');
const clients = require('./clients');
const schemas = require('./schema');

async function newLead({ email }) {
    try {
        const db = await clients.getDrizzleDbClient();
        const result = await db.insert(schemas.LeadTable).values({
            email: email
        }).returning();

        if (result.length === 1) {
            console.log(`New lead created with email: ${email}`);
            return result[0];  // Returning the inserted lead
        } else {
            console.error(`Failed to insert lead with email: ${email}`);
            return null;  // Return null if insertion failed
        }
    } catch (err) {
        console.error('Error in newLead:', err);
        throw new Error('Failed to create new lead');
    }
}

async function listLeads(limit = 10) {
    try {
        const db = await clients.getDrizzleDbClient();
        const results = await db.select().from(schemas.LeadTable).orderBy(desc(schemas.LeadTable.createdAt)).limit(limit);

        console.log(`Listing ${results.length} leads`);
        return results;
    } catch (err) {
        console.error('Error in listLeads:', err);
        throw new Error('Failed to retrieve leads');
    }
}

async function getLead(id) {
    try {
        const db = await clients.getDrizzleDbClient();
        const result = await db.select().from(schemas.LeadTable).where(eq(schemas.LeadTable.id, id));

        if (result.length === 1) {
            console.log(`Lead retrieved with ID: ${id}`);
            return result[0];
        } else {
            console.warn(`No lead found with ID: ${id}`);
            return null;  // Return null if lead not found
        }
    } catch (err) {
        console.error('Error in getLead:', err);
        throw new Error('Failed to retrieve lead');
    }
}

module.exports.newLead = newLead;
module.exports.listLeads = listLeads;
module.exports.getLead = getLead;
