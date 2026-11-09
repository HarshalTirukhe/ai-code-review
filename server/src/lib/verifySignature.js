const crypto = require("crypto");

function verifySignature(secret, rawBody, signatureHeader) {
  if (!secret || !signatureHeader) return false;

  const expected =
    "sha256=" +
    crypto.createHmac("sha256", secret).update(rawBody).digest("hex");

  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(signatureHeader);

  // timingSafeEqual throws if the lengths differ, so check first
  if (expectedBuffer.length !== receivedBuffer.length) return false;

  return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
}

module.exports = { verifySignature };