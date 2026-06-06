const NavHistory = require("../models/NavHistory");
const BenchmarkHistory = require("../models/BenchmarkHistory");

// helper: format date as YYYY-MM-DD
function formatDate(date) {
  return new Date(date).toISOString().slice(0, 10);
}

// helper: build date range array
function getDateRange(start, end) {
  const result = [];
  const current = new Date(start);

  while (current <= end) {
    result.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return result;
}

exports.getHistory = async ({
  fundId,
  benchmarkId,
  startDate,
  endDate
}) => {

  const start = new Date(startDate);
  const end = new Date(endDate);

  // 1️⃣ Fetch data
  const navDoc = await NavHistory.findOne({ schemeCode: Number(fundId) });
  if (!navDoc) throw new Error("Fund not found");

  const benchmarkDoc = await BenchmarkHistory.findOne({
    benchmarkCode: benchmarkId
  });
  if (!benchmarkDoc) throw new Error("Benchmark not found");

  // 2️⃣ Convert DB arrays into lookup maps (FAST O(1) search)
  const navMap = new Map();
  for (const h of navDoc.history) {
    navMap.set(formatDate(h.date), h.nav);
  }

  const benchMap = new Map();
  for (const h of benchmarkDoc.history) {
    benchMap.set(formatDate(h.date), h.close);
  }

  // 3️⃣ Build full date range
  const dates = getDateRange(start, end);

  // 4️⃣ Merge result day-by-day
  const result = dates.map(d => {
    const key = formatDate(d);

    return {
      date: key,
      nav: navMap.has(key) ? navMap.get(key) : null,
      benchmark: benchMap.has(key) ? benchMap.get(key) : null
    };
  });

  // 5️⃣ return response
  return {
    period: {
      startDate: startDate,
      endDate: endDate
    },
    data: result
  };
};