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

  it('Start Date, End Date and Output are added to the json file', () => {
    const terraVerboseReporter = new TerraVerboseReporter({});
    terraVerboseReporter.onRunComplete([], 'exactly');
    expect(fsWriteSpy).toBeCalled();
  });

  it('should set reportDir when no globalConfig.coverageDirectory set', () => {
    const terraVerboseReporter = new TerraVerboseReporter({});
    expect(terraVerboseReporter.reportDir).toEqual(expect.stringContaining('jest/reports'));
  });
});
