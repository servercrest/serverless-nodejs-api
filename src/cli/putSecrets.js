const secrets = require('../lib/secrets');
require('dotenv').config();

const args = process.argv.slice(2);

// Check if the required arguments are passed
if (args.length !== 2) {
    console.log('Usage: tsx src/cli/putSecrets.js <stage> <dbUrl>');
    process.exit(1);
}

// Destructure the command line arguments
const [stage, dbUrl] = args;

// Validate dbUrl format (basic check)
const isValidUrl = /^https?:\/\/\S+$/.test(dbUrl);
if (!isValidUrl) {
    console.error('Invalid dbUrl format. Please provide a valid URL.');
    process.exit(1);
}

// Function to update the database URL secret
async function updateSecrets() {
    try {
        console.log("Updating database URL...");
        
        // Call the secret management function to store the dbUrl for the given stage
        const result = await secrets.putDatabaseUrl(stage, dbUrl);
        
        console.log(result);
        console.log(`Secret set successfully for stage: ${stage}`);
        process.exit(0); // Exit with success code
    } catch (err) {
        console.error(`Failed to set secret: ${err.message}`);
        process.exit(1); // Exit with error code
    }
}

// Execute the updateSecrets function
if (require.main === module) {
    updateSecrets();
}
