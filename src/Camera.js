var pop = require("pop");
var Container = pop.Container;
var mathutils = pop.mathutils;

/**
 * props:
   - focusObject: an object with a .pos position to focus on
   - viewport: an array of [ width, height ] of the Canvas
   - mapSize: an array of [ width, height ] of the game map
   - scale (optional): number
   - moveSpeed (optional): number
 */
function Camera (props) {
  var defaults = {
    scale: 1,
    moveSpeed: 1
  };

  Container.call(this);
  // TODO: have to explain this defaults stuff if we use it.
  for (var key in defaults) {
    this[key] = defaults[key];
  }
  for (key in props) {
    this[key] = props[key];
  }
  this.scale = {
    x: this.scale,
    y: this.scale
  };
  this.focusOn(this.focusObject.pos, 1);
}
Camera.prototype = Object.create(Container.prototype);
Camera.prototype.focusOn = function (pos, easingFactor) {
  var x = - mathutils.clamp(pos.x * this.scale.x - this.viewport.w / 2, 0, this.scale.x * this.worldSize.w - this.viewport.w);
  var y = - mathutils.clamp(pos.y * this.scale.y - this.viewport.h / 2, 0, this.scale.y * this.worldSize.h - this.viewport.h);

  this.pos.x = mathutils.mix(this.pos.x, x, easingFactor);
  this.pos.y = mathutils.mix(this.pos.y, y, easingFactor);
};
Camera.prototype.update = function (dt, t) {
  Container.prototype.update.call(this, dt, t);
  this.focusOn(this.focusObject.pos, this.moveSpeed * dt);
};

module.exports = Camera;
