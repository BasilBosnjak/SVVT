export default {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/server/test-utils/jestSetup.js"],
  testPathIgnorePatterns: ["/node_modules/", "/client/", "/server/system-tests/"],
  collectCoverageFrom: [
    "server/**/*.js",
    "!server/seed.js",
    "!server/index.js",
    "!server/system-tests/**",
    "!server/test-utils/**",
    "!server/**/*.test.js",
  ],
};
