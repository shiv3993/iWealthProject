const mongoose = require("mongoose");
const connectDB = require("../src/config/mongo");

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await mongoose.connection.close();
});