import pop from "pop";
import Tile from "./Tile";
import Dirs from "../Dirs";
import env from "../env";

const {
  Texture
} = pop;

const mapTiles = new Texture( "res/images/passer.png" );

class Source extends Tile {

  speed = 0.03;

  constructor ( dir ) {

    super( mapTiles, 32, 32 );

    this.type = "Source";
    this.dir = dir;
    this.frame.y = Dirs.toIndex( dir );
    this.frame.x = 0;

    this.state = "IDLE";
    this.stateTime = 0;

  }

  update ( dt, t, map ) {

    const { item, speed, dir, pos } = this;
    const { tileW, tileH } = env;

    if ( ! item ) {

      return;

    }

    const xo = speed * dt * Dirs.dtHoriz( dir );
    const yo = speed * dt * Dirs.dtVert( dir );

    // Logical position
    const rxo = this.item_x += xo;
    const ryo = this.item_y += yo;

    // Did move off tile?
    const wantsToMoveToNextTile = dir === Dirs.UP && ryo < 0 ||
      dir === Dirs.DOWN && ryo > tileH ||
      dir === Dirs.LEFT && rxo < 0 ||
      dir === Dirs.RIGHT && rxo > tileW;

    if ( wantsToMoveToNextTile ) {

      const { x, y, } = map.worldToTilePosition( pos );
      const next = map.getTileInDir( x, y, dir );

      if ( next && next.acceptItem( item, this ) ) {

        this.item = null;

      }

      return;

    }

    // Screen position
    item.pos.x += xo;
    item.pos.y += yo;

  }

}

module.exports = Source;
