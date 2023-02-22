// jest.config.js
export default {
  // The bail config option can be used here to have Jest stop running tests after
  // the first failure.
  bail: false,

  // Indicates whether each individual test should be reported during the run.
  verbose: false,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // The directory where Jest should output its coverage files.
  coverageDirectory: "./coverage/",

  // If the test path matches any of the patterns, it will be skipped.
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/algorithms/logging/",
  ],

  // If the file path matches any of the patterns, coverage information will be skipped.
  coveragePathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/utils/testing/__test__/fixtures.js",
    "<rootDir>/utils/logging",
  ],

  // This option sets the URL for the jsdom environment.
  // It is reflected in properties such as location.href.
  // @see: https://github.com/facebook/jest/issues/6769
  testEnvironmentOptions: {
    url: "http://localhost/",
  },

  // @see: https://jestjs.io/docs/en/configuration#coveragethreshold-object
  coverageThreshold: {
    global: {
      statements: 95,
      branches: 90,
      functions: 95,
      lines: 95,
    },
  },

  // Handle module aliases (this will be automatically configured for you soon)
  moduleNameMapper: {
    "^#math/(.*)$": "<rootDir>/algorithms/math/$1",
    "^#gutils/(.*)$": "<rootDir>/data-structures/graph/utils/$1",
    "^#algorithms/(.*)$": "<rootDir>/algorithms/$1",
    "^#galgorithms/(.*)$": "<rootDir>/data-structures/graph/algorithms/$1",
    "^#dstructures/(.*)$": "<rootDir>/data-structures/$1",
  },

  notify: true,

  reporters: [
    ["jest-slow-test-reporter", { numTests: 20, color: true }],
    "jest-progress-bar-reporter",
  ],
};
