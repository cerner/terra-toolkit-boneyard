# Wdio File Reporter

Wdio File Reporter is a reporter that logs wdio test output to separate files based on locale, theme and form-factor with the following attributes

- date and time of when the tests are started and when they are finished

- Locale, Form Factor and Theme of the tests 

- Name of the tests and whether they've succeeded or failed

**WDIO test output Directory**
Terra WDIO spec Reporter logs the WDIO test output in tests/wdio/reports/ or test/wdio/reports/ depending on whether tests or test is the directory with tests

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
- The name of the log file will be **result-\<locale>-\<theme>-\<form-factor>-\<browser>-\<repo-name>.json**(eg: result-en-huge-chrome-terra-toolkit-boneyard.json)
```
{
  "startDate": "4/29/2020, 2:24:35 PM",
  "type": "wdio",
  "locale": "en",
  "formFactor": "tiny",
  "theme": "default-theme",
  "Output": [
    [
      "------------------------------------------------------------------",
      "[chrome #0-0] Session ID: e0217cb2b64dc2598599c1b200b6e4ff",
      "[chrome #0-0] Spec: /Users/sn081183/Desktop/terra-toolkit-boneyard/tests/wdio/i18n-spec.js",
      "[chrome #0-0] Running: chrome",
      "[chrome #0-0]",
      "[chrome #0-0] I18n Locale",
      "[chrome #0-0]   ✓ Express correctly sets the application locale",
      "[chrome #0-0]   ✓ [default] to be within the mismatch tolerance",
      "[chrome #0-0]",
      "[chrome #0-0]",
      "[chrome #0-0] 2 passing (3s)",
      "[chrome #0-0]",
    ],
    [
      "------------------------------------------------------------------",
      "[chrome #0-1] Session ID: 3dd88eb199a63793bdcf220b92eef941",
      "[chrome #0-1] Spec: /Users/sn081183/Desktop/terra-toolkit-boneyard/tests/wdio/validateElement-spec.js",
      "[chrome #0-1] Running: chrome",
      "[chrome #0-1]",
      "[chrome #0-1] [tiny]",
      "[chrome #0-1]",
      "[chrome #0-1]     validateElement",
      "[chrome #0-1]",
      "[chrome #0-1]         full implementation",
      "[chrome #0-1]           ✓ [default] is accessible and is within the mismatch tolerance",
      "[chrome #0-1]           ✓ checks element",
      "[chrome #0-1]",
      "[chrome #0-1]         inaccessible contrast",
      "[chrome #0-1]           ✓ [default] is accessible and is within the mismatch tolerance",
      "[chrome #0-1]           ✓ checks element",
      "[chrome #0-1]",
      "[chrome #0-1]",
      "[chrome #0-1] 4 passing (5s)",
      "[chrome #0-1]",
    ],
    [
      "------------------------------------------------------------------",
      "[chrome #0-2] Session ID: dbb52821f6672ae497637b28be6c745f",
      "[chrome #0-2] Spec: /Users/sn081183/Desktop/terra-toolkit-boneyard/tests/wdio/hideInputCaret-spec.js",
      "[chrome #0-2] Running: chrome",
      "[chrome #0-2]",
      "[chrome #0-2] hideInputCaret",
      "[chrome #0-2]   ✓ validates the body's caret-color is transparent by default",
      "[chrome #0-2]   ✓ validates the textarea's caret-color is inherited as transparent",
      "[chrome #0-2]   ✓ validates the input's caret-color is inherited as transparent",
      "[chrome #0-2]   ✓ sets the input's caret-color to orange",
      "[chrome #0-2]   ✓ sets the input's caret-color back to transparent",
      "[chrome #0-2]   ✓ throws an error for a non-existent element",
      "[chrome #0-2]",
      "[chrome #0-2]",
      "[chrome #0-2] 6 passing (1s)",
      "[chrome #0-2]",
    ]
  ],
  "endDate": "4/29/2020, 2:24:57 PM"
}

```

