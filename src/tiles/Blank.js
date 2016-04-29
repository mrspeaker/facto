import pop from "pop";
import Tile from "./Tile";

const {
  Texture
} = pop;


const mapTiles = new Texture( "res/images/blank.png" );

class Blank extends Tile {

  type = "Blank";

  constructor () {

    super( mapTiles, 32, 32 );

    this.frame.x = 0;
    this.frame.y = 0;

    this.wall = false;
    this.items = [];

  }

}

module.exports = Blank;
