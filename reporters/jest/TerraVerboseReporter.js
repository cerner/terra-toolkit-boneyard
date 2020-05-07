const VerboseReporter = require('@jest/reporters/build/verbose_reporter').default;
const stripAnsi = require('strip-ansi');
const fs = require('fs');
const path = require('path');
const endOfLine = require('os').EOL;
const Logger = require('../../scripts/utils/logger');

const LOG_CONTEXT = '[Terra-Toolkit:terra-verbose-reporter]';

class TerraVerboseReporter extends VerboseReporter {
  constructor(globalConfig) {
    super(globalConfig);
    if (!globalConfig.rootDir) {
      this.resultDir = path.join(process.cwd(), '/tests/jest/reports/results');
    } else {
      this.resultDir = path.join(globalConfig.rootDir, 'tests/jest/reports/results');
    }
    this.filePathLocation = `${this.resultDir}/terra-verbose-results.json`;
    this.results = {
      startDate: '',
      output: [],
      endDate: '',
    };
    this.unformattedResult = [];
    this.log = this.log.bind(this);
    this.hasResultsDir = this.hasResultsDir.bind(this);
    this.hasResultsDir();
  }

  hasResultsDir() {
    if (!fs.existsSync(this.resultDir)) {
      fs.mkdirSync(this.resultDir, { recursive: true }, (err) => {
        if (err) {
          Logger.error(err.message, { context: LOG_CONTEXT });
        }
      });
    }
  }

  onRunStart(aggregatedResults) {
    this.results.startDate = new Date(aggregatedResults.startTime).toLocaleString();
  }

  log(message) {
    const readableMessage = `${stripAnsi(message)}${endOfLine}`;
    if (readableMessage.search('\n') !== -1) {
      this.results.output.push(readableMessage.split(/\n/g).forEach((piece) => {
        this.unformattedResult.push(piece);
      }));
    }
    this.results.output = this.unformattedResult.filter((obj) => obj);
  }

  onRunComplete() {
    this.results.endDate = new Date().toLocaleString();
    fs.writeFile(this.filePathLocation, `${JSON.stringify(this.results, null, 2)}`, { flag: 'w+' }, (err) => {
      if (err) {
        Logger.error(err.message, { context: LOG_CONTEXT });
      }
    });
  }
}
module.exports = TerraVerboseReporter;
