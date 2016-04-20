var pop = require("pop");

var bullet = new pop.Texture("res/images/bullet.png");

function Iron() {

  pop.Sprite.call(this, bullet);
  this.type = "iron";
  this.relPos = {x: 0, y: 0};
  
}
Iron.prototype = Object.create(pop.Sprite.prototype);

module.exports = Iron;
