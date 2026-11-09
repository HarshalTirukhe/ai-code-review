const crypto = require("crypto");
const request = require("supertest");

process.env.GITHUB_WEBHOOK_SECRET = "test-secret";
const app = require("../src/app");

const sign = (body, secret = "test-secret") =>
  "sha256=" + crypto.createHmac("sha256", secret).update(body).digest("hex");

const payload = JSON.stringify({ action: "opened" });

const send = (body, headers = {}) =>
  request(app)
    .post("/webhooks/github")
    .set("Content-Type", "application/json")
    .set(headers)
    .send(body);

describe("POST /webhooks/github", () => {
  it("accepts a correctly signed request", async () => {
    const res = await send(payload, { "X-Hub-Signature-256": sign(payload) });
    expect(res.status).toBe(200);
  });

  it("rejects a request with no signature", async () => {
    const res = await send(payload);
    expect(res.status).toBe(401);
  });

  it("rejects a signature made with the wrong secret", async () => {
    const res = await send(payload, {
      "X-Hub-Signature-256": sign(payload, "another-secret"),
    });
    expect(res.status).toBe(401);
  });

  it("rejects a body that was changed after signing", async () => {
    const res = await send(JSON.stringify({ action: "closed" }), {
      "X-Hub-Signature-256": sign(payload),
    });
    expect(res.status).toBe(401);
  });

  it("rejects a signature without the sha256= prefix", async () => {
    const bare = sign(payload).replace("sha256=", "");
    const res = await send(payload, { "X-Hub-Signature-256": bare });
    expect(res.status).toBe(401);
  });

  it("rejects a request that is not JSON", async () => {
    const res = await request(app)
      .post("/webhooks/github")
      .set("Content-Type", "text/plain")
      .set("X-Hub-Signature-256", sign(payload))
      .send(payload);
    expect(res.status).toBe(401);
  });
});