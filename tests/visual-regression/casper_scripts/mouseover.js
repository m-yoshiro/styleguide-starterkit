module.exports = function (casper, scenario, vp) {
  casper.thenOpen(scenario.url, function () {
    this.echo( scenario.label + ': Mouseover');

    // Getting selectors of scenario.
    this.mouse.move(scenario.selectors[0]);
  });
  casper.run();
};
