const request = require("supertest");
const app = require("../src/app");

jest.mock("axios");
const axios = require("axios");

beforeEach(() => {
  axios.get.mockResolvedValue({
    data: {}
  });
});

describe("Performance API Tests", () => {

  test("POST /api/performance/compare → success response", async () => {
    const res = await request(app)
      .post("/api/performance/compare")
      .send({
        fundId: "125497",
        benchmarkId: "NIFTY50",
        startDate: "2026-01-01",
        endDate: "2026-01-05"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

    expect(res.body.data).toHaveProperty("fundReturn");
    expect(res.body.data).toHaveProperty("benchmarkReturn");
    expect(res.body.data).toHaveProperty("performanceGap");
  });

  test("POST missing fields → should fail gracefully", async () => {
    const res = await request(app)
      .post("/api/performance/compare")
      .send({
        fundId: "FUND123"
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBeDefined();
  });

});