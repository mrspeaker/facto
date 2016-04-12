import pop from "pop";
import Tile from "./Tile";
import Dirs from "../Dirs";

const {
  Texture
} = pop;

const mapTiles = new Texture( "res/images/passer.png" );

class TakerGiver extends Tile {

  constructor ( dir ) {

    super( mapTiles, 32, 32 );

    this.type = "TakerGiver";
    this.dir = dir;

    this.frame.y = Dirs.toIndex( dir );
    this.frame.x = 0;

    this.wall = true;
    this.items = [];
    this.state = "IDLE";
    this.stateTime = 0;

  }

  update () {

  }

}

module.exports = TakerGiver;
