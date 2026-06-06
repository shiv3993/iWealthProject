const service = require("../services/performanceService");

console.log("API HIT");

exports.comparePerformance = async (req, res) => {
  try {
    const result = await service.comparePerformance(req.validatedInput);

    return res.status(200).json({
      success: true,
      data: result
    });

  } catch (err) {
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message
    });
  }
};