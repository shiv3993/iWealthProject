module.exports = {
  testEnvironment: "node",
  testTimeout: 30000,
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/src/config/"
  ]
};