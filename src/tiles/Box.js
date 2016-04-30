import pop from "pop";
import Tile from "./Tile";

const {
  Texture
} = pop;

const mapTiles = new Texture( "res/images/source.png" );

class Box extends Tile {

  static type = "Box";
  static rotates = false;
  static icon = { x: 0, y: 1 };


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
