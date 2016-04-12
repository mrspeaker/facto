function Tile () {
  this.takeableItem = null;
  this.inputItem = null;
  this.outputItem = null;
  this.isPassiveInput = false;
}

Tile.prototype.canAcceptInputItem = function () {
  return !this.inputItem;
};

Tile.prototype.cueInputItem = function (item, dir) {
  if (!this.canAcceptInputItem()) {
    return false;
  }
  this.inputItem = {
    item: item,
    dir: dir
  };
  return true;
};

module.exports = Tile;
