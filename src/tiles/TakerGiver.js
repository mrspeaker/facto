import pop from "pop";
import Tile from "./Tile";
import Dirs from "../Dirs";

const {
  Texture
} = pop;

const mapTiles = new Texture( "res/images/takergiver.png" );

class TakerGiver extends Tile {

  processingTime = 1000;

  constructor ( dir ) {

    super( mapTiles, 32, 32 );

    this.type = "TakerGiver";
    this.dir = dir;
    this.frame.y = Dirs.toIndex( dir );
    this.frame.x = 0;

    this.state = "IDLE";
    this.stateTime = 0;

  }

  updateAnimFrame ( t ) {

    this.frame.x = ( t / 600 | 0 ) % 2;

    if ( this.dir === Dirs.RIGHT ) {

      this.frame.x = ! this.item ? 3 : ( ( this.item_x - 16 ) / 4 ) | 0;

    }

    if ( this.dir === Dirs.LEFT ) {

      this.frame.x = ! this.item ? 3 : 3 - ( ( this.item_x - 1 ) / 4 ) | 0;

    }

    if ( this.dir === Dirs.DOWN ) {

      this.frame.x = ! this.item ? 2 : ( ( this.item_y - 16 ) / 4 ) | 0;

    }

    if ( this.dir === Dirs.UP ) {

      this.frame.x = ! this.item ? 2 : ( ( Math.max(0, 15 - this.item_y) ) / 4 ) | 0;

    }

    if (this.frame.x < 0 || this.frame.x > 3) {
      // Bad frame... fix this... item rel position is still moving even when stuck!
      this.frame.y = 0;
      this.frame.x = 0;
    } else {
      this.frame.y = Dirs.toIndex( this.dir );
    }

  }

  update ( dt, t, map ) {

    const { dir, pos, item } = this;

    this.updateAnimFrame( t );

    if ( this.state === "IDLE" ) {

      const { x, y, } = map.worldToTilePosition( pos );
      const next = map.getTileInDir( x, y, Dirs.opposite( dir ) );

      if ( item ) {

        // Only here if "created" on an item...
        this.state = "TAKING";
        this.stateTime = 0;

      }
      else {

        const nextItem = next.reliquishItem();
        if ( nextItem ) {

          this.acceptItem( nextItem, next );
          this.state = "TAKING";
          this.stateTime = 0;

        }

      }

    } else if ( this.state === "TAKING" ) {

      if ( ( this.stateTime += dt ) > this.processingTime ) {

        const { x, y, } = map.worldToTilePosition( pos );
        const next = map.getTileInDir( x, y, dir );

        if ( next && next.acceptItem( this.item, this ) ) {

          this.item = null;
          this.state = "IDLE";

        }

      }

    }

  }

}

module.exports = TakerGiver;
