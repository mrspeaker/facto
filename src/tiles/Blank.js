import pop from "pop";
import Tile from "./Tile";

const {
  Texture
} = pop;


const mapTiles = new Texture( "res/images/blank.png" );

class Blank extends Tile {

  static type = "Blank";
  static rotates = false;

  static icon = { x: 0, y: 0 };

  constructor () {

    super( mapTiles, 32, 32 );

    this.frame.x = 0;
    this.frame.y = 0;

  }

}

module.exports = Blank;