This is how the generated log file looks for mono-repo:
- The name of the log file will be **result-\<locale>-\<theme>-\<form-factor>-\<browser>-<Package-name>.json**(eg: result-clinical-lowlight-theme-chrome-terra-clinical-data-grid.json)
```
{
  "startDate": "5/22/2020, 12:08:02 PM",
  "theme": "clinical-lowlight-theme",
  "output": [
    [
      "------------------------------------------------------------------",
      "[chrome #0-0] Session ID: 1a1f3c0a3f55aaa3f3342590a09bf54d",
      "[chrome #0-0] Spec: /Users/sn081183/Desktop/terra-clinical/packages/terra-clinical-data-grid/tests/wdio/data-grid-spec.js",
      "[chrome #0-0] Running: chrome",
      "[chrome #0-0]",
      "[chrome #0-0] [medium]",
      "[chrome #0-0]",
      "[chrome #0-0]     DataGrid",
      "[chrome #0-0]",
      "[chrome #0-0]         with fill disabled",
      "[chrome #0-0]",
      "[chrome #0-0]             with initial rendering",
      "[chrome #0-0]               ✓ [#no-fill] is accessible and is within the mismatch tolerance",
      "[chrome #0-0]",
      "[chrome #0-0]             with horizontal overflow",
      "[chrome #0-0]               ✓ [#no-fill] is accessible and is within the mismatch tolerance",
      "[chrome #0-0]",
      "[chrome #0-0]             with vertical overflow",
      "[chrome #0-0]               ✓ [#no-fill] is accessible and is within the mismatch tolerance",
      "[chrome #0-0]",
      "[chrome #0-0]         with no pinned columns",
      "[chrome #0-0]",
      "[chrome #0-0]             with initial rendering",
      "[chrome #0-0]               ✓ [#no-pinned] is accessible and is within the mismatch tolerance",
      "[chrome #0-0]",
      "[chrome #0-0]             with horizontal overflow",
      "[chrome #0-0]               ✓ [#no-pinned] is accessible and is within the mismatch tolerance",
      "[chrome #0-0]",
      "[chrome #0-0]             with vertical overflow",
      "[chrome #0-0]               ✓ [#no-pinned] is accessible and is within the mismatch tolerance",
      "[chrome #0-0]",
      "[chrome #0-0]         with no oveflow columns",
      "[chrome #0-0]",
      "[chrome #0-0]             with initial rendering",
      "[chrome #0-0]               ✓ [#no-overflow] is accessible and is within the mismatch tolerance",
      "[chrome #0-0]",
      "[chrome #0-0]             with vertical overflow",
      "[chrome #0-0]               ✓ [#no-overflow] is accessible and is within the mismatch tolerance",
      "[chrome #0-0]",
      "[chrome #0-0]         with cell selection hover",
      "[chrome #0-0]           ✓ [default] is accessible and is within the mismatch tolerance",
      "[chrome #0-0]",
      "[chrome #0-0]         with cell selections",
      "[chrome #0-0]           ✓ [default] is accessible and is within the mismatch tolerance",
      "[chrome #0-0]",
      "[chrome #0-0]         with row selection hover",
      "[chrome #0-0]           ✓ [default] is accessible and is within the mismatch tolerance",
      "[chrome #0-0]",
      "[chrome #0-0]         with row selections",
      "[chrome #0-0]           ✓ [default] is accessible and is within the mismatch tolerance",
      "[chrome #0-0]",
      "[chrome #0-0]         with selected row hover",
      "[chrome #0-0]           ✓ [default] is accessible and is within the mismatch tolerance",
      "[chrome #0-0]",
      "[chrome #0-0]         with column header selections",
      "[chrome #0-0]           ✓ [default] is accessible and is within the mismatch tolerance",
      "[chrome #0-0]",
      "[chrome #0-0]         with subsection selection hover",
      "[chrome #0-0]           ✓ [default] is accessible and is within the mismatch tolerance",
      "[chrome #0-0]",
      "[chrome #0-0]         with subsection selections",
      "[chrome #0-0]           ✓ [default] is accessible and is within the mismatch tolerance",
      "[chrome #0-0]",
      "[chrome #0-0]         with paging",
      "[chrome #0-0]           ✓ [default] is accessible and is within the mismatch tolerance",
      "[chrome #0-0]",
      "[chrome #0-0]         with custom row/header heights",
      "[chrome #0-0]           ✓ [default] is accessible and is within the mismatch tolerance",
      "[chrome #0-0]",
      "[chrome #0-0] [huge]",
      "[chrome #0-0]",
      "[chrome #0-0]     DataGrid",
      "[chrome #0-0]",
      "[chrome #0-0]         with fill disabled",
      "[chrome #0-0]",
      "[chrome #0-0]             with initial rendering",
      "[chrome #0-0]               ✓ [#no-fill] is accessible and is within the mismatch tolerance",
      "[chrome #0-0]",
      "[chrome #0-0]             with horizontal overflow",
      "[chrome #0-0]               ✓ [#no-fill] is accessible and is within the mismatch tolerance",
      "[chrome #0-0]",
      "[chrome #0-0]             with vertical overflow",
      "[chrome #0-0]               ✓ [#no-fill] is accessible and is within the mismatch tolerance",
      "[chrome #0-0]",
      "[chrome #0-0]         with no pinned columns",
      "[chrome #0-0]",
      "[chrome #0-0]             with initial rendering",
      "[chrome #0-0]               ✓ [#no-pinned] is accessible and is within the mismatch tolerance",
      "[chrome #0-0]",
      "[chrome #0-0]             with horizontal overflow",
      "[chrome #0-0]               ✓ [#no-pinned] is accessible and is within the mismatch tolerance",
      "[chrome #0-0]",
      "[chrome #0-0]             with vertical overflow",
      "[chrome #0-0]               ✓ [#no-pinned] is accessible and is within the mismatch tolerance",
      "[chrome #0-0]",
      "[chrome #0-0]         with tabbing",
      "[chrome #0-0]           ✓ tabs across selectable headers",
      "[chrome #0-0]           ✓ [#forward-headers] is accessible and is within the mismatch tolerance",
      "[chrome #0-0]           ✓ tabs backwards across selectable headers",
      "[chrome #0-0]           ✓ [#backward-headers] is accessible and is within the mismatch tolerance",
      "[chrome #0-0]           ✓ tabs across selectable sections and cells",
      "[chrome #0-0]           ✓ [#forward-sections] is accessible and is within the mismatch tolerance",
      "[chrome #0-0]           ✓ tabs backwards selectable sections and cells",
      "[chrome #0-0]           ✓ [#backward-sections] is accessible and is within the mismatch tolerance",
      "[chrome #0-0]",
      "[chrome #0-0]         with cell selection hover",
      "[chrome #0-0]           ✓ [default] is accessible and is within the mismatch tolerance",
      "[chrome #0-0]",
      "[chrome #0-0]         with cell selections",
      "[chrome #0-0]           ✓ [default] is accessible and is within the mismatch tolerance",
      "[chrome #0-0]",
      "[chrome #0-0]         with row selection hover",
      "[chrome #0-0]           ✓ [default] is accessible and is within the mismatch tolerance",
      "[chrome #0-0]",
      "[chrome #0-0]         with row selections",
      "[chrome #0-0]           ✓ [default] is accessible and is within the mismatch tolerance",
      "[chrome #0-0]",
      "[chrome #0-0]         with selected row hover",
      "[chrome #0-0]           ✓ [default] is accessible and is within the mismatch tolerance",
      "[chrome #0-0]",
      "[chrome #0-0]",
      "[chrome #0-0]         with paging",
      "[chrome #0-0]           ✓ [default] is accessible and is within the mismatch tolerance",
      "[chrome #0-0]",
      "[chrome #0-0]         with custom row/header heights",
      "[chrome #0-0]           ✓ [default] is accessible and is within the mismatch tolerance",
      "[chrome #0-0]",
      "[chrome #0-0]",
      "[chrome #0-0] 58 passing (2m, 42s)",
      "[chrome #0-0]",
    ]
  ],
  "endDate": "5/22/2020, 12:21:16 PM"
}
```