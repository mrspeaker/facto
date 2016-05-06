import pop from "pop";
import Tile from "./Tile";
import Dirs from "../Dirs";
import env from "../env";
import State from "../State";

const {
  Texture
} = pop;

const mapTiles = new Texture( "res/images/passer.png" );

class Passer extends Tile {

  static type = "Passer";
  static rotates = true;

  static icon = { x: 0, y: 2 };

  state = new State( "IDLE" );
  speed = 0.05;

  constructor ( dir ) {

    super( mapTiles, 32, 32 );

    this.dir = dir;
    this.frame.y = Dirs.toIndex( dir );
    this.frame.x = 0;

  }


  updateAnimFrame ( dt, t ) {

    const { item, frame, dir, item_x, item_y } = this;
    const { tileW, tileH } = env;

    if ( dir === Dirs.RIGHT ) {

      frame.x = ! item ? 3 : item_x / ( tileW / 4 ) | 0;

    }

    if ( dir === Dirs.LEFT ) {

      frame.x = ! item ? 3 : ( ( tileW - item_x ) / ( tileW / 4 ) | 0 ) ;

    }

    if ( dir === Dirs.DOWN ) {

      frame.x = ! item ? [2, 4][(t / 300 | 0) % 2] : ( item_y / ( tileH / 4 ) | 0 );

    }

    if ( dir === Dirs.UP ) {

      frame.x = ! item ? 2 : ( ( tileH - item_y ) / ( tileH / 4 ) | 0 );

    }

    if (frame.x < 0 || frame.x > 5) {

      // Bad frame... fix this .. item rel position is still moving even when stuck!
      frame.y = 0;
      frame.x = 0;

    } else {

      frame.y = Dirs.toIndex( dir );

    }

  }

  update ( dt, t, map ) {

    const { item, dir, speed, pos, state } = this;
    const { tileW, tileH } = env;

    state.tick( dt );

    this.updateAnimFrame( dt, t );

    switch ( state.get() ) {
    case "IDLE":

      if ( this.item ) {

        state.to( "PASSING" );

      }
      else  {

        const { x, y, } = map.worldToTilePosition( pos );
        const next = map.getTileInDir( x, y, Dirs.opposite( dir ) );

        // Don't take from rotate-y things
        if ( ! next.constructor.rotates ) {

          const nextItem = next.reliquishItem( map );
          if ( nextItem ) {

            this.acceptItem( nextItem, next );
            this.state.to( "PASSING" );

          }

        }

      }

      break;

    case "PASSING": {

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
          this.state.to( "IDLE" );

        }

        return;

      }

      // Screen position
      item.pos.x += xo;
      item.pos.y += yo;

      break;
    }
    case "TAKING":
      break;
    }


  }

  reliquishItem ( map, tentative ) {

    const { item, item_x, item_y } = this;

    if ( ! item ) {

      return null;

    }

    if ( item_x <= 15 || item_x >= 17 ) return null;
    if ( item_y <= 15 || item_y >= 17 ) return null;

    if (!tentative) {

      this.item = null;

    }
    return item;

  }

}

module.exports = Passer;
