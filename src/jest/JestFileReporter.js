const VerboseReporter = require('@jest/reporters/build/verbose_reporter').default;
const stripAnsi = require('strip-ansi');
const fs = require('fs');
const path = require('path');

class JestFileReporter extends VerboseReporter {
  // eslint-disable-next-line no-useless-constructor
  constructor(globalConfig) {
    super(globalConfig);
    this.filePath = path.resolve(globalConfig.coverageDirectory, 'JestTestResults.txt');
  }

  //  This stage is before the test run starts. So grab the start date/time of when the tests start.
  onRunStart(aggregatedResults) {
    const date = new Date(aggregatedResults.startTime).toLocaleString();
    fs.appendFile(this.filePath, `Started: ${date}\n\n`, { flag: 'a+' }, (err) => {
      if (err) {
        console.log(`File Error -> ${err.message}`);
      }
    });
  }

  // Override the verbose reporter log method such that the test results gets displayed on a text file.
  log(message) {
    fs.appendFile(this.filePath, `${stripAnsi(message)}\n`, { flag: 'a+' }, (err) => {
      if (err) {
        console.log(`File Error -> ${err.message}`);
      }
    });
  }

  // This stage is fired off after the log method is executed.So grab the end date/time of when the tests ended in this stage.
  onRunComplete() {
    const date = new Date().toLocaleString();
    fs.appendFile(this.filePath, `\nEndDate: ${date}\n\n`, { flag: 'a+' }, (err) => {
      if (err) {
        console.log(`File Error -> ${err.message}`);
      }
    });
  }
}
module.exports = JestFileReporter;
