import pop from "pop";
const {
  Container,
} = pop;

// Just like a pop.TileMap - but pass a function to create the renderables
function TileMap (map, tileToRenderable) {
  Container.call(this);
  this.map = map;
  this.children = map.tiles.map(tileToRenderable)
    .map(function (r, i) {
      r.pos = this.tileToWorldPosition(this.tileIndexToPosition(i));
      return r;
    }, this);
}
TileMap.prototype = Object.create(Container.prototype);
TileMap.prototype.constructor = TileMap;

TileMap.prototype.tileAtPosition = function(p) {
  return this.children[p.y * this.map.w + p.x];
};

TileMap.prototype.tileIndexToPosition = function (i) {
  var w = this.map.w;
  return {
    x: i % w,
    y: Math.floor(i / w)
  };
};
TileMap.prototype.positionToTileIndex = function (p) {
  return this.map.w * p.y + p.x;
};
TileMap.prototype.worldToTilePosition = function (p) {
  return {
    x: Math.floor(p.x / this.map.tileW),
    y: Math.floor(p.y / this.map.tileH)
  };
};
TileMap.prototype.tileToWorldPosition = function (p) {
  return {
    x: p.x * this.map.tileW,
    y: p.y * this.map.tileH
  };
};

TileMap.prototype.tilesAtCorners = function (bounds, xo, yo) {
  return [
    [bounds.x, bounds.y], // Top Left point
    [bounds.x + bounds.w, bounds.y], // Top Right point
    [bounds.x, bounds.y + bounds.h], // Bottom Left point
    [bounds.x + bounds.w, bounds.y + bounds.h], // Bottom Right point
  ].map(function (point) {
    return this.tileAtPosition(
      this.worldToTilePosition({
        x: point[0] + xo,
        y: point[1] + yo
      }));
  }, this);
};

module.exports = TileMap;
