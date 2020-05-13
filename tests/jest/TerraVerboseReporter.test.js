import fs from 'fs';
import TerraVerboseReporter from '../../reporters/jest/TerraVerboseReporter';

jest.mock('fs');

describe('Jest File Reporter Testing', () => {
  let fsWriteSpy;
  let fsExistSyncSpy;
  afterEach(() => {
    fsWriteSpy.mockClear();
  });
  beforeEach(() => {
    fsWriteSpy = jest.spyOn(fs, 'writeFileSync');
    fsExistSyncSpy = jest.spyOn(fs, 'existsSync');
  });

  it('should have startdate property in the test results', () => {
    const terraVerboseReporter = new TerraVerboseReporter({});
    terraVerboseReporter.onRunStart({ startTime: 'Fri May 01 2020 00:22:30' });
    expect(terraVerboseReporter.results).toHaveProperty('startDate');
  });

  it('should have endDate and output property in the test results', () => {
    const terraVerboseReporter = new TerraVerboseReporter({});
    terraVerboseReporter.onRunComplete();
    expect(terraVerboseReporter.results).toHaveProperty('output');
    expect(terraVerboseReporter.results).toHaveProperty('endDate');
    expect(typeof terraVerboseReporter.results.output).toEqual('object');
  });

  it('should have output property in the result and have some length while calling log ', () => {
    const terraVerboseReporter = new TerraVerboseReporter({});
    terraVerboseReporter.log('test');
    expect(terraVerboseReporter.results.output.length).toBeGreaterThanOrEqual(1);
    terraVerboseReporter.onRunComplete();
    expect(fsWriteSpy).toBeCalled();
  });

  it('should set resultDir when no globalConfig.rootDir not available', () => {
    const terraVerboseReporter = new TerraVerboseReporter({});
    expect(terraVerboseReporter.filePathLocation).toEqual(expect.stringContaining('jest/reports'));
  });

  it('should call hasMonoRepo', () => {
    const verboseReporter = new TerraVerboseReporter({});
    expect(fsExistSyncSpy).toBeCalled();
    expect(typeof verboseReporter.isMonoRepo).toEqual('boolean');
  });

  it('should call setResultDir and include the globalConfig rootDir in reporter filePathLocation', () => {
    const verboseReporter = new TerraVerboseReporter({ rootDir: 'opt/test' });
    expect(verboseReporter.filePathLocation).toEqual(expect.stringContaining('opt/test'));
    expect(verboseReporter.filePathLocation).toEqual(expect.stringContaining('terra-verbose-results'));
  });

  it('should call setTestDirPath and include /tests/jest/reports/results in reporter filePath', () => {
    const verboseReporter = new TerraVerboseReporter({});
    expect(verboseReporter.filePath).toEqual(expect.stringContaining('/tests/jest/reports/results'));
  });

  it('should set this.moduleName when root folder has package directory', () => {
    const verboseReporter = new TerraVerboseReporter({});
    verboseReporter.setTestModule('packages/terra-clinical-header');
    expect(verboseReporter.moduleName).toEqual(expect.stringContaining('terra-clinical-header'));
  });
  it('should skip this.moduleName when root folder doesn\'t has package directory', () => {
    const verboseReporter = new TerraVerboseReporter({});
    verboseReporter.setTestModule('');
    expect(verboseReporter.moduleName).toEqual('');
  });
});
