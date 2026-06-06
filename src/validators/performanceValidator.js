const NavHistory = require("../models/NavHistory");
const BenchmarkHistory = require("../models/BenchmarkHistory");

module.exports.validateCompareRequest = async (req, res, next) => {
  try {
    const { fundId, benchmarkId, startDate, endDate } = req.body;

    // 1️⃣ Required fields
    if (!fundId || !benchmarkId || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    // 2️⃣ Convert dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format"
      });
    }

    if (start > end) {
      return res.status(400).json({
        success: false,
        message: "Start date cannot be greater than end date"
      });
    }

    // 3️⃣ Fetch data
    const fund = await NavHistory.findOne({ schemeCode: Number(fundId) });
    const benchmark = await BenchmarkHistory.findOne({ benchmarkCode: benchmarkId });

    if (!fund) {
      return res.status(404).json({ success: false, message: "Fund not found" });
    }

    if (!benchmark) {
      return res.status(404).json({ success: false, message: "Benchmark not found" });
    }

    // 4️⃣ Normalize
    const fundHistory = fund.history.map(h => ({
      date: new Date(h.date),
      nav: h.nav
    }));

    const benchmarkHistory = benchmark.history.map(h => ({
      date: new Date(h.date),
      close: h.close
    }));

    // 5️⃣ Sort (IMPORTANT for boundary checks)
    fundHistory.sort((a, b) => a.date - b.date);
    benchmarkHistory.sort((a, b) => a.date - b.date);

    // 6️⃣ STRICT RANGE VALIDATION (FIX)
    const fundStartExists = fundHistory.some(h => h.date.getTime() === start.getTime());
    const fundEndExists = fundHistory.some(h => h.date.getTime() === end.getTime());

    const benchStartExists = benchmarkHistory.some(h => h.date.getTime() === start.getTime());
    const benchEndExists = benchmarkHistory.some(h => h.date.getTime() === end.getTime());

    // ⚠️ IMPORTANT: Instead of failing blindly, we validate availability window
    const fundMinDate = fundHistory[0].date;
    const fundMaxDate = fundHistory[fundHistory.length - 1].date;

    const benchMinDate = benchmarkHistory[0].date;
    const benchMaxDate = benchmarkHistory[benchmarkHistory.length - 1].date;

    if (start < fundMinDate || end > fundMaxDate) {
      return res.status(400).json({
        success: false,
        message: "Fund data not available for full requested date range"
      });
    }

    if (start < benchMinDate || end > benchMaxDate) {
      return res.status(400).json({
        success: false,
        message: "Benchmark data not available for full requested date range"
      });
    }

    // 7️⃣ Attach validated request
    req.validatedInput = {
      fundId,
      benchmarkId,
      start,
      end
    };

    next();

  } catch (err) {
    console.error("VALIDATION ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Validation error"
    });
  }
};