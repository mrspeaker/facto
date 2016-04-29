import pop from "pop";
import Tile from "./Tile";
import Dirs from "../Dirs";
import Iron from "../items/Iron";

const {
  Texture
} = pop;

const mapTiles = new Texture( "res/images/source.png" );

class Source extends Tile {

  type = "Source";
  speed = 0.03;

  constructor ( dir ) {

    super( mapTiles, 32, 32 );

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

    const { dir, pos } = this;
    let { item } = this;

    this.stateTime += dt;
    if ( this.stateTime < 3000 ) {

      return;

    }

    if ( ! item ) {

      item = this.item = new Iron();

    }

    const { x, y, } = map.worldToTilePosition( pos );
    const next = map.getTileInDir( x, y, dir );
    if ( next.accepts( item ) ) {

      this.stateTime = 0;
      map.addItem( item, map.worldToTilePosition( next.pos ) );
      this.item = null;

    }

    this.stateTime = 0;

  }

}

module.exports = Source;
