const postcss = require('postcss');
const postcssValueParser = require('postcss-value-parser');

module.exports = postcss.plugin('terra-themeable-variable-collector-plugin', (themeableVariableInformation) => (
  (root) => {
    // Walk the declarations and flag all values that are var's
    root.walkDecls(decl => {
      postcssValueParser(decl.value).walk(node => {
        if (node.type === 'function' && node.value === 'var') {
          const origin = decl.source.input.origin(decl.source.start.line, decl.source.start.column);
          themeableVariableInformation.addDeclaredVariable({ name: node.nodes[0].value, origin });
        }
      });
    });

    // For each theme, walk each rule that is declared as a class for that theme and then walk declarations
    // for that rule and mark the variables as tracked (or duplicate if they've already been added)
    themeableVariableInformation.themes.forEach((theme) => {
      root.walkRules(RegExp(`.${theme}`), (node) => {
        node.walkDecls(decl => {
          const origin = decl.source.input.origin(decl.source.start.line, decl.source.start.column);
          themeableVariableInformation.addValuedVariableForTheme({ name: decl.prop, value: decl.value, origin }, theme);
        });
      });
    });
  }
));
