var pop = require("pop");

function TitleScreen (canvas, controls, onStart) {
  pop.Container.call(this);
  this.controls = controls;
  this.onStart = onStart;

}

TitleScreen.prototype = Object.create(pop.Container.prototype);

TitleScreen.prototype.update = function (dt, t) {
  pop.Container.prototype.update.call(this, dt, t);

  var actionPressed = this.controls.action();
  //if (actionPressed) {
    this.onStart({
      seed: Math.random() * 1000|0,
      localPlayerId: 0,
      players: []
    });
  //}
};

module.exports = TitleScreen;
