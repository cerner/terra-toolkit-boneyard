import fs from 'fs';
import TerraVerboseReporter from '../../src/jest/TerraVerboseReporter';

jest.mock('fs');
jest.mock('path');
let fsAppendSpy;
describe('Jest File Reporter Testing', () => {
  afterEach(() => {
    fsAppendSpy.mockClear();
  });
  beforeEach(() => {
    fsAppendSpy = jest.spyOn(fs, 'appendFile');
  });

  it('Start Date, End Date and Output are added to the json file', () => {
    const terraVerboseReporter = new TerraVerboseReporter({});
    terraVerboseReporter.onRunComplete([], 'exactly');
    expect(fsAppendSpy).toBeCalled();
  });
});
