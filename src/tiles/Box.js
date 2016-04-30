import pop from "pop";
import Tile from "./Tile";

const {
  Texture
} = pop;

const mapTiles = new Texture( "res/images/destroyer.png" );

class Box extends Tile {

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

export default Box;
