/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
const VerboseReporter = require('@jest/reporters/build/verbose_reporter').default;
const stripAnsi = require('strip-ansi');
const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../../tests/jest/reports/coverage/JestTestResults.txt');

class JestFileReporter extends VerboseReporter {
  // eslint-disable-next-line no-useless-constructor
  constructor(globalConfig) {
    super(globalConfig);
  }

  //  This stage is before the test run starts. So grab the start date/time of when the tests start.
  onRunStart(aggregatedResults, options) {
    const date = new Date(aggregatedResults.startTime).toLocaleString();
    fs.appendFile(filePath, `Started: ${date}\n\n`);
  }

  // Override the verbose reporter log method such that the test results gets displayed on a text file.
  log(message) {
    fs.appendFile(filePath, `${stripAnsi(message)}\n`, (err) => {
      if (err) {
        throw err;
      }
    });
  }

  // This stage is fired off after the log method is executed.So grab the end date/time of when the tests ended in this stage.
  onRunComplete(_contexts, _aggregatedResults) {
    const date = new Date().toLocaleString();
    fs.appendFile(filePath, `\nEndDate: ${date}\n\n`);
  }
}
module.exports = JestFileReporter;
