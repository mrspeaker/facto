import pop from "pop";
import Tile from "./Tile";
import Dirs from "../Dirs";

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
    this.stateTime = 0;

  }

  update ( dt, t, map ) {

    if (! this.item ) return;

    if ( ( this.stateTime += dt ) < 3000 ) {

      return;

    }
    this.stateTime = 0;

    map.setTile({
      type: "Passer",
      dir: this.fromTile ? this.fromTile.dir : Dirs.RIGHT
    },
    { x:this.x * this.tileW, y:this.y * this.tileW});

  }

}

module.exports = Blank;
