function (pos, delta) {

  var x = delta.x, y = delta.y, entity = player;
  var tiles;
  var walkable;
  var tileEdge;
  var bounds = pop.utils.getBounds(entity);

  // Final amounts of movement to allow
  var xo = x;
  var yo = y;
  var ground = false;
  var head = false;

  // Check vertical movement
  if (y !== 0) {
    tiles = map.tilesAtCorners(bounds, 0, yo);
    walkable = tiles.map(function (t) { return !t.frame.wall; });

    // Hit your head
    if (y < 0 && !walkable[0] || !walkable[1]) {
      tileEdge = tiles[0].pos.y + tiles[0].h + 1;
      yo = tileEdge - bounds.y;
      head = true;
    }
    // Hit your feet
    if (y > 0 && !walkable[2] || !walkable[3]) {
      tileEdge = tiles[2].pos.y - 1;
      yo = tileEdge - (bounds.y + bounds.h);
      ground = true;
    }
  }

  // Check horizontal movement
  if (x !== 0) {
    tiles = map.tilesAtCorners(bounds, xo, yo);
    walkable = tiles.map(function (t) { return !t.frame.wall; });

    // Hit left edge
    if (x < 0 && !walkable[0] || !walkable[2]) {
      tileEdge = tiles[0].pos.x + tiles[0].w + 1;
      xo = tileEdge - bounds.x;
    }
    // Hit right edge
    if (x > 0 && !walkable[1] || !walkable[3]) {
      tileEdge = tiles[1].pos.x - 1;
      xo = tileEdge - (bounds.x + bounds.w);
    }
  }

  return {
    x: Math.min(map.map.tileW * map.map.w - 20, Math.max(10, entity.pos.x + xo)),
    y: Math.min(map.map.tileH * map.map.h - 40, Math.max(10, entity.pos.y + yo)),
    ground: ground,
    head: head
  };
}
