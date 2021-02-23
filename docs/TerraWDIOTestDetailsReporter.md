# Terra WDIO Test Details Reporter

Wdio Test Details Reporter is a reporter that logs wdio visualRegression test output to a file with the following attributes

- Locale, Form Factor, Browsers and Theme of the tests

- Name of the tests, screenshot link, whether they've succeeded or failed if failed shows the error information

**WDIO test output Directory**
Terra WDIO Test Details Reporter logs the WDIO test output in tests/wdio/reports or test/wdio/reports depending on whether tests or test is the directory that contains specs

**Check for Mono Repo**
Terra WDIO Test Details Reporter assumes mono-repo will have packages directory in the root folder

## Usage

Add TerraWDIOTestDetailsReporter as an additional reporter within the wdio.config file. Include "dot" to avoid overriding default reporters

```javascript

const TerraWDIOTestDetailsReporter = require('terra-toolkit/reporters/wdio/TerraWDIOTestDetailsReporter');
{
 reporters: ['dot', TerraWDIOSpecReporter, TerraWDIOTestDetailsReporter],
}

```

## Report Format

- The name of the log file for non-monorepo will be **result-details-\<locale>-\<theme>-\<form-factor>-\<browser>-\<repo-name>.json**(eg: result-details-en-huge-chrome-terra-toolkit-boneyard.json)

- The name of the log file for mono-repo will be **result-details-\<Package-name>\<locale>-\<theme>-\<form-factor>-\<browser>.json**(eg: result-details-terra-clinical-data-grid-clinical-lowlight-theme-chrome)

- Example output [a relative link](details-reporter-sample-results.json)
- Example output when error occurs [a relative link](details-reporter-sample-results-withError.json)