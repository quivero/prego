module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  env: { jest: true },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
      camelcase: "off",
  },
};
