import pop from "pop";
import Tile from "./Tile";
import Dirs from "../Dirs";
import env from "../env";

const {
  Texture
} = pop;

const mapTiles = new Texture( "res/images/destroyer.png" );

class Destroyer extends Tile {

  type = "Destroyer";

  constructor ( dir ) {

    super( mapTiles, 32, 32 );
    this.dir = dir;

  }

  update ( dt, t, map ) {

    const { item } = this;

    if ( ! item ) {

      return;

    }

    map.removeItem(  item );
    this.item = null;

  }

}

module.exports = Destroyer;
