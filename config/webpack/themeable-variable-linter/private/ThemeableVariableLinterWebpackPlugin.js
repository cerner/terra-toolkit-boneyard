const path = require('path');

// Displays a more friendly version of the variable of the form "<name> - <file> (line: <line>, column: <column>)"
const namesAndLocationsOfVariables = (variables) => (
  variables.map(variable => (
    `${variable.name} - ${path.relative(process.cwd(), variable.origin.file)} (line: ${variable.origin.line}, column: ${variable.origin.column})`
  ))
);

/**
 * This plugin provides a post css loader plugin that tracks themeable variables and a webpack plugin that aggregates those
 * results as warnings by the webpack compilation
 */
module.exports = class ThemeableVariableLinterPlugin {
  constructor(themeableVariableInformation) {
    this.themeableVariableInformation = themeableVariableInformation;
  }

  apply(compiler) {
    compiler.hooks.emit.tapPromise('TerraThemeableVariableLinterPlugin', (compilation) => {
      this.themeableVariableInformation.themes.forEach((theme) => {
        const missingVariablesForTheme = this.themeableVariableInformation.missingVariablesForTheme(theme);
        if (missingVariablesForTheme.length) {
          compilation.warnings.push(`${theme}.\nThe following variables are missing:\n${namesAndLocationsOfVariables(missingVariablesForTheme).join('\n')}`);
        }

        const unusedVariablesForTheme = this.themeableVariableInformation.unusedVariablesForTheme(theme);
        if (unusedVariablesForTheme.length) {
          compilation.warnings.push(`${theme}.\nThe following variables are unused:\n${namesAndLocationsOfVariables(unusedVariablesForTheme).join('\n')}`);
        }

        const duplicateVariablesForTheme = this.themeableVariableInformation.duplicateVariablesForTheme(theme);
        if (duplicateVariablesForTheme.length) {
          compilation.warnings.push(`${theme}.\nThe following variables are duplicated:\n${namesAndLocationsOfVariables(duplicateVariablesForTheme).join('\n')}`);
        }
      });

      return Promise.resolve();
    });
  }
};
