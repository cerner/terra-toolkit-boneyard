const VerboseReporter = require('@jest/reporters/build/verbose_reporter').default;

const fs = require('fs');
// const path = require('path');

// const filePath = path.resolve(__dirname, './result.txt');

class JestFileReporter extends VerboseReporter {
  // eslint-disable-next-line no-useless-constructor
  constructor(globalConfig) {
    super(globalConfig);
  }

  // eslint-disable-next-line class-methods-use-this
  log(message) {
    fs.appendFile('./result.txt', `${message}`);
  }
}
module.exports = JestFileReporter;
