import pop from "pop";
import Tile from "./Tile";
import Dirs from "../Dirs";
import env from "../env";

const {
  Texture
} = pop;

const mapTiles = new Texture( "res/images/passer.png" );

class Switcher extends Tile {

  speed = 0.03;

  constructor ( dir ) {

    super( mapTiles, 32, 32 );

    this.type = "Switcher";
    this.dir = dir;
    this.lastDir = dir;

    this.frame.y = Dirs.toIndex( dir );
    this.frame.x = 0;

    this.wall = true;
    this.state = "IDLE";
    this.stateTime = 0;

  }

  update ( dt, t, map ) {

    this.frame.x = ( t / 600 | 0 ) % 2;

    if ( this.dir === Dirs.RIGHT ) {

      this.frame.x = ! this.item ? 3 : ( ( this.item_x - 16 ) / 4 ) | 0;

    }

    if ( this.dir === Dirs.LEFT ) {

      this.frame.x = ! this.item ? 0 : ( ( this.item_x - 1 ) / 4 ) | 0;

    }

    if ( this.dir === Dirs.DOWN ) {

      this.frame.x = ! this.item ? 2 : ( ( this.item_y - 16 ) / 4 ) | 0;

    }

    if ( this.dir === Dirs.UP ) {

      this.frame.x = ! this.item ? 2 : ( ( Math.max(0, 15 - this.item_y) ) / 4 ) | 0;

    }


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

      let dirsToCheck = Dirs.notDir( Dirs.opposite( dir ) );
      if ( dirsToCheck.length > 1 ) {

        dirsToCheck = dirsToCheck.filter( d => d !== this.lastDir );

      }

      // console.log( dirsToCheck );


      if ( next && next.acceptItem( item ) ) {

        this.item = null;

      }

      return;

    }

    // Screen position
    item.pos.x += xo;
    item.pos.y += yo;

  }

}

module.exports = Switcher;
