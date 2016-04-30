import pop from "pop";
import Tile from "./Tile";
import Bronze from "../items/Bronze";
import Dirs from "../Dirs";

const {
  Texture
} = pop;

const mapTiles = new Texture( "res/images/transformer.png" );

class MultiTransform extends Tile {

  static type = "MultiTransform";
  static rotates = false;
  static icon = { x: 0, y: 1 };

  a = null;
  b = null;

  constructor ( dir ) {

    super( mapTiles, 32, 32 );

    this.dir = dir;
    this.frame.y = Dirs.toIndex( this.dir );

    this.state = "CONSUMING";
    this.stateTime = 0;

    this.requiredCount = 3;
    this.count = 0;

  }

  accepts () {

    return this.state === "CONSUMING" && ! this.item;

  }

  update ( dt, t, map ) {

    const { pos, item } = this;

    if ( this.state === "CONSUMING" ) {

      if ( ! item ) {

        return;

      }

      map.removeItem(  item );
      this.frame.y = Dirs.toIndex( this.dir );
      this.frame.x++;
      this.item = null;

      if ( ++this.count === this.requiredCount ) {

        this.state = "PRODUCING";
        this.stateTime = 0;
        this.count = 0;

      }

    }

    else if ( this.state === "PRODUCING" ) {

      if ( ( this.stateTime += dt ) < 800 ) {

        return;

      }

      this.item = new Bronze();
      map.addItem( this.item, map.worldToTilePosition( pos ), true );
      this.itemToCentre();
      this.state = "COOLING";
      this.stateTime = 0;

    }

    else if ( this.state === "COOLING" ) {

      if ( ( this.stateTime += dt ) < 800 ) {

        return;

      }

      this.state = "LOADED";
      this.stateTime = 0;

    }

    else if ( this.state === "LOADED" ) {


    }

  }

  reliquishItem () {

    const { state, item } = this;

    if ( state !== "LOADED"  || ! item ) {

      return null;

    }

    this.state = "CONSUMING";
    this.stateTime = 0;
    this.frame.x = 0;
    this.item = null;

    return item;

  }

}

export default MultiTransform;
