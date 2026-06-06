const service = require("../services/historyService");

exports.getHistory = async (req, res) => {
  try {
    const { fundId, benchmarkId, startDate, endDate } = req.body;

    const data = await service.getHistory({
      fundId,
      benchmarkId,
      startDate,
      endDate
    });

    return res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
};