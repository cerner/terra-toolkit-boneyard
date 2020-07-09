import fs from 'fs';
import TerraWDIOSpecReporter from '../../reporters/wdio/TerraWDIOSpecReporter';

jest.mock('fs');

describe('TerraWDIOSpecReporter', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initialization', () => {
    it('defines resultJsonObject', () => {
      const reporter = new TerraWDIOSpecReporter({}, {});
      expect(reporter.resultJsonObject).toHaveProperty('output');
      expect(reporter.resultJsonObject).toHaveProperty('startDate');
      expect(reporter.resultJsonObject).toHaveProperty('endDate');
      expect(reporter.resultJsonObject).toHaveProperty('type');
      expect(typeof reporter.resultJsonObject.output).toEqual('object');
    });

    it('defines fileName', () => {
      const reporter = new TerraWDIOSpecReporter({}, {});
      expect(reporter.fileName).toBe('');
    });

    it('defines moduleName', () => {
      const reporter = new TerraWDIOSpecReporter({}, {});
      expect(reporter.moduleName).toBe('terra-toolkit-boneyard');
    });

    describe('determines results dir', () => {
      it('when outputDir has not been defined in configuration', () => {
        fs.existsSync.mockReturnValue(true);
        let reporter = new TerraWDIOSpecReporter({}, {});
        expect(reporter.resultsDir).toEqual(expect.stringContaining('test/wdio/reports'));

        fs.existsSync.mockReturnValue(false);
        reporter = new TerraWDIOSpecReporter({}, {});
        expect(reporter.resultsDir).toEqual(expect.stringContaining('tests/wdio/reports'));
      });

      it('when outputDir is defined in configuration', () => {
        const reporter = new TerraWDIOSpecReporter({}, { reporterOptions: { outputDir: 'wdio/reports' } });
        expect(reporter.resultsDir).toEqual(expect.stringContaining('wdio/reports'));
      });
    });

    describe('ensures results dir exists', () => {
      it('when dir exists', () => {
        fs.existsSync.mockReturnValue(true);
        const reporter = new TerraWDIOSpecReporter({}, {});
        reporter.hasResultsDir();
        expect(fs.mkdirSync).not.toHaveBeenCalled();
      });

      it('when dir does not exists', () => {
        fs.existsSync.mockReturnValue(false);
        const reporter = new TerraWDIOSpecReporter({}, {});
        reporter.hasResultsDir();
        expect(fs.mkdirSync).toHaveBeenCalled();
      });
    });
  });

  describe('fileNameCheck', () => {
    it('sets default file name', () => {
      const reporter = new TerraWDIOSpecReporter({}, {});
      reporter.fileNameCheck({ }, undefined);
      expect(reporter.fileName).toEqual('result');
      expect(reporter.resultJsonObject).toHaveProperty('locale', '');
      expect(reporter.resultJsonObject).toHaveProperty('theme', '');
      expect(reporter.resultJsonObject).toHaveProperty('formFactor', '');
    });

    it('sets file name with locale', () => {
      const reporter = new TerraWDIOSpecReporter({}, {});
      reporter.fileNameCheck({ locale: 'en' }, undefined);
      expect(reporter.fileName).toEqual('result-en');
      expect(reporter.resultJsonObject).toHaveProperty('locale', 'en');
      expect(reporter.resultJsonObject).toHaveProperty('theme', '');
      expect(reporter.resultJsonObject).toHaveProperty('formFactor', '');
    });

    it('sets file name with locale and theme', () => {
      const reporter = new TerraWDIOSpecReporter({}, {});
      reporter.fileNameCheck({ locale: 'en', theme: 'default' }, undefined);
      expect(reporter.fileName).toEqual('result-en-default');
      expect(reporter.resultJsonObject).toHaveProperty('locale', 'en');
      expect(reporter.resultJsonObject).toHaveProperty('theme', 'default');
      expect(reporter.resultJsonObject).toHaveProperty('formFactor', '');
    });

    it('sets file name with locale, theme and formFactor', () => {
      const reporter = new TerraWDIOSpecReporter({}, {});
      reporter.fileNameCheck({ locale: 'en', theme: 'default', formFactor: 'tiny' }, undefined);
      expect(reporter.fileName).toEqual('result-en-default-tiny');
      expect(reporter.resultJsonObject).toHaveProperty('locale', 'en');
      expect(reporter.resultJsonObject).toHaveProperty('theme', 'default');
      expect(reporter.resultJsonObject).toHaveProperty('formFactor', 'tiny');
    });

    it('sets file name with locale, theme, formFactor and browser', () => {
      const reporter = new TerraWDIOSpecReporter({}, {});
      reporter.fileNameCheck({ locale: 'en', theme: 'default', formFactor: 'tiny' }, 'chrome');
      expect(reporter.fileName).toEqual('result-en-default-tiny-chrome');
      expect(reporter.resultJsonObject).toHaveProperty('locale', 'en');
      expect(reporter.resultJsonObject).toHaveProperty('theme', 'default');
      expect(reporter.resultJsonObject).toHaveProperty('formFactor', 'tiny');
    });
  });

  describe('setTestModule', () => {
    it('updates moduleName if mono-repo test file', () => {
      const reporter = new TerraWDIOSpecReporter({}, {});
      expect(reporter.moduleName).toEqual('terra-toolkit-boneyard');
      reporter.setTestModule('terra-toolkit/packages/my-package/tests/wdio/test-spec.js');
      expect(reporter.moduleName).toEqual('my-package');
    });

    it('does not updates moduleName if non mono-repo test file', () => {
      const reporter = new TerraWDIOSpecReporter({}, {});
      expect(reporter.moduleName).toEqual('terra-toolkit-boneyard');
      reporter.setTestModule('terra-toolkit/tests/wdio/test-spec.js');
      expect(reporter.moduleName).toEqual('terra-toolkit-boneyard');
    });
  });

  describe('printSummary', () => {
    const runner = {
      cid: '0-0',
      specs: ['/packages/test-module/tests/wdio/hideInputCaret-spec.js'],
    };
    const config = { locale: 'en', desiredCapabilities: { browserName: 'chrome' } };

    describe('when no specs run - does not write results file', () => {
      fs.writeFileSync.mockImplementation(() => {});
      const reporter = new TerraWDIOSpecReporter({}, {});
      reporter.runners = {};
      expect(fs.writeFileSync).not.toHaveBeenCalled();
    });

    it('when one spec runs - write results file', () => {
      fs.writeFileSync.mockImplementation(() => {});
      const reporter = new TerraWDIOSpecReporter({}, {});
      reporter.runners = [runner];
      reporter.baseReporter = {
        stats: {
          runners: {
            '0-0': { config },
          },
        },
      };
      reporter.getSuiteResult = jest.fn().mockReturnValue('wdio test results');
      reporter.printSummary();

      expect(reporter.resultJsonObject).toHaveProperty('output');
      expect(reporter.resultJsonObject.output).toHaveProperty('test-module');
      expect(reporter.resultJsonObject.output['test-module']).toHaveLength(1);
      expect(fs.writeFileSync).toHaveBeenCalled();
      expect(fs.writeFileSync.mock.calls[0][0]).toEqual(expect.stringContaining('result-en-chrome-test-module.json'));
    });

    it('when many specs run - write results file', () => {
      fs.writeFileSync.mockImplementation(() => {});
      const reporter = new TerraWDIOSpecReporter({}, {});
      reporter.runners = [runner, { ...runner, cid: '0-1' }];
      reporter.baseReporter = {
        stats: {
          runners: {
            '0-0': { config },
            '0-1': { config },
          },
        },
      };
      reporter.getSuiteResult = jest.fn().mockReturnValue('wdio test results\n');
      reporter.printSummary();

      expect(reporter.resultJsonObject).toHaveProperty('output');
      expect(reporter.resultJsonObject.output).toHaveProperty('test-module');

      expect(reporter.resultJsonObject.output['test-module']).toHaveLength(2);
      expect(fs.writeFileSync).toHaveBeenCalled();
      expect(fs.writeFileSync.mock.calls[0][0]).toEqual(expect.stringContaining('result-en-chrome-test-module.json'));
    });
  });

  describe('printSuitesSummary', () => {
    const stats = {
      start: 'Tue Apr 28 2020 12:14:56',
      end: 'Tue Apr 28 2020 12:14:59',
    };

    it('adds start and end dates to resultJsonObject', () => {
      const reporter = new TerraWDIOSpecReporter({}, {});
      reporter.baseReporter = { stats };
      reporter.printSummary = jest.fn();
      reporter.printSuitesSummary();
      expect(reporter.resultJsonObject).toHaveProperty('endDate');
      expect(reporter.resultJsonObject.endDate).not.toEqual('');
      expect(reporter.resultJsonObject).toHaveProperty('startDate');
      expect(reporter.resultJsonObject.startDate).not.toEqual('');
      expect(reporter.printSummary).toHaveBeenCalled();
    });
  });
});
