/* eslint-disable no-undef */
/* eslint-disable no-useless-escape */
import fs from 'fs';
import JestFileReporter from './JestFileReporter';

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
  it('start time is appended to the file', () => {
    const jestFileReporter = new JestFileReporter({});
    jestFileReporter.onRunStart([], 'exactly');
    expect(fsAppendSpy).toBeCalled();
  });
  it('end time is appended to the file', () => {
    const jestFileReporter = new JestFileReporter({});
    jestFileReporter.onRunComplete([], 'exactly');
    expect(fsAppendSpy).toBeCalled();
  });
  it('log function should call append file', () => {
    const jestFileReporter = new JestFileReporter({});
    jestFileReporter.log('random');
    expect(fsAppendSpy).toBeCalled();
  });
});
