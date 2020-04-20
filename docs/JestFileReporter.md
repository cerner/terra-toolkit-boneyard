# Jest File Reporter

Jest File Reporter is a reporter that logs jest test output to a file

- This Reporter will shows us date/time of when the tests are started and when they are finished

- Name of the tests and whether they've succeeded or failed

**We are gonna use verbose which helps in displaying individual test results with the test suite hierarchy https://jestjs.io/docs/en/cli.html#--verbose**

## Configuration for Verbose

Add Costume reporter in the jest.config file so that jest knows what reporter to use when outputting the test results.

**Modifications in the jestConfig.js file**

To get verbose mode in Jest set verbose to true 

```javascript
  verbose: true
```

This will use custom reporter in addition to default reporters that Jest uses.

```javascript
{
  "reporters": ["default", "<rootDir>/my-custom-reporter.js"]
}
```

**This is how the generated log file looks**
Started: 4/20/2020, 2:21:18 PM

 PASS  tests/jest/config/configUtils.test.js
  dynamicRequire
    ✓ returns undefined when invalid (6ms)
    ✓ returns file when valid (25ms)

 PASS  tests/jest/config/wdio/selenium.config.test.js
      ✓ returns chrome by default (4ms)
      ✓ returns chrome when seleniumGridUrl env but no browsers env (1ms)
      ✓ returns chrome when seleniumGridUrl env and browsers env
      ✓ does not return chrome when chrome is not defined (1ms)
    chrome capabilities
      ✓ returns firefox when defined via browsers env (1ms)
      ✓ returns firefox when seleniumGridUrl env but no browsers env
      ✓ returns firefox when seleniumGridUrl env and browsers env (1ms)
    ie capabilities
      ✓ does not return ie when defined via browsers env and not seleniumGridUrl (7ms)
  Wdio Selenium Configuration
      ✓ returns ie when seleniumGridUrl env and browsers env (1ms)

 PASS  tests/jest/chai-methods.test.js
  getComparisonResults
    ✓ guards against an empty array of screenshots (5ms)

      ✓ returns chrome when defined via browsers env (1ms)
      ✓ returns ie when seleniumGridUrl env but no browsers env
    firefox capabilities

EndDate: 4/20/2020, 2:21:23 PM
