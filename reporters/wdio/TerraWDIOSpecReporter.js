const WDIOSpecReporter = require('wdio-spec-reporter/build/reporter');
const stripAnsi = require('strip-ansi');
const fs = require('fs');
const endOfLine = require('os').EOL;
const path = require('path');
const Logger = require('../../scripts/utils/logger');

const LOG_CONTEXT = '[Terra-Toolkit:terra-wdio-spec-reporter]';

class TerraWDIOSpecReporter extends WDIOSpecReporter {
  constructor(globalConfig, options) {
    super(globalConfig);
    this.options = options;
    this.runners = [];
    this.resultJsonObject = {
      startDate: '',
      type: 'wdio',
      locale: '',
      formFactor: '',
      theme: '',
      output: [],
      endDate: '',
    };
    this.fileName = '';
    this.moduleName = process.cwd().split('/').pop();
    this.setResultsDir = this.setResultsDir.bind(this);
    this.hasReportDir = this.hasReportDir.bind(this);
    this.setTestModule = this.setTestModule.bind(this);
    this.getIsMonoRepo = this.getIsMonoRepo.bind(this);
    this.printSummary = this.printSummary.bind(this);
    this.setTestDirPath = this.setTestDirPath.bind(this);
    this.isMonoRepo = this.getIsMonoRepo();
    this.filePath = this.setResultsDir(options);
    this.hasReportDir();
    this.on('runner:end', (runner) => {
      this.runners.push(runner);
    });
  }

  /**
  * output test results in tests/wdio/reports/results or test/wdio/reports/results
  * depending on whether tests or test is the directory with tests
  * @return string
  */
  // eslint-disable-next-line class-methods-use-this
  setTestDirPath() {
    let testDir = 'tests';
    if (fs.existsSync(path.join(process.cwd(), 'test'))) {
      testDir = 'test';
    }
    return path.join(testDir, 'wdio', 'reports');
  }

  /**
  * checks global config has outputDir config
  * return global config if available
  * return /tests path if global config not available
  * @param {object} options
  * @return string
  */
  setResultsDir(options) {
    if (options.reporterOptions && options.reporterOptions.outputDir) {
      return options.reporterOptions.outputDir;
    }
    return path.join(process.cwd(), this.setTestDirPath());
  }

  /**
  * Check and create reports dir if doesn't exist
  * @return null
  */
  hasReportDir() {
    if (!fs.existsSync(this.filePath)) {
      fs.mkdirSync(this.filePath, { recursive: true }, (err) => {
        if (err) {
          Logger.error(err.message, { context: LOG_CONTEXT });
        }
      });
    }
  }

  // eslint-disable-next-line class-methods-use-this
  getIsMonoRepo() {
    return fs.existsSync(path.join(process.cwd(), 'packages'));
  }

  /**
  * Formatting the filename based on LOCALE, THEME, FORM_FACTOR and locale
  * @return null
  */
  fileNameCheck({ formFactor, locale, theme }, browserName) {
    const fileNameConf = [];
    if (locale) {
      fileNameConf.push(locale);
    }
    if (theme) {
      fileNameConf.push(theme);
    }
    if (formFactor) {
      fileNameConf.push(formFactor);
    }
    if (browserName) {
      fileNameConf.push(browserName);
    }
    if (fileNameConf.length === 0) {
      this.fileName = '/result';
    }
    if (fileNameConf.length >= 1) {
      this.fileName = `/result-${fileNameConf.join('-')}`;
    }
  }

  /**
  * Set the package name to moduleName property if specsValue contains /package string
  * @param {string} specsValue
  * @return null
  */
  setTestModule(specsValue) {
    const index = specsValue.lastIndexOf('packages/');
    if (index > -1) {
      const testFilePath = specsValue.substring(index).split('/');
      const moduleName = testFilePath && testFilePath[1] ? testFilePath[1] : '';
      if (moduleName && moduleName !== this.moduleName) {
        this.moduleName = moduleName;
      }
    }
  }

  /**
  * Writes result to a json file
  * @param {array} runners
  * @return null
  */
  printSummary(runners) {
    if (runners && runners.length) {
      runners.forEach((runner, index) => {
        if (index === 1) {
          const { cid } = runner;
          const { stats } = this.baseReporter;
          const results = stats.runners[cid];
          const { config } = results;
          const { browserName } = config.desiredCapabilities;
          this.fileNameCheck(config, browserName);
        }
        this.setTestModule(runner.specs[0]);
        if (!this.resultJsonObject.output[this.moduleName]) {
          this.resultJsonObject.output[this.moduleName] = [];
        }
        const readableMessage = `${stripAnsi(this.getSuiteResult(runner))}${endOfLine}`;
        if (readableMessage.search('\n') !== -1) {
          this.resultJsonObject.output[this.moduleName].push(readableMessage.split(/\n/g));
        }
      });
    }
    const {
      endDate,
      startDate,
      locale,
      formFactor,
      theme,
      output,
    } = this.resultJsonObject;
    let filePathLocation = '';
    const moduleKeys = Object.keys(output) || [];
    if (output && moduleKeys.length) {
      moduleKeys.forEach(key => {
        const fileData = {
          startDate,
          locale,
          theme,
          formFactor,
          output: output[key],
          endDate,
        };
        if (this.isMonoRepo) {
          filePathLocation = `${this.filePath}${this.fileName}-${key}.json`;
        } else {
          filePathLocation = `${this.filePath}${this.fileName}-${this.moduleName}.json`;
        }
        fs.writeFileSync(filePathLocation, `${JSON.stringify(fileData, null, 2)}`, { flag: 'w+' }, (err) => {
          if (err) {
            Logger.error(err.message, { context: LOG_CONTEXT });
          }
        });
      });
    }
  }

  printSuitesSummary() {
    const { end, start } = this.baseReporter.stats;
    const { LOCALE, THEME, FORM_FACTOR } = process.env;
    this.resultJsonObject.endDate = new Date(end).toLocaleString();
    this.resultJsonObject.startDate = new Date(start).toLocaleString();
    this.resultJsonObject.locale = LOCALE;
    this.resultJsonObject.formFactor = FORM_FACTOR;
    this.resultJsonObject.theme = THEME || 'default-theme';
    const { runners } = this;
    this.printSummary(runners);
  }
}

module.exports = TerraWDIOSpecReporter;
