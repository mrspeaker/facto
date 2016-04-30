import pop from "pop";
import Tile from "./Tile";

const {
  Texture
} = pop;

const mapTiles = new Texture( "res/images/destroyer.png" );

class Destroyer extends Tile {

  type = "Destroyer";
  rotates = false;
  static type = "Destroyer";
  static rotates = false;
  static icon = { x: 0, y: 6 };


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
