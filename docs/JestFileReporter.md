# Jest File Reporter

Jest File Reporter is a reporter which helps in pulling output from jest tests to a file

- This Reporter will shows us date/time of when the tests are started and when they are finished

- Name of the tests and whether they've succeeded or failed

**We are gonna use verbose which helps in displaying individual test results with the test suite hierarchy https://jestjs.io/docs/en/cli.html#--verbose**

## Configuration for Verbose

Jest configuration can be defined in the package.json file or through jest.config file

1) Set up verbose in package.json file

2) Add Costume reporter in the jest.config file so that jest knows what reporter to use when outputting the test results.

**Modifications in the package.json file**

- To get verbose mode in Jest, you can run Jest with --verbose tag
```javascript
	"test": "npm run jest --verbose
```

**Modifications in the jestConfig.js file**

This will use custom reporter in addition to default reporters that Jest uses.

```javascript
{
	"reporters": ["default", "<rootDir>/my-custom-reporter.js"]
}
```

## Test Reporter

A test reporter is a hook into the test runner that allows for code to be executed at the start and end of the test run.

There are many test reporters available for Jest. But they output the test results in the terminal. In our scenario we need output in the text file so we will need to do the following

- **Override the verbose reporter log method** such that the test results gets displayed on a text file.

Used strip-ansi to clear out the bad characters before we write them to the file.(https://www.npmjs.com/package/strip-ansi)

```javascript
	//	overriding log method 
	log(message) {
		fs.appendFile(filePath, `${stripAnsi(message)}\n`, (err) => {
		if (err) throw err;
		});
	}
```
**To get start Date and End Date in the result file do the following**

- **Work on onRunStart event.** This stage is before the test run starts. So grab the start date/time of when the tests start.
```javascript
	onRunStart(aggregatedResults, options) {
		const  date = moment(aggregatedResults.startTime).format('MM/DD/YYYY HH:mm:ss');
		const  startDate = `Started: ${date}`;
		fs.appendFile(filePath, `${startDate}\n\n`);
	}
```
- **Work on onRunComplete event.** This stage is fired off after the log method is executed and can be used to process the test results after all tests have run. So grab the end date/time of when the tests ended in this stage.
```javascript
	onRunComplete(_contexts, _aggregatedResults) {
		const  date = moment(Date.now()).format('MM/DD/YYYY HH:mm:ss');
		const  endDate = `EndDate: ${date}`;
		fs.appendFile(filePath, `\n${endDate}\n\n`);
	}
```