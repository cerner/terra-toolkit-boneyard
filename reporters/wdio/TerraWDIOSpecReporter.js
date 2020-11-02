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
      output: {},
      endDate: '',
    };
    this.fileName = '';
    this.moduleName = process.cwd().split(path.sep).pop();

    this.setResultsDir = this.setResultsDir.bind(this);
    this.hasResultsDir = this.hasResultsDir.bind(this);
    this.setTestModule = this.setTestModule.bind(this);
    this.printSummary = this.printSummary.bind(this);

    this.setResultsDir();
    this.hasResultsDir();

    this.on('runner:end', (runner) => {
      this.runners.push(runner);
    });
  }

  /**
  * Overriding this method, so the base reporter does not print output to the terminal
  */
  // eslint-disable-next-line class-methods-use-this
  printSuiteResult() {

  }

  /**
   * Sets results directory for the test run. Uses the wdio reporterOptions.outputDir if set, otherwise
   * it outputs to tests?/wdio/reports.
   * @return null;
   */
  setResultsDir() {
    const { reporterOptions } = this.options;
    if (reporterOptions && reporterOptions.outputDir) {
      this.resultsDir = reporterOptions.outputDir;
    } else {
      let testDir = 'tests';
      if (fs.existsSync(path.join(process.cwd(), 'test'))) {
        testDir = 'test';
      }
      this.resultsDir = path.join(process.cwd(), testDir, 'wdio', 'reports');
    }
  }

  /**
  * Check and create reports dir if doesn't exist
  * @return null
  */
  hasResultsDir() {
    if (!fs.existsSync(this.resultsDir)) {
      fs.mkdirSync(this.resultsDir, { recursive: true }, (err) => {
        if (err) {
          Logger.error(err.message, { context: LOG_CONTEXT });
        }
      });
    }
  }

  /**
  * Formatting the filename based on locale, theme, and formFactor
  * @return null
  */
  fileNameCheck({ formFactor, locale, theme }, browserName) {
    const fileNameConf = ['result'];
    if (locale) {
      fileNameConf.push(locale);
      this.resultJsonObject.locale = locale;
    }

    if (theme) {
      fileNameConf.push(theme);
      this.resultJsonObject.theme = theme;
    }

    if (formFactor) {
      fileNameConf.push(formFactor);
      this.resultJsonObject.formFactor = formFactor;
    }

    if (browserName) {
      fileNameConf.push(browserName);
    }

    this.fileName = fileNameConf.join('-');
  }

  /**
  * Set the package name to moduleName property if specsValue contains /package string
  * @param {string} specsValue - File path of current spec file from runners
  * @return null
  */
  setTestModule(specsValue) {
    const index = specsValue.lastIndexOf('packages');
    if (index > -1) {
      const testFilePath = specsValue.substring(index).split(path.sep);
      const moduleName = testFilePath && testFilePath[1] ? testFilePath[1] : process.cwd().split(path.sep).pop();
      if (moduleName && moduleName !== this.moduleName) {
        this.moduleName = moduleName;
      }
    }
  }

  /**
  * Writes result to a json file
  * @param {array} runners - collection of all test suites with event, specHash, spec path info
  * @return null
  */
  printSummary() {
    const { runners } = this;
    if (runners && runners.length) {
      runners.forEach((runner, index) => {
        // determine correct file name given configuration for run
        if (index === 0) {
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
          this.resultJsonObject.output[this.moduleName].push(readableMessage.split(/\n/g).filter(Boolean));
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

        const filePathLocation = path.join(this.resultsDir, `${this.fileName}-${key}.json`);
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
    this.resultJsonObject.endDate = new Date(end).toLocaleString();
    this.resultJsonObject.startDate = new Date(start).toLocaleString();
    this.printSummary();
  }
}

TerraWDIOSpecReporter.reporterName = 'TerraWDIOSpecReporter';
module.exports = TerraWDIOSpecReporter;
