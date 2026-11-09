const express = require("express");
const webhookRoutes = require("./routes/webhook.routes");

const app = express();

// Webhooks need the raw body, so they go BEFORE express.json()
app.use("/webhooks", webhookRoutes);

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

module.exports = app;