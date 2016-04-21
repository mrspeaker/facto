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

  update ( dt, t, map ) {

    const { dir, pos } = this;

    if ( this.state === "IDLE" ) {

      const { x, y, } = map.worldToTilePosition( pos );
      const next = map.getTileInDir( x, y, dir );

      const item = next.reliquishItem();
      if ( item ) {

        this.acceptItem( item, next );
        this.state = "TAKING";
        this.stateTime = 0;

      }

    } else if ( this.state === "TAKING" ){

      if ( ( this.stateTime += dt ) > this.processingTime ) {

        const { x, y, } = map.worldToTilePosition( pos );
        const next = map.getTileInDir( x, y, Dirs.opposite( dir ) );

        if ( next && next.acceptItem( this.item, this ) ) {

          this.item = null;
          this.state = "IDLE";

        }

      }

    }

  }

}

module.exports = TakerGiver;
