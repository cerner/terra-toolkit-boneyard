const events = require('events');
const path = require('path');
const fs = require('fs');
const Logger = require('../../scripts/utils/logger');

const LOG_CONTEXT = '[Terra-Toolkit:terra-wdio-spec-details-reporter]';
const detailEvents = {
  latestScreenshot: 'terra-wdio:latest-screenshot',
  runnerStart: 'runner:start',
  suitStart: 'suite:start',
  testStart: 'test:start',
  testPass: 'test:pass',
  testFail: 'test:fail',
  testEnd: 'test:end',
  runnerEnd: 'runner:end',
};
class TerraWDIOTestDetailsReporter extends events.EventEmitter {
  constructor(globalConfig, options) {
    super(globalConfig);
    this.options = options;
    this.fileName = '';
    this.resultJsonObject = {
      locale: '',
      theme: '',
      formFactor: '',
      capabilities: {
        browserName: '',
      },
      specs: {},
    };
    this.moduleName = '';
    this.setResultsDir.bind(this);
    this.hasResultsDir.bind(this);
    this.writeToFile.bind(this);
    this.setTestModule = this.setTestModule.bind(this);
    this.title = '';
    this.state = '';
    this.error = {};
    this.screenshots = [];
    this.specHashData = {};
    this.nonMonoRepoResult = [];
    this.resultsDir = '';
    this.registerListeners = this.registerListeners.bind(this);
    this.registerListeners();
  }

  registerListeners() {
    this.on(detailEvents.runnerStart, this.runnerStart.bind(this));
    this.on(detailEvents.latestScreenshot, this.latestScreenshot.bind(this));
    this.on(detailEvents.suitStart, this.suitStart.bind(this));
    this.on(detailEvents.testStart, this.testStart.bind(this));
    this.on(detailEvents.testPass, this.testPass.bind(this));
    this.on(detailEvents.testFail, this.testFail.bind(this));
    this.on(detailEvents.testEnd, this.testEnd.bind(this));
    this.on(detailEvents.runnerEnd, this.runnerEnd.bind(this));
  }

  latestScreenshot(screenshotPath) {
    this.screenshots.push(screenshotPath.screenshotPath);
  }

  runnerStart(runner) {
    this.setTestModule(runner.specs[0]);
    this.setResultsDir();
    this.hasResultsDir();
    this.resultJsonObject.locale = runner.config.locale;
    this.resultJsonObject.capabilities.browserName = runner.config.browserName;
    this.resultJsonObject.formFactor = runner.config.formFactor;
    this.resultJsonObject.theme = runner.capabilities.theme || 'default-theme';
    this.fileNameCheck(runner.config, runner.capabilities, this.moduleName);
  }

  /**
   * Format class member specHashData with runner's specHash. If its monorepo formatting the specHash inside the moduleName
   * @param {Object} params
   */
  suitStart(params) {
    const { specHash, title, parent, fullTitle } = params;
    const { specHashData, moduleName } = this;
    if (moduleName) {
      if (!specHashData[moduleName]) {
        specHashData[moduleName] = {};
      }
      if (!specHashData[moduleName][specHash]) {
        specHashData[moduleName][specHash] = {};
      }
      if (!specHashData[moduleName][specHash][title]) {
        specHashData[moduleName][specHash][title] = {
          parent,
          title,
          tests: [],
        };
      }
    } else {
      if (!specHashData[specHash]) {
        specHashData[specHash] = {};
      }
      if (!specHashData[specHash][fullTitle]) {
        specHashData[specHash][fullTitle] = {
          parent: fullTitle === title ? title : parent,
          title,
          tests: [],
        };
      }
    }
  }

  testStart(test) {
    this.title = test.title;
  }

  testPass() {
    this.state = 'passed';
  }

  testFail(test) {
    this.error = {
      name: 'Error',
      message: test.err.message,
      stack: test.err.stack,
      type: test.err.type,
    };
    this.state = 'fail';
  }

