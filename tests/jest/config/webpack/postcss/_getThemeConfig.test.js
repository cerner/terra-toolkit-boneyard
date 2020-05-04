const getThemeConfig = require('../../../../../config/webpack/postcss/_getThemeConfig');

describe('get Theme Config', () => {
  it('returns empty if nothing can be found', () => {
    expect(getThemeConfig()).toEqual({});
  });
});
