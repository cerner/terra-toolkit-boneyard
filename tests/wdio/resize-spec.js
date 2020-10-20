Terra.viewports().forEach((viewport) => {
  describe('Resize Example', () => {
    before(() => {
      browser.setViewportSize(viewport);
      browser.url('/compare.html');
    });

    it(`resizes ${viewport.name}`, () => {
      const size = browser.getViewportSize();
      expect(size.height).to.equal(viewport.height);
      expect(size.width).to.equal(viewport.width);
      Terra.validates.screenshot();
    });
  });
});
