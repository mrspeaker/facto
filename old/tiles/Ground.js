var Tile = require("./Tile");

function Ground() {
  Tile.call(this);
  this.type = "Ground";
  this.x = 0;
  this.y = 0;
  this.wall = false;
  this.items = [];
}
Ground.prototype = Object.create(Tile.prototype);

module.exports = Ground;
