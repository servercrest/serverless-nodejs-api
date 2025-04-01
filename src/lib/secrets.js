const { SSMClient, GetParameterCommand, PutParameterCommand } = require("@aws-sdk/client-ssm");

const AWS_REGION = process.env.AWS_REGION || 'us-east-2';  // Use environment variable for flexibility
const STAGE = process.env.STAGE || 'prod';

// Get database URL from SSM Parameter Store
async function getDatabaseUrl() {
    const DATABASE_URL_SSM_PARAM = `/serverless-nodejs-api/${STAGE}/database-url`;
    const client = new SSMClient({ region: AWS_REGION });

    const paramStoreData = {
        Name: DATABASE_URL_SSM_PARAM,
        WithDecryption: true,
    };

    try {
        const command = new GetParameterCommand(paramStoreData);
        const result = await client.send(command);
        console.log(`Successfully retrieved the database URL for ${STAGE}`);
        return result.Parameter.Value;
    } catch (error) {
        console.error(`Error retrieving database URL for ${STAGE}:`, error);
        throw new Error('Failed to retrieve database URL');
    }
}

// Put database URL into SSM Parameter Store
async function putDatabaseUrl(stage, dbUrlVal) {
    const paramStage = stage ? stage : 'dev';

    // Avoid modifying the prod stage, presumably for production safety
    if (paramStage === 'prod') {
        console.log("No updates allowed for the 'prod' stage.");
        return;
    }

    if (!dbUrlVal) {
        console.error("No database URL value provided.");
        throw new Error("Database URL value is required");
    }

    const DATABASE_URL_SSM_PARAM = `/serverless-nodejs-api/${paramStage}/database-url`;
    const client = new SSMClient({ region: AWS_REGION });

    const paramStoreData = {
        Name: DATABASE_URL_SSM_PARAM,
        Value: dbUrlVal,
        Type: "SecureString",
        Overwrite: true,
    };

    try {
        const command = new PutParameterCommand(paramStoreData);
        const result = await client.send(command);
        console.log(`Successfully set the database URL for ${paramStage}`);
        return result;
    } catch (error) {
        console.error(`Error setting database URL for ${paramStage}:`, error);
        throw new Error('Failed to set database URL');
    }
}

module.exports.getDatabaseUrl = getDatabaseUrl;
module.exports.putDatabaseUrl = putDatabaseUrl;
