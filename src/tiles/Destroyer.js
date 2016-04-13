import pop from "pop";
import Tile from "./Tile";
import Dirs from "../Dirs";
import env from "../env";

const {
  Texture
} = pop;

const mapTiles = new Texture( "res/images/destroyer.png" );

class Destroyer extends Tile {

  constructor ( dir ) {

    super( mapTiles, 32, 32 );

    this.type = "Destroyer";
    this.dir = dir;

    this.wall = true;
    this.state = "IDLE";
    this.stateTime = 0;

  }

  update ( dt, t, map ) {

    const { item } = this;

    if ( ! item ) {

      return;

    }

    map.removeItem(  item );
    this.acceptedItem = false;
    this.item = null;

  }

}

module.exports = Destroyer;
