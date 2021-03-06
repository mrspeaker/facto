import pop from "pop";
import Tile from "./Tile";
import Dirs from "../Dirs";
import env from "../env";
import State from "../State";

const {
  Texture
} = pop;

const mapTiles = new Texture( "res/images/switcher.png" );

class Switcher extends Tile {

  static type = "Switcher";
  static rotates = false;
  static icon = { x: 0, y: 5 };

  speed = 0.05;
  state = new State( "IDLE" );

  constructor ( dir ) {

    super( mapTiles, 32, 32 );

    this.dir = dir;
    this.lastDir = dir;

    this.frame.y = 2;
    this.frame.x = 0;

    // IDLE, PASSING

  }

  choose ( map ) {

    const { pos, item } = this;

    const { x, y } = map.worldToTilePosition( pos );
    const n = map.get4Neigbours( x, y )
      .map( ( tile, i ) => ({ i, tile }) )
      .filter( ({ tile }) => tile !== this.fromTile )
      .filter( ({ tile }) => tile.accepts( item ) );

    const blanks = n.filter( ({ tile }) => tile.constructor.type === "Blank" );
    const others = n.filter( ({ tile }) => tile.constructor.type !== "Blank" );

    if ( others.length ) {

      return Dirs.indexToDir( others[ Math.random() * others.length | 0 ].i + 1 );

    }

    if ( blanks.length ) {

      return Dirs.indexToDir( blanks[ Math.random() * blanks.length | 0 ].i + 1 );

    }

    return Dirs.NONE;

  }

  update ( dt, t, map ) {

    const { item, speed, pos, dir, state } = this;
    const { tileW, tileH } = env;

    state.tick( dt, t );

    this.updateAnimFrame( dt, t );

    switch ( this.state.get() ) {

    case "IDLE":

      if ( ! item ) {

        return;

      }

      // Choose dir
      this.dir = this.choose( map );
      this.state.to( "PASSING" );
      break;

    case "PASSING": {

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
        if ( next.acceptItem( item, this, map ) ) {

          this.item = null;
          this.state.to( "IDLE" );

        }
        return;

      }

      // Screen position
      item.pos.x += xo;
      item.pos.y += yo;
      break;
    }
    }

  }

  updateAnimFrame ( dt, t ) {

    const { item, frame, dir, item_x, item_y } = this;
    const { tileW, tileH } = env;

    if ( ! item ) {

      frame.x = ( t / 600 | 0 ) % 2;
      frame.y = 2;
      return;

    }

    frame.y = Dirs.toIndex( dir );

    if ( dir === Dirs.RIGHT ) {

      frame.x = item_x / ( tileW / 4 ) | 0;

    }

    if ( this.dir === Dirs.LEFT ) {

      frame.x = ( tileW - item_x ) / ( tileW / 4 ) | 0;

    }

    if ( this.dir === Dirs.DOWN ) {

      frame.x = item_y / ( tileH / 4 ) | 0;

    }

    if ( this.dir === Dirs.UP ) {

      frame.x = ( tileH - item_y ) / ( tileH / 4 ) | 0;

    }

  }

}

module.exports = Switcher;
