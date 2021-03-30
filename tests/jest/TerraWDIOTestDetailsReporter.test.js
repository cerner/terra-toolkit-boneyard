import fs from 'fs';
import TerraWDIOTestDetailsReporter from '../../reporters/wdio/TerraWDIOTestDetailsReporter';

jest.mock('fs');

describe.only('TerraWDIOTestDetailsReporter', () => {
  const originalProcessCwd = process.cwd;
  beforeAll(() => {
    process.cwd = jest.fn().mockImplementation(() => './terra-toolkit-boneyard');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.cwd = originalProcessCwd;
  });

  describe('initialization', () => {
    it('defines resultJsonObject', () => {
      const reporter = new TerraWDIOTestDetailsReporter({}, {});
      expect(reporter.resultJsonObject).toHaveProperty('locale');
      expect(reporter.resultJsonObject).toHaveProperty('theme');
      expect(reporter.resultJsonObject).toHaveProperty('formFactor');
      expect(reporter.resultJsonObject).toHaveProperty('capabilities');
      expect(reporter.resultJsonObject).toHaveProperty('specs');
      expect(reporter.resultJsonObject.capabilities).toHaveProperty('browserName');
      expect(typeof reporter.resultJsonObject.capabilities).toEqual('object');
      expect(typeof reporter.resultJsonObject.specs).toEqual('object');
    });

    it('defines fileName', () => {
      const reporter = new TerraWDIOTestDetailsReporter({}, {});
      expect(reporter.fileName).toBe('');
    });

    describe('determines results dir', () => {
      it('when outputDir has not been defined in configuration', () => {
        fs.existsSync.mockReturnValue(true);
        let reporter = new TerraWDIOTestDetailsReporter({}, {});
        reporter.setResultsDir();
        expect(reporter.resultsDir).toEqual(expect.stringContaining('test/wdio/reports'));

        fs.existsSync.mockReturnValue(false);
        reporter = new TerraWDIOTestDetailsReporter({}, {});
        reporter.setResultsDir();
        expect(reporter.resultsDir).toEqual(expect.stringContaining('test'));
      });

      it('when outputDir is defined in configuration', () => {
        const reporter = new TerraWDIOTestDetailsReporter({}, { reporterOptions: { outputDir: 'my-test-reports/wdio' } });
        reporter.setResultsDir();
        expect(reporter.resultsDir).toEqual('my-test-reports/wdio');
      });
    });

    describe('ensures results dir exists', () => {
      it('when dir exists', () => {
        fs.existsSync.mockReturnValue(true);
        const reporter = new TerraWDIOTestDetailsReporter({}, {});
        reporter.hasResultsDir();
        expect(fs.mkdirSync).not.toHaveBeenCalled();
      });

      it('when dir does not exists', () => {
        fs.existsSync.mockReturnValue(false);
        const reporter = new TerraWDIOTestDetailsReporter({}, {});
        reporter.hasResultsDir();
        expect(fs.mkdirSync).toHaveBeenCalled();
      });
    });
  });

  describe('fileNameCheck', () => {
    it('sets default file name', () => {
      const reporter = new TerraWDIOTestDetailsReporter({}, {});
      reporter.fileNameCheck({ }, '');
      expect(reporter.fileName).toEqual('functional-test-details');
      expect(reporter.resultJsonObject).toHaveProperty('locale', '');
      expect(reporter.resultJsonObject).toHaveProperty('theme', '');
      expect(reporter.resultJsonObject).toHaveProperty('formFactor', '');
      expect(reporter.resultJsonObject.capabilities).toHaveProperty('browserName', '');
    });

    it('sets file name with locale', () => {
      const reporter = new TerraWDIOTestDetailsReporter({}, {});
      reporter.fileNameCheck({ locale: 'en' }, '');
      expect(reporter.fileName).toEqual('functional-test-details-en');
      expect(reporter.resultJsonObject).toHaveProperty('locale', 'en');
      expect(reporter.resultJsonObject).toHaveProperty('theme', '');
      expect(reporter.resultJsonObject).toHaveProperty('formFactor', '');
      expect(reporter.resultJsonObject.capabilities).toHaveProperty('browserName', '');
    });

    it('sets file name with locale and theme', () => {
      const reporter = new TerraWDIOTestDetailsReporter({}, {});
      reporter.fileNameCheck({ locale: 'en', theme: 'default' }, '');
      expect(reporter.fileName).toEqual('functional-test-details-en-default');
      expect(reporter.resultJsonObject).toHaveProperty('locale', 'en');
      expect(reporter.resultJsonObject).toHaveProperty('theme', 'default');
      expect(reporter.resultJsonObject).toHaveProperty('formFactor', '');
      expect(reporter.resultJsonObject.capabilities).toHaveProperty('browserName', '');
    });

    it('sets file name with locale, theme and formFactor', () => {
      const reporter = new TerraWDIOTestDetailsReporter({}, {});
      reporter.fileNameCheck({ locale: 'en', theme: 'default', formFactor: 'tiny' }, '');
      expect(reporter.fileName).toEqual('functional-test-details-en-default-tiny');
      expect(reporter.resultJsonObject).toHaveProperty('locale', 'en');
      expect(reporter.resultJsonObject).toHaveProperty('theme', 'default');
      expect(reporter.resultJsonObject).toHaveProperty('formFactor', 'tiny');
      expect(reporter.resultJsonObject.capabilities).toHaveProperty('browserName', '');
    });

    it('sets file name with locale, theme, formFactor and browserName', () => {
      const reporter = new TerraWDIOTestDetailsReporter({}, {});
      reporter.fileNameCheck({ locale: 'en', theme: 'default', formFactor: 'tiny' }, { browserName: 'chrome' });
      expect(reporter.fileName).toEqual('functional-test-details-en-default-tiny-chrome');
      expect(reporter.resultJsonObject).toHaveProperty('locale', 'en');
      expect(reporter.resultJsonObject).toHaveProperty('theme', 'default');
      expect(reporter.resultJsonObject).toHaveProperty('formFactor', 'tiny');
      expect(reporter.resultJsonObject.capabilities).toHaveProperty('browserName', 'chrome');
    });
  });

  describe('setTestModule', () => {
    it('updates moduleName if mono-repo test file', () => {
      const reporter = new TerraWDIOTestDetailsReporter({}, {});
      expect(reporter.moduleName).toEqual('');
      reporter.setTestModule('terra-toolkit-boneyard/packages/my-package/tests/wdio/test-spec.js');
      expect(reporter.moduleName).toEqual('my-package');
    });

    it('does not updates moduleName if non mono-repo test file', () => {
      const reporter = new TerraWDIOTestDetailsReporter({}, {});
      expect(reporter.moduleName).toEqual('');
      reporter.setTestModule('terra-toolkit/tests/wdio/test-spec.js');
      expect(reporter.moduleName).toEqual('');
    });
  });

  describe('test:start', () => {
    it('test:start title should set ', () => {
      const reporter = new TerraWDIOTestDetailsReporter({}, {});
      reporter.emit('test:start', { title: 'title of the it' });
      expect(reporter.title).toEqual('title of the it');
    });
  });
  describe('reaches test:pass or test:fail', () => {
    it('test:pass description should set ', () => {
      const reporter = new TerraWDIOTestDetailsReporter({}, {});
      reporter.emit('test:pass', { state: 'passed' });
      expect(reporter.state).toEqual('passed');
    });
    it('test:fail description should set ', () => {
      const reporter = new TerraWDIOTestDetailsReporter({}, {});
      const err = {
        message: 'expected to be within the mismatch tolerance, but received the following comparison results \n{\n  "isSameDimensions": false,\n  "misMatchPercentage": 2.9\n}',
        stack: 'AssertionError: expected to be within the mismatch tolerance, but received the following comparison results \n{\n  "isSameDimensions": false,\n  "misMatchPercentage": 2.9\n}\n    at Object.runMatchScreenshotTest (/opt/module/lib/wdio/services/TerraCommands/visual-regression.js:39:33)\n    at Object.validatesElement [as element] (/opt/module/lib/wdio/services/TerraCommands/validate-element.js:50:29)\n    at Context.it (/opt/module/tests/wdio/validateElement-spec.js:20:23)\n    at new Promise (<anonymous>)\n    at new F (/opt/module/node_modules/babel-runtime/node_modules/core-js/library/modules/_export.js:36:28)',
        type: 'AssertionError',
      };
      reporter.emit('test:fail', { state: 'fail', err });
      expect(reporter.state).toEqual('fail');
    });
  });

  describe('terra-wdio:latest-screenshot', () => {
    it('terra-wdio:latest-screenshotshould set screenshotLink', () => {
      const reporter = new TerraWDIOTestDetailsReporter({}, {});
      reporter.emit('terra-wdio:latest-screenshot', { screenshotPath: 'opt/Image.png' });
      expect(reporter.screenshots[0]).toEqual('opt/Image.png');
    });
  });
  describe('runner:start', () => {
    it('runner:start should call the funtions', () => {
      const runner = {
        event: 'runner:start',
        cid: '0-1',
        specs: [
          '/opt/module/tests/wdio/validateElement-spec.js',
        ],
        capabilities: {
          browserName: 'chrome',
          maxInstances: 1,
        },
        config: {
          host: 'standalone-chrome',
          port: 4444,
          sync: true,
          specs: [
            'test*/wdio/**/*-spec.js',
          ],
          locale: 'fr',
          formFactor: 'huge',
          desiredCapabilities: {
            browserName: 'chrome',
            maxInstances: 1,
          },
        },
        specHash: 'fa372c346f402d6e30314f44107e880c',

      };
      const reporter = new TerraWDIOTestDetailsReporter({}, {});
      reporter.emit('runner:start', runner);
      reporter.setTestModule(runner.specs[0]);
      reporter.setResultsDir();
      reporter.hasResultsDir();
      expect(reporter.resultJsonObject.locale).toEqual('fr');
      expect(reporter.resultJsonObject.capabilities.browserName).toEqual('chrome');
      expect(reporter.resultJsonObject.formFactor).toEqual('huge');
      expect(reporter.resultJsonObject.theme).toEqual('default-theme');
      reporter.fileNameCheck(runner.config, runner.capabilities);
    });
  });
  describe('suite:start', () => {
    it('suite:start for mono repo', () => {
      const reporter = new TerraWDIOTestDetailsReporter({}, {});
      const params = {
        specHash: 'f75728c9953420794e669cae74b03d58',
        title: 'group2',
        parent: 'hideInputCaret',
      };
      reporter.moduleName = 'terra-clinical';
      reporter.emit('suite:start', params);
      expect(reporter.specHashData).toHaveProperty(reporter.moduleName);
      expect(reporter.specHashData[reporter.moduleName][params.specHash][params.title]).toHaveProperty('parent');
      expect(reporter.specHashData[reporter.moduleName][params.specHash][params.title]).toHaveProperty('title');
      expect(reporter.specHashData[reporter.moduleName][params.specHash][params.title]).toHaveProperty('tests');
      expect(typeof reporter.specHashData[reporter.moduleName][params.specHash][params.title].tests).toEqual('object');
    });
    it('suite:start for non mono repo', () => {
      const reporter = new TerraWDIOTestDetailsReporter({}, {});
      const params = {
        specHash: 'f75728c9953420794e669cae74b03d58',
        title: 'group2',
        parent: 'hideInputCaret',
      };
      reporter.emit('suite:start', params);
      expect(reporter.specHashData).not.toHaveProperty(reporter.moduleName);
      expect(reporter.specHashData[params.specHash][params.title]).toHaveProperty('parent');
      expect(reporter.specHashData[params.specHash][params.title]).toHaveProperty('title');
      expect(reporter.specHashData[params.specHash][params.title]).toHaveProperty('tests');
      expect(typeof reporter.specHashData[params.specHash][params.title].tests).toEqual('object');
    });
  });
  describe('test:end', () => {
    it('test:end should reset the screenshots array ', () => {
      const reporter = new TerraWDIOTestDetailsReporter({}, {});
      reporter.screenshots = ['/opt/module/tests/wdio/__snapshots__/latest/fr/chrome_huge/i18n-spec/I18n_Locale[default].png'];
      reporter.emit('test:end', { title: 'title of the it' });
      expect(reporter.screenshots.length).toEqual(0);
    });
  });
  describe('runner:end', () => {
    it('suite:start for mono repo', () => {
      const reporter = new TerraWDIOTestDetailsReporter({}, {});
      reporter.specHashData = {
        'terra-clinical-data-grid':
            {
              f75728c9953420794e669cae74b03d58:
              {
                hideInputCaret:
                 {
                   parent: 'hideInputCaret',
                   title: 'hideInputCaret',
                   tests: [
                     {
                       title: 'Express correctly sets the application locale',
                       state: 'passed',
                     },
                     {
                       title: '[default] to be within the mismatch tolerance',
                       state: 'passed',
                       screenshotLink: '/opt/module/tests/wdio/__snapshots__/latest/fr/chrome_huge/i18n-spec/I18n_Locale[default].png',
                     },
                   ],
                 },
              },
            },
      };

      reporter.moduleName = 'terra-clinical-data-grid';
      const runner = {
        event: 'runner:end',
        failures: 0,
        cid: '0-2',
        specs: ['/opt/module/tests/wdio/hideInputCaret-spec.js'],
        specHash: 'f75728c9953420794e669cae74b03d58',
      };

      reporter.emit('runner:end', runner);
      expect(reporter.resultJsonObject).toHaveProperty('specs');
      expect(typeof reporter.resultJsonObject).toEqual('object');
      expect(reporter.resultJsonObject.specs[reporter.moduleName].tests.length).toBeGreaterThanOrEqual(1);
      expect(fs.writeFileSync).toHaveBeenCalled();
    });
    it('suite:start for non mono repo', () => {
      const reporter = new TerraWDIOTestDetailsReporter({}, {});
      reporter.specHashData = {
        f75728c9953420794e669cae74b03d58: {
          hideInputCaret: {
            parent: 'hideInputCaret',
            title: 'hideInputCaret',
            tests: [],
          },
          group1: {
            parent: 'hideInputCaret',
            title: 'group1',
            tests: [
              {
                title: "validates the textarea's caret-color is inherited as transparent",
                state: 'passed',
                screenshotLink: '/opt/module/tests/wdio/__snapshots__/latest/en/chrome_tiny/validateElement-spec/full_implementation[default].png',
              },
            ],
          },
        },
      };
      const runner = {
        event: 'runner:end',
        failures: 0,
        cid: '0-2',
        specs: ['/opt/module/tests/wdio/hideInputCaret-spec.js'],
        specHash: 'f75728c9953420794e669cae74b03d58',
      };
      reporter.emit('runner:end', runner);
      expect(reporter.resultJsonObject).toHaveProperty('specs');
      expect(typeof reporter.resultJsonObject).toEqual('object');
      expect(reporter.resultJsonObject.specs.length).toBeGreaterThanOrEqual(1);
      expect(fs.writeFileSync).toHaveBeenCalled();
    });
  });
});
