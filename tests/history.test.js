const request = require("supertest");
const app = require("../src/app");

describe("History API Tests", () => {

  // -----------------------------
  // 2. POST create history entry
  // -----------------------------
  test("POST /api/performance/history → fetcj history record", async () => {
    const res = await request(app)
      .post("/api/performance/history")
      .send({
        fundId: "125497",
        benchmarkId: "NIFTY50",
        startDate: "2026-01-01",
        endDate: "2026-02-01"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
  });

  // -----------------------------
  // 3. Missing fields validation
  // -----------------------------
  test("POST /api/performance/history → missing fields should fail", async () => {
    const res = await request(app)
      .post("/api/performance/history")
      .send({
        fundId: "FUND123"
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });


  // -----------------------------
  // 5. Invalid date range
  // -----------------------------
  test("POST /api/performance/history → invalid date range should fail", async () => {
    const res = await request(app)
      .post("/api/performance/history")
      .send({
        fundId: "125497",
        benchmarkId: "NIFTY50",
        startDate: "2026-01-01",
        endDate: "2027-02-01"
      });

    expect(res.statusCode).toBe(400);
  });

});