const mongoose = require("mongoose");

const benchmarkHistorySchema = new mongoose.Schema(
  {
    benchmarkCode: {
      type: String,
      required: true,
      unique: true
    },

    history: [
      {
        date: {
          type: Date,
          required: true
        },
        close: {
          type: Number,
          required: true
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "BenchmarkHistory",
  benchmarkHistorySchema
);