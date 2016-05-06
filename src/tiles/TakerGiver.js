import pop from "pop";
import Tile from "./Tile";
import Dirs from "../Dirs";
import env from "../env";
import State from "../State";

const {
  Texture
} = pop;

const mapTiles = new Texture( "res/images/takergiver.png" );

class TakerGiver extends Tile {

  static type = "TakerGiver";
  static rotates = true;
  static icon = { x: 3, y: 3 };

  state = new State( "IDLE" );
  processingTime = 1000;
  speed = 0.025;

  constructor ( dir ) {

    super( mapTiles, 32, 32 );

    this.dir = dir;
    this.frame.y = Dirs.toIndex( dir );
    this.frame.x = 0;

  }

  updateAnimFrame ( dt, t ) {

    const { dir } = this;
    const { tileW, tileH } = env;

    if ( this.dir === Dirs.RIGHT ) {

      this.frame.x = ! this.item ? [0, 4][(t / 400 | 0) % 2] : this.item_x / ( tileW / 4 ) | 0;

    }

    if ( this.dir === Dirs.LEFT ) {

      this.frame.x = ! this.item ? [0, 4][(t / 400 | 0) % 2] : ( ( tileW - this.item_x ) / ( tileW / 4 ) | 0 ) ;

    }

    if ( this.dir === Dirs.DOWN ) {

      this.frame.x = ! this.item ? [0, 4][(t / 400 | 0) % 2] : ( this.item_y / ( tileH / 4 ) | 0 );

    }

    if ( this.dir === Dirs.UP ) {

      this.frame.x = ! this.item ? [0, 4][(t / 400 | 0) % 2] : ( ( tileH - this.item_y ) / ( tileH / 4 ) | 0 );

    }

    //if (this.frame.x < 0 || this.frame.x > 3) {

      // Bad frame... fix this... item rel position is still moving even when stuck!
      //this.frame.y = 0;
      //this.frame.x = 0;

    //} else {

    this.frame.y = Dirs.toIndex( dir );

    //}
  }

  update ( dt, t, map ) {

    const { dir, speed, pos, item } = this;

    this.state.tick( dt, t );

    this.updateAnimFrame( dt, t );

    switch ( this.state.get() ) {

    case "IDLE": {

      const { x, y, } = map.worldToTilePosition( pos );
      const next = map.getTileInDir( x, y, Dirs.opposite( dir ) );

      if ( item ) {

        // Only here if placed a TakerGiver on a blank tile with item.
        this.state.to( "TAKING" );

      }

      else {

        let nextItem = next.reliquishItem( map, true );

        if ( nextItem && nextItem.type !== "Iron" ) {

          nextItem = next.reliquishItem( map );
          this.acceptItem( nextItem, next );
          this.state.to( "TAKING" );

        }

      }

      break;
    }

    case "TAKING": {

      const xo = speed * dt * Dirs.dtHoriz( dir );
      const yo = speed * dt * Dirs.dtVert( dir );

      // Logical position
      this.item_x += xo;
      this.item_y += yo;

      // Screen position
      item.pos.x += xo;
      item.pos.y += yo;

      if ( this.state.time > this.processingTime ) {

        const { x, y, } = map.worldToTilePosition( pos );
        const next = map.getTileInDir( x, y, dir );

        if ( next && next.acceptItem( item, this ) ) {

          this.item = null;
          this.state.to( "IDLE" );

        } else {

          // Blocked!
          item.pos.x -= xo;
          item.pos.y -= yo;
          this.item_x -= xo;
          this.item_y -= yo;

        }

      }

    }

    }

  }

}

module.exports = TakerGiver;
