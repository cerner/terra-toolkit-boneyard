/**
 * Class to store information about the themeable variables for a given webpack run
 */
class ThemeableVariableInformation {
  constructor(themes) {
    this.themes = themes;
    this.variables = {};
    this.perThemeVariableTracker = {};

    themes.forEach((theme) => {
      this.perThemeVariableTracker[theme] = {};
    });
  }

  /**
   * Adds a declared variable to the list of tracked variables
   * @param {Object} variable - a declared variable containing a name and origin (file, column, and line)
   */
  addDeclaredVariable(variable) {
    this.variables[variable.name] = variable;
  }

  /**
   * Adds a valued variable to the list of tracked valued variables for a given theme
   * @param {Object} variable - a declared variable containing a name, value, and origin (file, column, and line)
   * @param {string} theme - the theme to which the valued variable belongs
   */
  addValuedVariableForTheme(variable, theme) {
    this.perThemeVariableTracker[theme][variable.name] = this.perThemeVariableTracker[theme][variable.name] || [];

    // Don't add the valued variable if it's already been added with the same vaalue
    if (!this.perThemeVariableTracker[theme][variable.name].some(existingVariable => existingVariable.value === variable.value)) {
      this.perThemeVariableTracker[theme][variable.name].push(variable);
    }
  }

  /**
   * Returns a sorted list of variable objects representing the missing variables for a given theme
   * @param {string} theme the theme for which to get the missing variables
   * @returns {Array} an array of variable objects with a name and origin (file, column, and line)
   */
  missingVariablesForTheme(theme) {
    return Object.entries(this.variables).filter(([name]) => (
      !Object.keys(this.perThemeVariableTracker[theme]).includes(name)
    )).map(([, variable]) => variable).sort((variable1, variable2) => variable1.name.localeCompare(variable2.name));
  }

  /**
   * Returns a sorted list of variable objects representing the unused variables for a given theme
   * @param {string} theme the theme for which to get the unused variables
   * @returns {Array} an array of variable objects with a name, value and origin (file, column, and line)
   */
  unusedVariablesForTheme(theme) {
    return Object.entries(this.perThemeVariableTracker[theme]).filter(([name]) => (
      !Object.keys(this.variables).includes(name)
    )).reduce((accumulatedVariables, [, variables]) => (
      accumulatedVariables.concat(variables)
    ), []).sort((variable1, variable2) => variable1.name.localeCompare(variable2.name));
  }

  /**
   * Returns a sorted list of variable objects representing the duplicate variables for a given theme
   * @param {string} theme the theme for which to get the duplicate variables
   * @returns {Array} an array of variable objects with a name, value and origin (file, column, and line)
   */
  duplicateVariablesForTheme(theme) {
    return Object.values(this.perThemeVariableTracker[theme]).filter((variables) => (
      variables.length > 1
    )).reduce((accumulatedVariables, variables) => (
      accumulatedVariables.concat(variables)
    ), []).sort((variable1, variable2) => variable1.name.localeCompare(variable2.name));
  }
}

module.exports = ThemeableVariableInformation;
