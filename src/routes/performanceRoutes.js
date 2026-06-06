const express = require("express");
const router = express.Router();

const { validateCompareRequest } = require("../validators/performanceValidator");
const { comparePerformance } = require("../controllers/performanceController");

router.post(
  "/performance/compare",
  validateCompareRequest,   // 👈 validation middleware FIRST
  comparePerformance
);

module.exports = router;