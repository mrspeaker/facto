import TileMap from "../../lib/TileMap";
import Blank from "../tiles/Blank";
import Passer from "../tiles/Switcher";
import TakerGiver from "../tiles/TakerGiver";
import Dirs from "../Dirs";
import env from "../env";
import Iron from "../items/Iron";

const {
  tileW,
  tileH,
  chunkW,
  chunkH
} = env;

class MachineChunk extends TileMap {

  constructor ( chunkX, chunkY ) {

    const tiles = Array.from(

      new Array( chunkW * chunkH ),

      ( _, i ) => {

        // Make a rectangle of passing
        const yp = i / chunkW | 0;
        const xp = i % chunkW;

        const isTop = yp === 2 && xp > 3 && xp < 11;
        const isBot = yp === 8 && xp > 4 && xp < 12;
        const isLeft = xp === 4 && yp > 2 && yp < 9;
        const isRight = xp === 11 && yp > 1 && yp < 9;

        const tile = isTop ? { type: "Passer", dir: Dirs.RIGHT } :
          isBot ? { type: "Passer", dir: Dirs.LEFT } :
          isLeft ? { type: "Passer", dir: Dirs.UP } :
          isRight ? { type: "Passer", dir: Dirs.DOWN } :
          { type: "Blank" };

        return tile;

      }

    );

    super( {
      tiles: tiles,
      w: chunkW,
      h: chunkH,
      tileW: tileW,
      tileH: tileH
    }, ( tileDeets, i ) => {

      const { type, dir } = tileDeets;
      let tile;

      if ( type === "Passer" ) {

        tile = new Passer( dir );

      } else {

        tile = new Blank();

      }

      // Set tile X an Y positions
      tile.x = i % chunkW;
      tile.y = i / chunkW | 0;

      return tile;

    } );

    // Add some items
    setInterval( () => {

      this.addItem( new Iron(), { x: 4, y: 2 } );

    }, 3000 );

    this.pos.x = chunkX * chunkW * tileW;
    this.pos.y = chunkY * chunkH * tileH;

  }

  getTileInDir ( x, y, dir ) {

    x += Dirs.dtHoriz( dir );
    y += Dirs.dtVert( dir );

    return this.children[ y * this.map.w + x ];

  }

  get4Neigbours ( x, y ) {

    return [

      this.getTileInDir( x, y, Dirs.UP ),
      this.getTileInDir( x, y, Dirs.DOWN ),
      this.getTileInDir( x, y, Dirs.LEFT ),
      this.getTileInDir( x, y, Dirs.RIGHT ),

    ];

  }

  addItem ( item, pos ) {

    const tile = this.tileAtPosition( pos );

    if ( !tile || !tile.acceptItem( item ) ) {

      return;

    }

    this.add( item );

    return item;

  }

  setTile ( newTileDeets, pos ) {

    const { type, dir } = newTileDeets;

    const tilePos = this.worldToTilePosition( pos );
    const offset = tilePos.y * this.map.w + tilePos.x;

    const oldTileDeets = this.map.tiles[ offset ];
    const oldTile = this.children[ offset ];

    if ( oldTileDeets.type === type && oldTileDeets.dir === dir ) {
      return;
    }

    const newTile = new {Passer: Passer, Blank: Blank}[type]( dir );
    newTile.x = oldTile.x;
    newTile.y = oldTile.y;
    newTile.pos.x = oldTile.pos.x;
    newTile.pos.y = oldTile.pos.y;
    newTile.item = oldTile.item; // Copy items
    oldTile.item = null;

    this.map.tiles[ offset ] = newTileDeets;
    this.children[ offset ] = newTile;

  }

}

export default MachineChunk;
