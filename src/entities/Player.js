var pop = require("pop");
var bubble_walk = new pop.Texture("res/images/cursor.png");
var walkFrames = [0].map(function (x) { return { x: x, y: 0 }; });

function Player (controls, tryMove) {
  pop.TileSprite.call(this, bubble_walk, 40, 40);
  this.tryMove = tryMove;
  this.controls = controls;
  this.curTick = 0;
  this.curWalk = 0;
  this.frame = walkFrames[0];

  this.hitBox = {
    x: 0,
    y: 0,
    w: 24,
    h: 30
  };

  this.dir = 1;
  this.velocity = { x: 0, y: 0 };
  this.acceleration = { x: 0.1, y: 0.12};

  this.speed = 0.1;
}
Player.prototype = Object.create(pop.TileSprite.prototype);

Player.prototype.update = function (dt, t) {
  var controlsX = this.controls.x();
  var controlsY = this.controls.y();

  this.velocity.y += this.acceleration.y * dt * controlsY * 0.01;
  this.velocity.x += this.acceleration.x * dt * controlsX * 0.01;

  var response = this.tryMove(this.pos, {
    x: (controlsX * this.speed + this.velocity.x) * dt,
    y: (controlsY * this.speed + this.velocity.y) * dt
  });

  this.velocity.x *= 0.9;
  this.velocity.y *= 0.9;

  // Player fired
  if (this.controls.action() && this.weapon) {
    this.weapon.shoot(
      {x: this.pos.x, y: this.pos.y},
      this.dir,
      t);
  }

  // Update position
  this.pos.x = response.x;
  this.pos.y = response.y;

  // Walking animation (when moving)
  var walkFrameRate = 15 / this.speed;
  if ((controlsY || controlsX) && (this.curTick += dt) > walkFrameRate) {
    this.curWalk ++;
    this.frame = walkFrames[this.curWalk % walkFrames.length];
    this.curTick -= walkFrameRate;
  }
  this.dir = controlsX > 0 ? 1 : controlsX < 0 ? -1 : this.dir;
};

module.exports = Player;
