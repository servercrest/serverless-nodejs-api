const serverless = require("serverless-http");
const express = require("express");
const crud = require('./db/crud');
const validators = require('./db/validators');
const { getDbClient } = require('./db/clients');
const app = express();
const STAGE = process.env.STAGE || 'prod';

app.use(express.json());

app.get("/", async (req, res, next) => {
  try {
    console.log(process.env.DEBUG);
    const sql = await getDbClient();
    const now = Date.now();
    const [dbNowResult] = await sql`SELECT now();`;
    const delta = (dbNowResult.now.getTime() - now) / 1000;
    return res.status(200).json({
      delta: delta,
      stage: STAGE
    });
  } catch (error) {
    next(error); // Pass the error to the default error handler
  }
});

app.get("/path", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from path!",
  });
});

app.get("/api/leads", async (req, res, next) => {
  try {
    const results = await crud.listLeads();
    return res.status(200).json({
      results: results,
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/leads", async (req, res, next) => {
  try {
    const postData = await req.body;
    const { data, hasError, message } = await validators.validateLead(postData);

    if (hasError) {
      return res.status(400).json({
        message: message || "Invalid lead data. Please check the provided information.",
      });
    } else if (hasError === undefined) {
      return res.status(500).json({
        message: "Server Error",
      });
    }

    const result = await crud.newLead(data);
    return res.status(201).json({
      results: result,
    });
  } catch (error) {
    next(error); // Handle error if any async operation fails
  }
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

module.exports.app = app;
module.exports.handler = serverless(app);
