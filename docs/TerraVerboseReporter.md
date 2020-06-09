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
* The name of the log file will be name of the repo running it <repoName>.json(eg:terra-toolkit-boneyard.json)
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
* The name of the log file will be <package-name>.json(eg:terra-clinical-data-grid.json)
```
{
  "startDate": "5/22/2020, 11:19:13 AM",
  "output": [
    " PASS  packages/terra-clinical-data-grid/tests/jest/utils/dataGridUtils.test.js",
    "  getAccessibleContents",
    "    ✓ should find all accessible elements within in the given element (20ms)",
    "    ✓ should find no accessible elements if none exist (2ms)",
    "  ROW_SELECTION_COLUMN",
    "    ✓ should return an object with the correct row selection column specifications (2ms)",
    "  VOID_COLUMN",
    "    ✓ should return an object with the correct void column specifications (1ms)",
    "  getWidthForColumn",
    "    ✓ should return the specified width if present (1ms)",
    "    ✓ should return the default width if no width is specified",
    "    ✓ should return the default width if no column is provided",
    "  getTotalColumnWidth",
    "    ✓ should return the calculated total (1ms)",
    "    ✓ should return the calculated total with only one column present",
    "    ✓ should return 0 if no columns are provided (1ms)",
    "  getPinnedColumns",
    "    ✓ should return the prop columns along with the row selection column if row selection is enabled (27ms)",
    "    ✓ should return the prop columns, omitting the row selection column when disabled (8ms)",
    "  getOverflowColumns",
    "    ✓ should return the prop columns along with the void column (2ms)",
    "    ✓ should not return the void column if columns are not resizable (1ms)",
    "  matchesSelector",
    "    ✓ should return whether or not the element matches the selector (4ms)",
    "    ✓ should account for differences in IE support (5ms)",
    " PASS  packages/terra-clinical-data-grid/tests/jest/subcomponents/SectionHeader.test.jsx",
    "  SectionHeader Snapshot Tests",
    "    ✓ should render a SectionHeader with minimal props (11ms)",
    "    ✓ should render a SectionHeader with default text/accessory props (4ms)",
    "    ✓ should render a SectionHeader with child content if provided (2ms)",
    "    ✓ should render a SectionHeader as collapsed (2ms)",
  ],
  "endDate": "5/22/2020, 11:19:22 AM"
}
```
