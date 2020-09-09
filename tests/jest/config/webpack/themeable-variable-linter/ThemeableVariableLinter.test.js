const ThemeableVariableLinter = require('../../../../../config/webpack/themeable-variable-linter/ThemeableVariableLinter');

describe('Themeable Variable Linter', () => {
  it('creates the tracker with a filled out config', () => {
    const themeConfig = {
      theme: 'default',
      scoped: ['a', 'b'],
    };
    const plugin = new ThemeableVariableLinter(themeConfig);
    expect(plugin.variableInformation).toMatchSnapshot();
  });

  it('creates the tracker with no default in the config', () => {
    const themeConfig = {
      scoped: ['a', 'b'],
    };
    const plugin = new ThemeableVariableLinter(themeConfig);
    expect(plugin.variableInformation).toMatchSnapshot();
  });

  it('creates the tracker with no scoped in the config', () => {
    const themeConfig = {
      theme: 'default',
    };
    const plugin = new ThemeableVariableLinter(themeConfig);
    expect(plugin.variableInformation).toMatchSnapshot();
  });

  it('creates the tracker with an undefined scoped in the config', () => {
    const themeConfig = {
      theme: 'default',
      scoped: ['a', 'b', undefined],
    };
    const plugin = new ThemeableVariableLinter(themeConfig);
    expect(plugin.variableInformation).toMatchSnapshot();
  });
});
