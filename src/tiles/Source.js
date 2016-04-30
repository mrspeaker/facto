import pop from "pop";
import Tile from "./Tile";
import Iron from "../items/Iron";

const {
  Texture
} = pop;

const mapTiles = new Texture( "res/images/source.png" );

class Source extends Tile {

  static type = "Source";
  static rotates = false;
  static icon = { x: 0, y: 1 };

  speed = 0.03;

  constructor ( dir ) {

    super( mapTiles, 32, 32 );

    this.dir = dir;
    this.frame.y = 0;//Dirs.toIndex( dir );
    this.frame.x = 0;

    this.state = "IDLE";
    this.stateTime = 0;

  }

  accepts () {

    return false;

  }

  update ( dt, t, map ) {

    const { pos } = this;

    if ( this.state === "IDLE" ) {

      this.stateTime += dt;
      if ( this.stateTime < 2000 ) {

        return;

      }

      const item = this.item = new Iron();
      map.addItem( item, map.worldToTilePosition( pos ), true );
      this.itemToCentre();
      this.state = "COOKED";
      this.stateTime = 0;

    }

    else if ( this.state === "COOKED" ) {

      this.stateTime += dt;
      if ( this.stateTime < 1000 ) {

        return;

      }

      this.state = "LOADED";
      this.stateTime = 0;

    }

  }

  reliquishItem () {

    const { state, item } = this;

    if ( state !== "LOADED" || ! item ) {

      return null;

    }

    this.state = "IDLE";
    this.stateTime = 0;
    this.item = null;

    return item;

  }

}

module.exports = Source;
