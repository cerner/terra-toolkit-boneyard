import fs from 'fs';
import TerraVerboseReporter from '../../src/jest/TerraVerboseReporter';

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
    expect(terraVerboseReporter.results).toHaveProperty('StartDate');
  });

  it('should have endDate and output property in the test results', () => {
    const terraVerboseReporter = new TerraVerboseReporter({});
    terraVerboseReporter.onRunComplete();
    expect(terraVerboseReporter.results).toHaveProperty('Output');
    expect(terraVerboseReporter.results).toHaveProperty('EndDate');
    expect(typeof terraVerboseReporter.results.Output).toEqual('object');
  });

  it('should have output property in the result and have some length while calling log ', () => {
    const terraVerboseReporter = new TerraVerboseReporter({});
    terraVerboseReporter.log('test');
    expect(terraVerboseReporter.results.Output.length).toBeGreaterThanOrEqual(1);
    terraVerboseReporter.onRunComplete();
    expect(fsWriteSpy).toBeCalled();
  });

  it('should set reportDir when no globalConfig.rootDir not available', () => {
    const terraVerboseReporter = new TerraVerboseReporter({});
    expect(terraVerboseReporter.reportDir).toEqual(expect.stringContaining('jest/reports'));
  });
});
