import pop from "pop";
import Tile from "./Tile";

const {
  Texture
} = pop;

const mapTiles = new Texture( "res/images/box.png" );

class Box extends Tile {

  static type = "Box";
  static rotates = false;
  static icon = { x: 0, y: 7 };

  constructor () {

    super( mapTiles, 32, 32 );
    this.count = 0;
    this.maxCount = 4;

  }

  accepts () {

    return ! this.item && this.count < this.maxCount;

  }

  update ( dt, t, map ) {

    const { item } = this;

    if ( ! item ) {

      return;

    }

    this.count++;
    this.frame.x = this.count;

    map.removeItem(  item );
    this.item = null;

  }

}

export default Box;