  /**
   * update specHashData with description, success, screenshots
   * @param {Object} test
   * @return null
   */
  testEnd(test) {
    const { specHash, parent, fullTitle, title } = test;
    const { specHashData, moduleName } = this;
    const specParent =  fullTitle.replace(` ${title}`, '')

    const testInfo = {
      title: this.title,
      state: this.state,
      screenshots: this.screenshots
    }
    if (this.state === 'fail') {
      testInfo.error = this.error
    }
  
    if (
      moduleName
      && specHashData[moduleName][specHash]
      && specHashData[moduleName][specHash][specParent]
    ) {
      const { tests } = specHashData[moduleName][specHash][specParent];
      tests.push(testInfo);
    } else if (specHashData[specHash] && specHashData[specHash][specParent]) {
      specHashData[specHash][specParent].tests.push(testInfo);
    }
    this.screenshots = [];
  }

  /**
   * Format resultJsonObject based on parent and nest the tests
   * @return null
   */
  runnerEnd(runner) {
    const specData = this.moduleName && this.specHashData[this.moduleName] ? this.specHashData[this.moduleName] : this.specHashData;
    Object.values(specData).forEach((spec) => {
      const revSpecs = Object.values(spec);
      revSpecs.forEach((test, i) => {
        if (test.parent === test.title) {
          const { title, parent, ...rest } = revSpecs[i];
          revSpecs[i] = {
            title,
            spec: runner.specs[0],
            ...rest,
          };
        }
        if (test.parent !== test.title) {
          const parentIndex = revSpecs.findIndex(
            (item) => item.title === test.parent,
          );
          if (parentIndex > -1) {
            if (!revSpecs[parentIndex].suites) {
              revSpecs[parentIndex].suites = [];
            }
            revSpecs[parentIndex].suites.push(test);
            // eslint-disable-next-line no-param-reassign
            delete test.parent;
          }
        }
        // eslint-disable-next-line no-param-reassign
        delete test.parent;
      });
      if (this.moduleName) {
        const filePathLocation = path.join(
          this.resultsDir,
          `${this.fileName}.json`,
        );
        this.resultJsonObject.specs[this.moduleName] = revSpecs.filter(item => item.spec);
        this.writeToFile(
          this.resultJsonObject.specs[this.moduleName],
          filePathLocation,
        );
      } else {
        this.nonMonoRepoResult.push(...revSpecs.filter(item => item.spec));
      }
    });
    if (!this.moduleName) {
      this.resultJsonObject.specs = this.nonMonoRepoResult;
      const filePathLocation = path.join(
        this.resultsDir,
        `${this.fileName}.json`,
      );
      this.writeToFile(this.resultJsonObject, filePathLocation);
    }
    this.screenshots = [];
    this.specHashData = {};
  }

  /**
   * Set the package name to moduleName property if specsValue contains /package string
   * @param {string} specsValue - File path of current spec file from runners
   * @return null
   */
  setTestModule(specsValue) {
    const index = specsValue.lastIndexOf('packages/');
    if (index > -1) {
      const testFilePath = specsValue.substring(index).split(path.sep);
      const moduleName = testFilePath && testFilePath[1]
        ? testFilePath[1]
        : process.cwd().split(path.sep).pop();
      if (moduleName && moduleName !== this.moduleName) {
        this.moduleName = moduleName;
      }
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
   * Formatting the filename based on locale, theme, and formFactor
   * @return null
   */
  fileNameCheck({ formFactor, locale, theme }, { browserName }, moduleName) {
    const fileNameConf = ['functional-test-details'];
    if (moduleName) {
      fileNameConf.push(moduleName);
    }
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
      this.resultJsonObject.capabilities.browserName = browserName;
    }

    this.fileName = fileNameConf.join('-');
  }

  /**
   * writes data to the file
   * @param {string} data - Data that should be written to the file
   * @param {string} filePath - Location of the file
   * @return null
   */
  // eslint-disable-next-line class-methods-use-this
  writeToFile(data, filePath) {
    try {
      const json = `${JSON.stringify(data, null, 2)}`;
      const options = { flag: 'w+' };
      fs.writeFileSync(filePath, json, options);
    } catch (err) {
      Logger.error(err.message, { context: LOG_CONTEXT });
    }
  }
}

TerraWDIOTestDetailsReporter.reporterName = 'TerraWDIOTestDetailsReporter';
module.exports = TerraWDIOTestDetailsReporter;
