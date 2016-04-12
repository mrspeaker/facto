var pop = require("pop");
var Iron = require("./items/Iron");

var maptiles = new pop.Texture("res/images/tiles.png");

var Dirs = require("./Dirs");
var Ground = require("./tiles/Ground");
var Belt = require("./tiles/Belt");
var Inserter = require("./tiles/Inserter");
var Burner = require("./tiles/Burner");

var tileTypes = [Ground, Belt, Inserter, Burner];

function LevelMap (seed) {
  var tileW = 32;
  var tileH = 32;
  var mapW = 40;
  var mapH = 20;

  pop.mathutils.rnd.seed = seed;

  // Init empty map
  var level = [];
  for (var j = 0; j < mapH; j++) {
    for (var i = 0; i < mapW; i++) {
      tile = new Ground();
      level.push(tile);
    }
  }

  // Gen some belts
  this.heads = [];
  /*
  function getInDir (level, x, y, dir) {
    x += Dirs.dtHoriz(dir);
    y += Dirs.dtVert(dir);
    return [level[y * mapW + x], x, y];
  }

  for (i = 0; i < 4; i++) {
    var xs = (Math.random() * (mapW - 10) | 0) + 4;
    var ys = (Math.random() * (mapH / 2) | 0) + 4;
    level[(ys + 1) * mapW + xs - 1] = new Inserter(Dirs.RIGHT);

    this.heads.push([xs, ys]);
    var dir = Math.random() * 4 | 0;
    level[ys * mapW + xs] = new Belt(dir);
    var len = (Math.random() * 20 | 0) + 5;
    var ok = true;
    while(len-- && ok) {
      var nextTile = getInDir(level, xs, ys, dir);
      if (nextTile[0]) {
        xs = nextTile[1];
        ys = nextTile[2];

        // Switch dirs
        if (Math.random() < 0.3) {
          var lrud = !!(Math.random() < 0.3);
          if (dir === Dirs.UP || dir === Dirs.DOWN) {
            dir = lrud ? Dirs.LEFT : Dirs.RIGHT;
          } else {
            dir = lrud ? Dirs.UP : Dirs.DOWN;
          }
        }

        level[ys * mapW + xs] = new Belt(dir);
      } else {
        ok = false;
      }
    }
  }

  */
  var u=1, d=2, l=4, r=8, I=9, IR=10, IL=11, ID=12, B=13;
  var p = [
    [r, r, r, r, r, r, r, d],
    [0, u, 0, I, 0, 0, 0, d],
    [0, u, 0, r, r, d,IR, d],
    [0, u, 0, 0, 0, d, 0, d],
    [0, u, 0, 0, d,ID, l, l],
    [0, u, l, l, l, l, 0, 0]
  ];

  var padding = 2;
  for (j = 0; j < p.length; j++) {
    for (i = 0; i < p[j].length; i++) {
      var tile = p[j][i];
      if (!tile) continue;
      if (tile === I) tile = new Inserter(Dirs.UP);
      else if (tile === IR) tile = new Inserter(Dirs.RIGHT);
      else if (tile === IL) tile = new Inserter(Dirs.LEFT);
      else if (tile === ID) tile = new Inserter(Dirs.UP);
      else if (tile === B) tile = new Burner(Dirs.UP);
      else tile = new Belt(tile);
      level[(j + padding) * mapW + (i + padding)] = tile;
    }
  }
  this.heads.push([padding, padding]);

  pop.TileMap.call(this, {
    texture: maptiles,
    tiles: level,
    w: mapW,
    h: mapH,
    tileW: tileW,
    tileH: tileH
  });

}

LevelMap.prototype = Object.create(pop.TileMap.prototype);

LevelMap.prototype.getTileInDir = function (x, y, dir) {
  x += Dirs.dtHoriz(dir);
  y += Dirs.dtVert(dir);
  return this.map.tiles[y * this.map.w + x];
};

LevelMap.prototype.findFreeSpot = function () {
  var found = false;
  var map = this.map;
  while (!found) {
    var x = pop.mathutils.rnd.rand(0, map.w);
    var y = pop.mathutils.rnd.rand(0, map.h);
    var tile = this.tileAtPosition({x:x, y:y});
    if (!tile.frame.wall) {
      found = true;
    }
  }
  return {x: x * map.tileW, y: y * map.tileH};
};

LevelMap.prototype.addItem = function (item, x, y) {
  var tileW = this.map.tileW;
  var tileH = this.map.tileH;

  // Set gfx pos
  item.relPos.x = tileW / 2 | 0;
  item.relPos.y = tileW / 2 | 0;
  item.pos.x = (x * tileW) + item.relPos.x - Dirs.halfItemWidth;
  item.pos.y = (y * tileH) + item.relPos.y - Dirs.halfItemWidth;

  this.add(item);
  return item;
};

LevelMap.prototype.setTile = function (tileTypeIdx, dir, x, y) {
  var tilePos = this.worldToTilePosition({x:x, y:y});
  var offset = tilePos.y * this.map.w + tilePos.x;
  var oldTile = this.map.tiles[offset];

  var tile = new tileTypes[tileTypeIdx](dir);

  // nope - doesn't seem to work - should be able to click with items in
  // existing tile and keep working.
  tile.inputItem = oldTile.inputItem;
  tile.outputItem = oldTile.outputItem;
  tile.items = this.map.tiles[offset].items.slice(0); // Copy items

  this.children[offset].frame = tile; // Update gfx ref
  this.map.tiles[offset] = tile; // Update tilemap ref
};

LevelMap.prototype.update = function (dt) {
  // Randomly add some iron
  var justOneThanks = false;
  if (Math.random() < 0.004 && (!justOneThanks || !this.justOne)) {
    this.justOne = true;
    var idx = Math.random() * this.heads.length | 0;
    var x = this.heads[idx][0];
    var y = this.heads[idx][1];
    var tile = this.map.tiles[y * this.map.w + x];
    if (!tile.inputItem) {
      tile.inputItem = {item: this.addItem(new Iron(), x, y), dir: Dirs.LEFT};
    }
  }

  // Update every tile in chunk
  this.map.tiles.forEach(function (t, i) {
    var pos = this.tileIndexToPosition(i);
    t.update && t.update(this, pos, i, dt);
  }, this);
};


module.exports = LevelMap;
