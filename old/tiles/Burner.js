var Tile = require("./Tile");
//var Dirs = require("../Dirs");

function Burner (dir) {
  Tile.call(this);
  this.type = "Burner";
  this.dir = dir;
  this.x = this.dir + 1;
  this.y = 2;
  this.wall = true;
  this.items = [];
  this.state = "IDLE";
  this.stateTime = 0;
}
Burner.prototype = Object.create(Tile.prototype);
Burner.prototype.update = function (map, pos) {
  if (this.state === "IDLE") {
    if (this.inputItem) {
      this.state = "BURNING";
      this.inputItem.item.pos.x = pos.x;
      this.inputItem.item.pos.y = pos.y;
    }
  }
  else if (this.state === "BURNING" && this.stateTime++ > 80 && !this.outputItem) {
    this.state = "IDLE";
    this.items.push(this.inputItem);
    this.inputItem = null;
    this.stateTime = 0;
    console.log(this.items.length);
    /*this.outputItem = this.inputItem.item;

  }

  if (this.outputItem) {
    /*var next = map.getTileInDir(pos.x, pos.y, Dirs.opposite(this.dir));
    if (next.cueInputItem(this.outputItem, Dirs.opposite(this.dir))) {
      this.outputItem = null;
    }*/
  }

};
module.exports = Burner;
