const VerboseReporter = require('@jest/reporters/build/verbose_reporter').default;
const stripAnsi = require('strip-ansi');
const fs = require('fs');
const path = require('path');
const jsonMultilineStrings = require('json-multiline-strings');

class TerraVerboseReporter extends VerboseReporter {
  constructor(globalConfig) {
    super(globalConfig);
    this.filePathLocation = path.resolve(globalConfig.coverageDirectory, '../results', 'result-output.json');
    this.results = {
      StartDate: '',
      Output: '',
      EndDate: '',
    };
  }

  onRunStart(aggregatedResults) {
    this.results.StartDate = new Date(aggregatedResults.startTime).toLocaleString();
  }

  log(message) {
    this.results.Output += `${stripAnsi(message)}\n`;
  }

  // This stage is fired off after the log method is executed.
  onRunComplete() {
    this.results.EndDate = new Date().toLocaleString();
    console.log('this.results', this.results);
    fs.appendFile(this.filePathLocation, `${JSON.stringify(jsonMultilineStrings.split(this.results), null, 2)}`, { flag: 'a+' }, (err) => {
      if (err) {
        console.log(`File Error -> ${err.message}`);
      }
    });
  }
}
module.exports = TerraVerboseReporter;
