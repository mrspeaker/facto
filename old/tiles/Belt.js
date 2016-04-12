import pop from "pop";

var Tile = require("./Tile");
var Dirs = require("../Dirs");

var passerTiles = new pop.Texture("res/images/passer.png");

function Belt(dir) {
  Tile.call(this);
  this.dir = dir;
  this.type = "Belt";
  this.x = {1: 1, 2: 2, 4: 3, 8:4}[dir]; // Frame
  this.y = 0;            // Frame

  this.wall = true;
  this.items = [];
  this.speed = 0.03;

  this.isPassiveInput = true;
}
Belt.prototype = Object.create(Tile.prototype);
Belt.prototype.update = function (map, pos, i, dt) {
  this.takeableItem = null;

  if (this.inputItem) {
    this.items.push(this.inputItem.item);
    // Sync gfx.
    this.syncGfxOnInput(this.inputItem, map, pos);
    this.inputItem = null;
  }

  this.items = this.items.filter(function (item) {
    var remove = this.updateItem(map, this, item, pos, i, dt);
    return remove;
  }, this);

  if (this.outputItem) {
    // get next, put in inputput
    var next = map.getTileInDir(pos.x, pos.y, this.dir);
    if (next.isPassiveInput && next.cueInputItem(this.outputItem, this.dir)) {
      this.outputItem = null;
    }
  }
};

// Testing... only 1 per belt.
Belt.prototype.canAcceptInputItem = function () {
  return this.items.length < 1 && !this.inputItem;
};

Belt.prototype.syncGfxOnInput = function (itemAndDir, level, pos) {
  // Where to put the item on the new tile
  var item = itemAndDir.item;
  var oldDir = itemAndDir.dir;
  var tileW = level.map.tileW;
  var tileH = level.map.tileH;
  var dir = this.dir;

  if (Dirs.isVert(dir)) {
    item.relPos.x = tileW / 2;
    if (Dirs.isHoriz(oldDir)) {
      item.relPos.y = tileH / 2;
    }
    else {
      item.relPos.y = Dirs.isUp(oldDir) ? tileH : 0;
    }
  }
  else {
    item.relPos.y = tileH / 2;
    if (Dirs.isVert(oldDir)) {
      item.relPos.x = tileW / 2;
    }
    else {
      item.relPos.x = Dirs.isLeft(oldDir) ? tileW : 0;
    }
  }

  // Set gfx position to new tile.
  item.pos.x = (pos.x * tileW) + item.relPos.x - Dirs.halfItemWidth;
  item.pos.y = (pos.y * tileH) + item.relPos.y - Dirs.halfItemWidth;
};

Belt.prototype.updateItem = function (level, tile, item, pos, i, dt) {
  var xo = this.speed * dt * Dirs.dtHoriz(tile.dir);
  var yo = this.speed * dt * Dirs.dtVert(tile.dir);

  var tileW = level.map.tileW;
  var tileH = level.map.tileH;

  item.relPos.x += xo;
  item.relPos.y += yo;
  item.pos.x += xo;
  item.pos.y += yo;

  var moveToOutput = tile.dir === Dirs.UP && item.relPos.y < 0 ||
    tile.dir === Dirs.DOWN && item.relPos.y > tileH ||
    tile.dir === Dirs.LEFT && item.relPos.x < 0 ||
    tile.dir === Dirs.RIGHT && item.relPos.x > tileW;

  if (moveToOutput) {
    // output buffer empty?
    if (this.outputItem) {
      // Nope... move it back!
      item.relPos.x -= xo;
      item.relPos.y -= yo;
      item.pos.x -= xo;
      item.pos.y -= yo;
      return true;
    }

    // Yes we can!
    this.outputItem = item;
    return false; // Remove item from current tile
  }

  // Is item "takeable" (close to the middle of the tile)
  var dist = 1;
  if (Math.abs(tileW / 2 - item.relPos.x) < dist && Math.abs(tileH / 2 - item.relPos.y) < dist) {
    tile.takeableItem = item;
  }
  return true;
};

module.exports = Belt;
