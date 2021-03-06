import pop from "pop";
import Tile from "./Tile";
import Bronze from "../items/Bronze";
import Dirs from "../Dirs";
import env from "../env";

const {
  Texture
} = pop;

const mapTiles = new Texture( "res/images/transformer.png" );

class Transformer extends Tile {

  static type = "Transformer";
  static rotates = false;
  static icon = { x: 0, y: 4 };

  constructor ( dir ) {

    super( mapTiles, env.tileW, env.tileH );

    this.dir = dir;
    this.frame.y = 1;

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

module.exports = Transformer;
