const NavHistory = require("../models/NavHistory");
const BenchmarkHistory = require("../models/BenchmarkHistory");

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

function calculateReturn(start, end) {
  return ((end - start) / start) * 100;
}

exports.comparePerformance = async ({ fundId, benchmarkId, start, end }) => {
  console.log("🚀 SERVICE START");
  console.log("INPUT:", { fundId, benchmarkId, start, end });

  // 1️⃣ fetch data
  const fund = await NavHistory.findOne({ schemeCode: Number(fundId) });
  const benchmark = await BenchmarkHistory.findOne({
    benchmarkCode: benchmarkId
  });

  console.log("📊 FUND FOUND:", !!fund);
  console.log("📊 BENCHMARK FOUND:", !!benchmark);

  if (!fund || !benchmark) {
    console.log("❌ Missing fund or benchmark in DB");
    throw new AppError("Data not found", 404);
  }

  // 2️⃣ convert dates properly (IMPORTANT FIX)
  const startDate = new Date(start);
  const endDate = new Date(end);

  console.log("📅 Converted Dates:", { startDate, endDate });

  // 3️⃣ filter range
  const fundHistory = fund.history.filter(h => {
    const d = new Date(h.date);
    return d >= startDate && d <= endDate;
  });

  const benchmarkHistory = benchmark.history.filter(h => {
    const d = new Date(h.date);
    return d >= startDate && d <= endDate;
  });

  console.log("📈 FUND HISTORY COUNT:", fundHistory.length);
  console.log("📈 BENCHMARK HISTORY COUNT:", benchmarkHistory.length);

  // 4️⃣ validate filtered data
  if (fundHistory.length === 0 || benchmarkHistory.length === 0) {
    console.log("❌ No data in selected date range");

    throw new AppError(
      "Fund data missing for start or end date",
      400
    );
  }

  // 5️⃣ sort (IMPORTANT FIX — prevents wrong start/end selection)
  fundHistory.sort((a, b) => new Date(a.date) - new Date(b.date));
  benchmarkHistory.sort((a, b) => new Date(a.date) - new Date(b.date));

  // 6️⃣ compute start & end safely
  const fundStart = fundHistory[0].nav;
  const fundEnd = fundHistory[fundHistory.length - 1].nav;

  const benchStart = benchmarkHistory[0].close;
  const benchEnd = benchmarkHistory[benchmarkHistory.length - 1].close;

  console.log("💰 FUND VALUES:", { fundStart, fundEnd });
  console.log("💰 BENCH VALUES:", { benchStart, benchEnd });

  // 7️⃣ returns
  const fundReturn = calculateReturn(fundStart, fundEnd);
  const benchmarkReturn = calculateReturn(benchStart, benchEnd);

  const result = {
    fundReturn: fundReturn.toFixed(2),
    benchmarkReturn: benchmarkReturn.toFixed(2),
    performanceGap: (fundReturn - benchmarkReturn).toFixed(2)
  };

  console.log("✅ FINAL RESULT:", result);

  return result;
};