const VerboseReporter = require('@jest/reporters/build/verbose_reporter');

class JestFileReporter extends VerboseReporter {
  constructor(globalConfig) {
    super(globalConfig);
  }

  // eslint-disable-next-line class-methods-use-this
  log(message) {
    console.log(message);
  }
}

module.exports = JestFileReporter;
