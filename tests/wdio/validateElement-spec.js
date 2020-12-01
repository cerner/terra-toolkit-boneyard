Terra.describeViewports('validateElement', ['tiny', 'small', 'huge'], () => {
  describe('full implementation', () => {
    before(() => {
      browser.url('/compare.html');
    });

    it('checks element', () => {
      Terra.validates.element();
    });
  });

  describe('inaccessible contrast', () => {
    before(() => browser.url('/inaccessible-contrast.html'));

    const ignoredA11y = {
      'color-contrast': { enabled: false },
    };

    it('checks element', () => {
      Terra.validates.element({ axeRules: ignoredA11y });
    });
  });
});
