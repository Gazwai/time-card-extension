/** @type {import('jest').Config} */
const config = {
  testEnvironment: "jsdom",
  testEnvironmentOptions: {
    html: '<html lang="zh-cmn-Hant"></html>',
    url: "https://jestjs.io/",
    userAgent: "Agent/007",
  },
  setupFilesAfterEnv: ["./jest.set.js"],
};

module.exports = config;
