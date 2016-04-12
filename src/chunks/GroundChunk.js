import pop from "pop";
const {
  TileMap,
  Texture
} = pop;

import env from "../env";
const {
  tileW,
  tileH,
  chunkSize
} = env;

const mapTiles = new Texture( "res/images/earth.png" );

class GroundChunk extends TileMap {

  constructor ( chunkX, chunkY ) {

    const tiles = Array.from(

      new Array( chunkSize * chunkSize ),

      ( ) => ( { x: Math.random() * 4 | 0, y: 0 } )

    );

    super( {
      texture: mapTiles,
      tiles: tiles,
      w: chunkSize,
      h: chunkSize,
      tileW: tileW,
      tileH: tileH
    } );

    this.pos.x = chunkX * chunkSize * tileW;
    this.pos.y = chunkY * chunkSize * tileH;

  }

}

export default GroundChunk;
