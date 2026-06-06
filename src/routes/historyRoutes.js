const express = require("express");
const router = express.Router();

const { getHistory } = require("../controllers/historyController");
const { validateCompareRequest } = require("../validators/performanceValidator");

router.post(
  "/performance/history",
  validateCompareRequest,   // 👈 validation FIRST
  getHistory
);

module.exports = router;