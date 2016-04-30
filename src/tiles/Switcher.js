import pop from "pop";
import Tile from "./Tile";
import Dirs from "../Dirs";
import env from "../env";

const {
  Texture
} = pop;

const mapTiles = new Texture( "res/images/switcher.png" );

class Switcher extends Tile {

  type = "Switcher";
  rotates = true;
  static type = "Switcher";
  static rotates = true;
  static icon = { x: 0, y: 5 };

  speed = 0.05;

  constructor ( dir ) {

    super( mapTiles, 32, 32 );

    this.dir = dir;
    this.lastDir = dir;

    this.frame.y = Dirs.toIndex( dir );
    this.frame.x = 0;

  }

  update ( dt, t, map ) {

    this.frame.x = ( t / 600 | 0 ) % 2;

    if ( this.dir === Dirs.RIGHT ) {

      this.frame.x = ! this.item ? 3 : this.item_x / ( tileW / 4 ) | 0;

    }

    if ( this.dir === Dirs.LEFT ) {

      this.frame.x = ! this.item ? 3 : ( ( tileW - this.item_x ) / ( tileW / 4 ) | 0 ) ;

    }

    if ( this.dir === Dirs.DOWN ) {

      this.frame.x = ! this.item ? 2 : ( this.item_y / ( tileH / 4 ) | 0 );

    }

    if ( this.dir === Dirs.UP ) {

      this.frame.x = ! this.item ? 2 : ( ( tileH - this.item_y ) / ( tileH / 4 ) | 0 );

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

      const { x, y } = map.worldToTilePosition( pos );
      const n = map.get4Neigbours( x, y );
      const op = Dirs.opposite( dir );
      n[ Dirs.toIndex( op ) - 1 ] = null; // remove opposite
      const lastIdx = Dirs.toIndex( this.lastDir );
      const nextIdx = ( lastIdx + 1 ) % 5;
      const fromTile = this.fromTile;

      const chooseOne = n.filter( n => {

        return n && n.type !== "Blank" && n !== fromTile;

      } );

      const next = !chooseOne.length ?
        fromTile  :
        chooseOne[ Math.random() * chooseOne.length | 0 ];
      //const next = map.getTileInDir( x, y, dir );


      let dirsToCheck = Dirs.notDir( Dirs.opposite( dir ) );
      if ( dirsToCheck.length > 1 ) {

        dirsToCheck = dirsToCheck.filter( d => d !== this.lastDir );

      }

      // console.log( dirsToCheck );


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

module.exports = Switcher;
