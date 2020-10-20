describe('matchScreenshot', () => {
  const viewports = Terra.viewports('tiny', 'huge');

  before(() => {
    browser.url('/compare.html');
    browser.setViewportSize(viewports[0]);
  });

  describe('matchScreenshot', () => {
    it('matches screenshot', () => {
      Terra.validates.screenshot();
    });
  });

  describe('matchScreenshot-test name', () => {
    it('checks [default] screenshot', () => {
      Terra.validates.screenshot('test-name-only');
    });
  });

  describe('matchScreenshot-options--viewports', () => {
    after(() => browser.setViewportSize(viewports[0]));

    it('matches screenshot', () => {
      Terra.validates.screenshot({ viewports });
    });
  });

  describe('matchScreenshot-options--selector', () => {
    it('matches screenshot', () => {
      Terra.validates.screenshot({ selector: '#content' });
    });
  });

  describe('matchScreenshot-options--misMatchTolerance', () => {
    after(() => {
      browser.refresh();
    });

    it('matches screenshot', () => {
      Terra.validates.screenshot();
    });

    it('adjusts image:', () => {
      browser.execute('document.getElementsByClassName("test")[0].style.color = "blue";');
    });

    it('matches screenshot', () => {
      Terra.validates.screenshot({ misMatchTolerance: 100 });
    });

    // Manually verify failure. Create same screenshots as the base screenshots
    it('default', () => {
      // create default screenshot selector
      const { selector } = browser.options.terra;

      // create default screenshot options
      const compareOptions = {};
      compareOptions.viewports = [];
      compareOptions.misMatchTolerance = browser.options.visualRegression.compare.misMatchTolerance;
      compareOptions.viewportChangePause = browser.options.visualRegression.viewportChangePause;

      const screenshots = browser.checkElement(selector, compareOptions);
      expect(screenshots).to.not.matchReference();
    });
  });

  describe('matchScreenshot-test name & options', () => {
    after(() => browser.setViewportSize(viewports[0]));

    it('matches screenshot', () => {
      Terra.validates.screenshot('button', { selector: '#content', viewports });
    });
  });

  describe('matchScreenshot-invalid options', () => {
    it('matches screenshot', () => {
      Terra.validates.screenshot('test-invalid-options', [viewports.tiny, viewports.huge]);
    });
  });
});
