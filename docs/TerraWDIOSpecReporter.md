# Wdio File Reporter

Wdio File Reporter is a reporter that logs wdio test output to separate files based on locale, theme, and form-factor with the following attributes

- date and time of when the tests are started and when they are finished

- Locale, Form Factor, and Theme of the tests 

- Name of the tests and whether they've succeeded or failed

**WDIO test output Directory**
Terra WDIO spec Reporter logs the WDIO test output in tests/wdio/reports/ or test/wdio/reports/ depending on whether tests or test is the directory that contains specs

**Check for Mono Repo**
Terra WDIO spec Reporter assumes mono-repo will have packages directory in the root folder

## Usage

Add WdioFileReporter as an additional reporter within the wdio.config file. Include "dot" to avoid overriding default reporters

```javascript

const WdioFileReporter = require('terra-toolkit/src/wdio/WdioFileReporter');
{
 reporters: ['dot', WdioFileReporter],
}

```
## Report Format
- The name of the log file for non-monorepo will be **result-\<locale>-\<theme>-\<form-factor>-\<browser>-\<repo-name>.json**(eg: result-en-huge-chrome-terra-toolkit-boneyard.json)

- The name of the log file for mono-repo will be **result-\<locale>-\<theme>-\<form-factor>-\<browser>-<Package-name>.json**(eg: result-clinical-lowlight-theme-chrome-terra-clinical-data-grid.json)

- This is output example [a relative link](TerraWDIOSpecReporter-sample-result.json)