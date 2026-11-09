const express = require("express");
const { verifySignature } = require("../lib/verifySignature");

const router = express.Router();

router.post(
  "/github",
  express.raw({ type: "application/json", limit: "1mb" }),
  (req, res) => {
    const signature = req.get("X-Hub-Signature-256");

    // If the body wasn't parsed as raw bytes, there is nothing to verify
    if (
      !Buffer.isBuffer(req.body) ||
      !verifySignature(process.env.GITHUB_WEBHOOK_SECRET, req.body, signature)
    ) {
      return res.status(401).json({ message: "Invalid signature" });
    }

    res.status(200).json({ received: true });
  },
);

module.exports = router;