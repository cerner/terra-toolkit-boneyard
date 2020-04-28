# Jest File Reporter

Jest File Reporter is a reporter that logs jest test output to a file

- This Reporter will shows us date/time of when the tests are started and when they are finished

- Name of the tests and whether they've succeeded or failed

Add Costume reporter in the jest.config file so that jest knows what reporter to use when outputting the test results.

This will use custom reporter in addition to default reporters that Jest uses.

```javascript
{
  "reporters": ["default", "<rootDir>/my-custom-reporter.js"]
}
```

**This is how the generated log file looks**
```
{ 
  "StartDate": "4/28/2020, 10:08:49 AM",
  "Output": [
    " PASS  tests/jest/parse-list.test.js",
    "  Parse CLI List",
    "    ✓ parses ['en'] to [\"en\"] (17ms)",
    "    ✓ parses ['en','en-US'] to [\"en\", \"en-US\"]",
    "",
    " PASS  tests/jest/validateElement.test.js",
    "  validateElement",
    "    ✓ calls the appropriate methods downstream with all arguments (16ms)",
    "    ✓ calls the appropriate methods downstream with defaults (2ms)",
    "    ✓ does not use context option (1ms)",
    "",
    " PASS  tests/jest/determine-test-options.test.js",
    "  screenshotOptions",
    "    ✓ returns defaults (17ms)",
    "    ✓ honors custom name (3ms)",
    "    ✓ honors custom selector (1ms)",
    "    ✓ honors custom viewports (1ms)",
    "    ✓ honors custom name and options (1ms)",
    "    honors custom misMatchTolerance",
    "      ✓ accepts mismatch greater than 0 (1ms)",
    "      ✓ accepts mismatch of 0 (2ms)",
    "  axeOptions",
    "    ✓ returns defaults (1ms)",
    "    ✓ honors custom viewports (1ms)",
    "    ✓ honors custom rule",
    "    ✓ honors custom rule (1ms)",
    "    ✓ cannot specify runOnly options",
    "",
    " PASS  tests/jest/config/configUtils.test.js",
    "  dynamicRequire",
    "    ✓ returns undefined when invalid (6ms)",
    "    ✓ returns file when valid (5ms)",
    "",
  ],
   "EndDate": "4/28/2020, 10:08:56 AM"
}
```
