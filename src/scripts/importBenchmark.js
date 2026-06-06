require("dotenv").config();

const fs = require("fs");
const csv = require("csv-parser");

const connectDB = require("../config/mongo");
const BenchmarkHistory = require("../models/BenchmarkHistory");

const BENCHMARK_CODE = "NIFTY50";

function parseDate(dateStr) {
  return new Date(dateStr);
}

async function importBenchmark() {
  try {
    await connectDB();

    const history = [];

    fs.createReadStream("./data/nifty50.csv")
      .pipe(csv())
      .on("data", (row) => {
        history.push({
          date: parseDate(row["Date"]),
          close: Number(row["Close"])
        });
      })
      .on("end", async () => {
        console.log(`Found ${history.length} rows`);

        // OPTIONAL: sort by date (important for clean time-series)
        history.sort((a, b) => a.date - b.date);

        const result = {
          benchmarkCode: BENCHMARK_CODE,
          history: history
        };

        await BenchmarkHistory.updateOne(
          { benchmarkCode: BENCHMARK_CODE },
          { $set: result },
          { upsert: true }
        );

        console.log("Benchmark import completed");

        process.exit(0);
      });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

importBenchmark();