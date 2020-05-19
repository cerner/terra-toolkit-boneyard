# Terra Verbose Reporter

Terra Verbose Reporter is a Jest reporter that logs jest test output to a file with the following attributes.

- The start and end of tests in date-time format

- Name of the tests and whether they've succeeded or failed

**Jest test output Directory**
Terra Verbose Reporter logs the jest test output in tests/jest/reports/results or test/jest/reports/results depending on whether tests or test is the directory with tests

**Check for Mono Repo**
Terra Verbose Reporter assumes mono-repo will have packages directory in the root folder 


## Usage

Add TerraVerboseReporter as an additional reporter within the jest.config file. Include "default" to avoid overriding default reporters

```javascript
{
  "reporters": ["default", "terra-toolkit/reporters/jest/TerraVerboseReporter.js"]
}
```
## Report Format

This is how the generated log file looks:
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
This is how the generated log file looks for mono-repo:
```
{
  "endDate": "5/13/2020, 3:41:21 PM",
  "startDate": "5/13/2020, 1:33:39 PM",
  "theme": "default-theme",
  "output": [
    [
      "------------------------------------------------------------------",
      "[chrome #0-2] Session ID: a8c3d16e7828a478766806d4e33e8a2d",
      "[chrome #0-2] Spec: /Users/sn081183/Desktop/terra-clinical/packages/terra-clinical-detail-view/tests/wdio/DetailListItem/detail-list-item-spec.js",
      "[chrome #0-2] Running: chrome",
      "[chrome #0-2]",
      "[chrome #0-2] [tiny]",
      "[chrome #0-2]",
      "[chrome #0-2]     Detail List Item",
      "[chrome #0-2]",
      "[chrome #0-2]         Displays a Detail List Item as expected",
      "[chrome #0-2]           ✓ [default] is accessible and is within the mismatch tolerance",
      "[chrome #0-2]",
      "[chrome #0-2] [small]",
      "[chrome #0-2]",
      "[chrome #0-2]     Detail List Item",
      "[chrome #0-2]",
      "[chrome #0-2]         Displays a Detail List Item as expected",
      "[chrome #0-2]           ✓ [default] is accessible and is within the mismatch tolerance",
      "[chrome #0-2]",
      "[chrome #0-2] [medium]",
      "[chrome #0-2]",
      "[chrome #0-2]     Detail List Item",
      "[chrome #0-2]",
      "[chrome #0-2]         Displays a Detail List Item as expected",
      "[chrome #0-2]           ✓ [default] is accessible and is within the mismatch tolerance",
      "[chrome #0-2]",
      "[chrome #0-2] [large]",
      "[chrome #0-2]",
      "[chrome #0-2]     Detail List Item",
      "[chrome #0-2]",
      "[chrome #0-2]         Displays a Detail List Item as expected",
      "[chrome #0-2]           ✓ [default] is accessible and is within the mismatch tolerance",
      "[chrome #0-2]",
      "[chrome #0-2] [huge]",
      "[chrome #0-2]",
      "[chrome #0-2]     Detail List Item",
      "[chrome #0-2]",
      "[chrome #0-2]         Displays a Detail List Item as expected",
      "[chrome #0-2]           ✓ [default] is accessible and is within the mismatch tolerance",
      "[chrome #0-2]",
      "[chrome #0-2]",
      "[chrome #0-2] 5 passing (8s)",
      "[chrome #0-2]",
      "",
      ""
    ],
    [
      "------------------------------------------------------------------",
      "[chrome #0-3] Session ID: 4f700ac951dbc1f21ddf4db5ac18389c",
      "[chrome #0-3] Spec: /Users/sn081183/Desktop/terra-clinical/packages/terra-clinical-detail-view/tests/wdio/DetailView/detail-view-spec.js",
      "[chrome #0-3] Running: chrome",
      "[chrome #0-3]",
      "[chrome #0-3] [tiny]",
      "[chrome #0-3]",
      "[chrome #0-3]     Detail View",
      "[chrome #0-3]",
      "[chrome #0-3]         Displays a divided Detail View with provided components",
      "[chrome #0-3]           ✓ [default] is accessible and is within the mismatch tolerance",
      "[chrome #0-3]",
      "[chrome #0-3]",
      "[chrome #0-3] [small]",
      "[chrome #0-3]",
      "[chrome #0-3]     Detail View",
      "[chrome #0-3]",
      "[chrome #0-3]         Displays a divided Detail View with provided components",
      "[chrome #0-3]           ✓ [default] is accessible and is within the mismatch tolerance",
      "[chrome #0-3]",
      "[chrome #0-3]",
      "[chrome #0-3] [medium]",
      "[chrome #0-3]",
      "[chrome #0-3]     Detail View",
      "[chrome #0-3]",
      "[chrome #0-3]         Displays a divided Detail View with provided components",
      "[chrome #0-3]           ✓ [default] is accessible and is within the mismatch tolerance",
      "[chrome #0-3]",
      "[chrome #0-3]",
      "[chrome #0-3] [large]",
      "[chrome #0-3]",
      "[chrome #0-3]     Detail View",
      "[chrome #0-3]",
      "[chrome #0-3]         Displays a divided Detail View with provided components",
      "[chrome #0-3]           ✓ [default] is accessible and is within the mismatch tolerance",
      "[chrome #0-3]",
      "[chrome #0-3]",
      "[chrome #0-3] [huge]",
      "[chrome #0-3]",
      "[chrome #0-3]     Detail View",
      "[chrome #0-3]",
      "[chrome #0-3]         Displays a divided Detail View with provided components",
      "[chrome #0-3]           ✓ [default] is accessible and is within the mismatch tolerance",
      "[chrome #0-3]",
      "[chrome #0-3] 4 passing (32s)",
      "[chrome #0-3]",
      "",
      ""
    ]
  ]
}
```

