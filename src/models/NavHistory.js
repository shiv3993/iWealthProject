const mongoose = require("mongoose");

const navPointSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    nav: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const navHistorySchema = new mongoose.Schema(
  {
    schemeCode: {
      type: Number,   
      required: true,
      unique: true,
    },

    history: {
      type: [navPointSchema],
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model("NavHistory", navHistorySchema);