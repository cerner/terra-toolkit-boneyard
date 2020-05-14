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
    this.filePath = '';
    this.filePathLocation = '';
    this.results = {
      startDate: '',
      output: [],
      endDate: '',
    };
    this.unformattedResult = [];
    this.isMonoRepo = false;
    this.moduleName = '';
    this.log = this.log.bind(this);
    this.hasResultsDir = this.hasResultsDir.bind(this);
    this.setTestModule = this.setTestModule.bind(this);
    this.setTestDirPath = this.setTestDirPath.bind(this);
    this.setResultDir = this.setResultDir.bind(this);
    this.hasMonoRepo = this.hasMonoRepo.bind(this);
    this.logMonoRepo = this.logMonoRepo.bind(this);
    this.hasMonoRepo();
    this.setTestDirPath();
    this.setResultDir(globalConfig);
    this.hasResultsDir();
  }

  setTestDirPath() {
    if (fs.existsSync(path.join(process.cwd(), '/tests'))) {
      this.filePath = '/tests/jest/reports/results';
    } else if (fs.existsSync(path.join(process.cwd(), '/test'))) {
      this.filePath = '/test/jest/reports/results';
    } else {
      this.filePath = '/tests/jest/reports/results';
    }
  }

  setResultDir(globalConfig) {
    if (!globalConfig.rootDir) {
      this.resultDir = path.join(process.cwd(), this.filePath);
    } else {
      this.resultDir = path.join(globalConfig.rootDir, this.filePath);
    }
    this.filePathLocation = `${this.resultDir}/terra-verbose-results.json`;
  }

  hasMonoRepo() {
    if (fs.existsSync(path.join(process.cwd(), '/packages'))) {
      this.isMonoRepo = true;
    }
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

  setTestModule(testLog) {
    const index = testLog.lastIndexOf('packages/');
    if (index > -1) {
      const testFilePath = testLog.substring(index).split('/');
      const moduleName = testFilePath && testFilePath[1] ? testFilePath[1] : '';
      if (moduleName && moduleName !== this.moduleName) {
        this.moduleName = moduleName;
      }
    }
  }

  onRunStart(aggregatedResults) {
    this.results.startDate = new Date(aggregatedResults.startTime).toLocaleString();
  }

  logMonoRepo(message) {
    this.setTestModule(message);
    if (!this.results.output[this.moduleName]) {
      this.results.output[this.moduleName] = [];
    }
    if (!this.unformattedResult[this.moduleName]) {
      this.unformattedResult[this.moduleName] = [];
    }
    if (message.search('\n') !== -1) {
      this.results.output[this.moduleName].push(message.split(/\n/g).forEach((piece) => {
        this.unformattedResult[this.moduleName].push(piece);
      }));
    }
    this.results.output[this.moduleName] = this.unformattedResult[this.moduleName].filter((obj) => obj);
  }

  log(message) {
    const readableMessage = `${stripAnsi(message)}${endOfLine}`;
    if (!this.isMonoRepo) {
      if (readableMessage.search('\n') !== -1) {
        this.results.output.push(readableMessage.split(/\n/g).forEach((piece) => {
          this.unformattedResult.push(piece);
        }));
      }
      this.results.output = this.unformattedResult.filter((obj) => obj);
    } else {
      this.logMonoRepo(readableMessage);
    }
  }

  onRunComplete() {
    this.results.endDate = new Date().toLocaleString();
    if (!this.isMonoRepo) {
      fs.writeFileSync(this.filePathLocation, `${JSON.stringify(this.results, null, 2)}`, { flag: 'w+' }, (err) => {
        if (err) {
          Logger.error(err.message, { context: LOG_CONTEXT });
        }
      });
    } else {
      const { startDate, endDate, output } = this.results;
      const moduleKeys = Object.keys(output) || [];
      if (output && moduleKeys.length) {
        moduleKeys.forEach(key => {
          const fileData = {
            startDate,
            output: output[key],
            endDate,
          };
          fs.writeFileSync(`${this.resultDir}/${key}.json`, `${JSON.stringify(fileData, null, 2)}`, { flag: 'w+' }, (err) => {
            if (err) {
              Logger.error(err.message, { context: LOG_CONTEXT });
            }
          });
        });
      }
    }
  }
}
module.exports = TerraVerboseReporter;
