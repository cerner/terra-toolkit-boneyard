import fs from 'fs';
import TerraVerboseReporter from '../../reporters/jest/TerraVerboseReporter';

jest.mock('fs');

describe('Jest File Reporter Testing', () => {
  let fsWriteSpy;
  afterEach(() => {
    fsWriteSpy.mockClear();
  });
  beforeEach(() => {
    fsWriteSpy = jest.spyOn(fs, 'writeFile');
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
});
