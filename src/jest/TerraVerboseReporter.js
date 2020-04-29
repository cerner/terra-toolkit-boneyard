const VerboseReporter = require('@jest/reporters/build/verbose_reporter').default;
const stripAnsi = require('strip-ansi');
const fs = require('fs');
const path = require('path');
const endOfLine = require('os').EOL;

class TerraVerboseReporter extends VerboseReporter {
  constructor(globalConfig) {
    super(globalConfig);
    this.filePathLocation = path.resolve(globalConfig.coverageDirectory, '../results', 'result-output.json');
    this.results = {
      StartDate: '',
      Output: [],
      EndDate: '',
    };
  }

  onRunStart(aggregatedResults) {
    this.results.StartDate = new Date(aggregatedResults.startTime).toLocaleString();
  }

  log(message) {
    const readableMessage = `${stripAnsi(message)}${endOfLine}`;
    if (readableMessage.search('\n') !== -1) {
      this.results.Output.push(readableMessage.split(/\n/g).join(''));
    }
  }

  onRunComplete() {
    this.results.EndDate = new Date().toLocaleString();
    fs.appendFile(this.filePathLocation, `${JSON.stringify(this.results, null, 2)}`, { flag: 'a+' }, (err) => {
      if (err) {
        console.log(`File Error -> ${err.message}`);
      }
    });
  }
}
module.exports = TerraVerboseReporter;
