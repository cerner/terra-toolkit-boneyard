# Terra Themeable Variable Linter

The purpose of this linter is to flag missing, unused, or duplicate themeable variables. This is accomplished via a postcss loader plugin to collect variable information and a webpack plugin to use that information to log out warnings

## Configuration

### terra-theme.config.js

Below is an example of terra-theme.config. For more theme config information go [here](https://github.com/cerner/terra-toolkit-boneyard/tree/postcss-theme-plugin/config/webpack/postcss/themeConfig.md).

```js
const themeConfig = {
  theme: 'terra-dark-theme', // The default theme.
  scoped: ['terra-light-theme', 'terra-lowlight-theme'], // An array of scoped themes.
};

module.exports = themeConfig;
```

### Webpack

This linter is already included in the default webpack config. Below is an example of how you could include it in your own webpack config, but we strongly recommend you extend terra's config instead of creating your own. It's intended to be included before css modules are processed.

```js
const ThemeableVariableLinter = require('terra-toolkit/config/webpack/themeable-variable-linter/ThemeableVariableLinter');
const themeableVariableLinter = new ThemeableVariableLinter(themeConfig);
...

  {
    loader: 'postcss-loader',
    options: {
      ident: 'postcss',
      plugins: [
        themeableVariableLinter.themeableVariableCollectorPlugin(),
      ],
    },
  },
...
  plugins: [
    themeableVariableLinter.themeableVariableLinterPlugin(),
  ],
...
```
