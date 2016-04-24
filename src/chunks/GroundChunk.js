import pop from "pop";
const {
  TileMap,
  Texture
} = pop;

import env from "../env";
const {
  tileW,
  tileH,
  chunkW,
  chunkH
} = env;

const mapTiles = new Texture( "res/images/earth.png" );

class GroundChunk extends TileMap {

  constructor ( chunkX, chunkY ) {

    const tiles = Array.from(

      new Array( chunkW * chunkH ),

      ( ) => {

        const fuel = Math.random() > 0.05 ? 0 : ( Math.random() * 10 + 5 | 0 );
        return {
          fuel,
          x: Math.random() * 4 | 0,
          y: fuel > 0 ? 1 : 0
        };
      }

    );

    super( {
      texture: mapTiles,
      tiles: tiles,
      w: chunkW,
      h: chunkH,
      tileW: tileW,
      tileH: tileH
    } );

    this.pos.x = chunkX * chunkW * tileW;
    this.pos.y = chunkY * chunkH * tileH;

  }

}

export default GroundChunk;
