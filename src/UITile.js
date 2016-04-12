var pop = require("pop");
var tiles = new pop.Texture("res/images/tiles.png");

function UITile () {
  pop.TileSprite.call(this, tiles, 32, 32);
  this.frame = {x:0, y:0};
}

UITile.prototype = Object.create(pop.TileSprite.prototype);

module.exports = UITile;
