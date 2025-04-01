const { z } = require("zod");

async function validateLead(postData) {
    const lead = z.object({
        email: z.string().email("Invalid email format. Please provide a valid email address.")
    });

    let hasError = false;
    let validData = {};
    let message = '';

    try {
        validData = lead.parse(postData);
    } catch (err) {
        if (err instanceof z.ZodError) {
            hasError = true;
            message = err.errors.map(e => e.message).join(", "); // Collecting error messages if there are multiple issues
        } else {
            hasError = true;
            message = "Unexpected validation error.";
        }
        console.error("Validation failed:", err);
    }

    return {
        data: validData,
        hasError: hasError,
        message: message,
    };
}

module.exports.validateLead = validateLead;
