import pop from "pop";
import Tile from "./Tile";
import Dirs from "../Dirs";
import Iron from "../items/Iron";
import env from "../env";

const {
  Texture
} = pop;

const mapTiles = new Texture( "res/images/source.png" );

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

  accepts () {

    return false;

  }

  update ( dt, t, map ) {

    const { item, dir, pos } = this;

    this.stateTime += dt;

    if ( this.stateTime < 3000 ) {

      return;

    }

    this.stateTime = 0;

    const { x, y, } = map.worldToTilePosition( pos );
    const next = map.getTileInDir( x, y, dir );

    map.addItem( new Iron(), map.worldToTilePosition( next.pos ) );

  }

}

module.exports = Source;
