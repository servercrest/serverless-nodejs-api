const { serial, text, timestamp, pgTable } = require("drizzle-orm/pg-core");

const leadTable = pgTable('leads', {
    id: serial('id').primaryKey(),
    email: text('email').notNull(),
    description: text('description').default('This is my comment'),
    createdAt: timestamp('created_at').defaultNow(),
});

module.exports = {
    LeadTable
};