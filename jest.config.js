module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 20000,
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: './reports',
      outputName: 'junit.xml',
    }],
    ['jest-html-reporter', {
      pageTitle: 'Test Report',
      outputPath: `./reports/test-report-${(new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()).replace('T','-').replace(/:/g,'-').replace('.','-').slice(0, -5)}.html`,
      includeFailureMsg: true,
      includeConsoleLog: true
    }]
  ],
  setupFilesAfterEnv: ['./src/config/jest.setup.ts'],
  testMatch: ["**/src/tests/*.test.ts"],
};
