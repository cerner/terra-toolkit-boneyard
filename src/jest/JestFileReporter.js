/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
const VerboseReporter = require('@jest/reporters/build/verbose_reporter').default;

const fs = require('fs');

// eslint-disable-next-line import/no-unresolved
const moment = require('moment');
// const path = require('path');

// const filePath = path.resolve(__dirname, './result.txt');

class JestFileReporter extends VerboseReporter {
  // eslint-disable-next-line no-useless-constructor
  constructor(globalConfig) {
    super(globalConfig);
  }

  //  eslint-disable-next-line class-methods-use-this
  onRunStart(aggregatedResults, options) {
    const startDate = moment(aggregatedResults.startTime).format('MM/DD/YYYY HH:mm:ss');
    fs.appendFile('./result.txt', `Started: ${startDate}\n\n`);
  }

  //  eslint-disable-next-line class-methods-use-this
  log(message) {
    fs.appendFile('./result.txt', `${message}\n`, (err) => {
      if (err) throw err;
    });
  }

  //  eslint-disable-next-line class-methods-use-this
  onRunComplete(_contexts, _aggregatedResults) {
    const date = moment(Date.now()).format('MM/DD/YYYY HH:mm:ss');
    fs.appendFile('./result.txt', `EndDate: ${date}\n\n`);
  }
}
module.exports = JestFileReporter;
