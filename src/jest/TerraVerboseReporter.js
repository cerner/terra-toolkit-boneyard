const VerboseReporter = require('@jest/reporters/build/verbose_reporter').default;
const stripAnsi = require('strip-ansi');
const fs = require('fs');
const path = require('path');
const endOfLine = require('os').EOL;
// const Logger = require('../../scripts/utils/logger');

// const LOG_CONTEXT = '[Terra-Toolkit:theme-aggregator]';

class TerraVerboseReporter extends VerboseReporter {
  constructor(globalConfig) {
    super(globalConfig);
    if (globalConfig.coverageDirectory === undefined) {
      this.reportDir = path.resolve(__dirname, '..', 'tests/jest/reports');
    } else {
      this.reportDir = path.resolve(globalConfig.coverageDirectory, '../results');
    }
    this.filePathLocation = `${this.reportDir}/result-output.json`;
    this.results = {
      StartDate: '',
      Output: [],
      EndDate: '',
    };
    this.unformattedResult = [];
    this.log = this.log.bind(this);
    this.checkResultDirExist = this.checkResultDirExist.bind(this);
    this.checkResultDirExist();
  }

  checkResultDirExist() {
    if (!fs.existsSync(this.reportDir)) {
      fs.mkdirSync(this.reportDir);
    }
  }

  onRunStart(aggregatedResults) {
    this.results.StartDate = new Date(aggregatedResults.startTime).toLocaleString();
  }

  log(message) {
    const readableMessage = `${stripAnsi(message)}${endOfLine}`;
    if (readableMessage.search('\n') !== -1) {
      this.results.Output.push(readableMessage.split(/\n/g).forEach((piece) => {
        this.unformattedResult.push(piece);
      }));
    }
    this.results.Output = this.unformattedResult.filter((obj) => obj);
  }

  onRunComplete() {
    this.results.EndDate = new Date().toLocaleString();
    fs.writeFile(this.filePathLocation, `${JSON.stringify(this.results, null, 2)}`, { flag: 'w+' }, (err) => {
      if (err) {
        console.log('file error => ', err.message);
        // Logger.error(err.message, { context: LOG_CONTEXT });
      }
    });
  }
}
module.exports = TerraVerboseReporter;
