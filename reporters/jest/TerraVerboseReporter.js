const VerboseReporter = require('@jest/reporters/build/verbose_reporter').default;
const stripAnsi = require('strip-ansi');
const fs = require('fs');
const path = require('path');
const endOfLine = require('os').EOL;
const Logger = require('../../scripts/utils/logger');

const LOG_CONTEXT = '[Terra-Toolkit:theme-aggregator]';

class TerraVerboseReporter extends VerboseReporter {
  constructor(globalConfig) {
    super(globalConfig);
    if (!globalConfig.rootDir) {
      this.resultDir = path.resolve(__dirname, '..', '..', 'tests/jest/reports/results');
    } else {
      this.resultDir = path.resolve(globalConfig.rootDir, 'tests/jest/reports/results');
    }
    this.filePathLocation = `${this.resultDir}/result-output.json`;
    this.results = {
      startDate: '',
      output: [],
      endDate: '',
    };
    this.unformattedResult = [];
    this.log = this.log.bind(this);
    this.checkResultDirExist = this.checkResultDirExist.bind(this);
    this.checkResultDirExist();
  }

  hasReportDir() {
    const reportDir = path.resolve(this.resultDir, '..');
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir);
    }
  }

  checkResultDirExist() {
    if (this.resultDir && !fs.existsSync(this.resultDir)) {
      this.hasReportDir();
      fs.mkdirSync(this.resultDir);
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
        Logger.error(err.message, { context: LOG_CONTEXT });
      }
    });
  }
}
module.exports = TerraVerboseReporter;
