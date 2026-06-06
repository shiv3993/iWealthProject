require("dotenv").config();

const axios = require("axios");
const connectDB = require("../config/mongo");
const NavHistory = require("../models/NavHistory");

const SCHEME_CODE = 125497;

function parseDate(dateStr) {
  const [day, month, year] = dateStr.split("-");
  return new Date(`${year}-${month}-${day}`);
}

async function importNavData() {
  try {
    await connectDB();

    const url = `https://api.mfapi.in/mf/${SCHEME_CODE}`;
    const response = await axios.get(url);

    const navData = response.data.data;

    console.log(`Fetched ${navData.length} records`);

    const startDate = new Date("2023-06-05");
    const endDate = new Date("2026-06-04");

    const filteredData = navData.filter((record) => {
      const recordDate = parseDate(record.date);
      return recordDate >= startDate && recordDate <= endDate;
    });

    console.log(`Records in range: ${filteredData.length}`);

    // STEP 1: convert into embedded format
    const historyArray = filteredData.map((record) => ({
      date: parseDate(record.date),
      nav: Number(record.nav),
    }));

    // STEP 2: UPSERT SINGLE DOCUMENT
    const result = await NavHistory.updateOne(
      { schemeCode: SCHEME_CODE },   // schemaCode remains SAME ✅
      {
        $set: {
          schemeCode: SCHEME_CODE,
        },
        $push: {
          history: {
            $each: historyArray,
          },
        },
      },
      { upsert: true }
    );

    console.log("DB Update Result:", result);
    console.log("Import Completed 🚀");

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

importNavData();