var Tile = require("./Tile");
var Dirs = require("../Dirs");

function Inserter (dir) {
  Tile.call(this);
  this.type = "Inserter";
  this.dir = dir;
  this.x = this.dir + 1;
  this.y = 1;
  this.wall = true;
  this.items = [];
  this.state = "IDLE";
  this.stateTime = 0;
}

Inserter.prototype = Object.create(Tile.prototype);
Inserter.prototype.update = function (map, pos) {
  if (this.state === "IDLE") {

    // Check for takeable item
    if (!this.inputItem) {
      var source = map.getTileInDir(pos.x, pos.y, this.dir);
      if (source && source.takeableItem) {
        this.inputItem = {item: source.takeableItem, dir: Dirs.UP};
        source.items = source.items.filter(function (i) {
          return i !== source.takeableItem;
        });
        source.takeableItem = null;
      }
    }

    if (this.inputItem) {
      this.state = "TAKING";
      if (Dirs.isHoriz(this.dir)) {
        this.inputItem.item.pos.x += Dirs.dtHoriz(Dirs.opposite(this.dir)) * map.map.tileW;
      }
      if (Dirs.isVert(this.dir)) {
        this.inputItem.item.pos.y += Dirs.dtVert(Dirs.opposite(this.dir)) * map.map.tileH;
      }
    }
  }
  else if (this.state === "TAKING" && this.stateTime++ > 80 && !this.outputItem) {
    this.outputItem = this.inputItem.item;
    this.inputItem = null;
    this.stateTime = 0;
    this.state = "IDLE";
  }

  if (this.outputItem) {
    var next = map.getTileInDir(pos.x, pos.y, Dirs.opposite(this.dir));
    if (next.cueInputItem(this.outputItem, Dirs.opposite(this.dir))) {
      this.outputItem = null;
    }
  }

};
module.exports = Inserter;
