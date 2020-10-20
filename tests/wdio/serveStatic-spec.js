describe('serveStatic', () => {
  describe('404 fallback', () => {
    before(() => browser.url('/derp'));

    it('matches screenshot', () => {
      Terra.validates.screenshot();
    });
  });

  describe('404 fallback with dash', () => {
    before(() => browser.url('/herp-derp'));

    it('matches screenshot', () => {
      Terra.validates.screenshot();
    });
  });

  describe('404 fallback js', () => {
    before(() => browser.url('/herp.js'));

    it('matches screenshot', () => {
      Terra.validates.screenshot({ selector: 'body' });
    });
  });

  describe('404 fallback html', () => {
    before(() => browser.url('/herp.html'));

    it('matches screenshot', () => {
      Terra.validates.screenshot();
    });
  });

  describe('404 fallback htm', () => {
    before(() => browser.url('/herp.htm'));

    it('matches screenshot', () => {
      Terra.validates.screenshot();
    });
  });

  describe('404 fallback nexted route', () => {
    before(() => browser.url('/derp/herp'));

    it('matches screenshot', () => {
      Terra.validates.screenshot();
    });
  });
});
