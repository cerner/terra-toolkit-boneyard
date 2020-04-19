#Jest File Reporter

Jest File Reporter is a reporter which helps in pulling output from jest tests to a file

- [This Reporter will shows us
data/time of when the tests started and when they are finished]

- [Name of the tests and whether they've succeeded or failed]

**We are gonna use verbose which helps in displaying individual test results with the test suite hierarchy(https://jestjs.io/docs/en/cli.html#--verbose) 

##Configuring Jest

Jest configuration can be defined in the package.json file or through jest.config file

1) Setting up verbose in package.json file
2) add Costume reporter in the jest.config file so that jest knows what reporter to use when outputting the test results.

**Modifications in the package.json file

-   To get verbose mode in Jest, you can run Jest with --verbose tag 
-   Disable colors of Jest test output by adding --no-colors tag to jest 

**Modifications in the jestConfig.js file

This will use custome reporter in addition to default reporters that Jest use.
```javascript
{
  "reporters": ["default", "<rootDir>/my-custom-reporter.js"]
}
```


##Test Reporter

A test reporter is a hook into the test runner that allow for code to be executed at the start and end of the test run.

There are many test reporters available for Jest. But they output the test results in the terminal. In our scenario we need output in the text file  so we will need to the following 

-   override the verbose reporter log method such that the test results gets displayed on a text file.

To get start Date and End Date in the result file we do the following

- On onRunStart event. This stage is before the test run starts. So grab the start date/time of when the tests started.

- Work on onRunComplete event. This stage is fire off afterwards. So grab the end date/time of when the tests ended.



