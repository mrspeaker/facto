import pop from "pop";
import Tile from "./Tile";
import Iron from "../items/Iron";

const {
  Texture
} = pop;

const mapTiles = new Texture( "res/images/tree.png" );

class Tree extends Tile {

  static type = "Tree";
  static rotates = false;
  static icon = { x: 0, y: 10 };

  speed = 0.03;

  constructor ( dir ) {

    super( mapTiles, 32, 32 );

    this.dir = dir;
    this.frame.y = 0;//Dirs.toIndex( dir );
    this.frame.x = 0;

    this.state = "IDLE";
    this.stateTime = 0;

  }

  accepts () {

    return false;

  }

  update ( dt, t, map ) {

    const { pos } = this;

    const growTime = 12000;
    const growFrames = 6 - 1;

    if ( this.state === "IDLE" ) {

      this.stateTime += dt;
      if ( this.stateTime < growTime ) {

        this.frame.y = 0;
        this.frame.x = this.stateTime / (growTime / growFrames) | 0;

        return;

      }

      this.state = "BIRTHING";
      this.stateTime = 0;

    }

    else if ( this.state === "BIRTHING" ) {

      this.stateTime += dt;

      this.frame.y = 0;
      this.frame.x = growFrames; //this.stateTime / 1000 % 4 | 0;
      if ( this.stateTime < 4000 ) {

        return;

      }

      const item = this.item = new Iron();
      map.addItem( item, map.worldToTilePosition( pos ), true );
      this.itemToCentre();


      this.state = "COOKED";
      this.stateTime = 0;

    }

    else if ( this.state === "COOKED" ) {

      this.stateTime += dt;

      if ( this.stateTime < 500 ) {

        return;

      }

      this.state = "LOADED";
      this.stateTime = 0;

    }

    else if ( this.state === "LOADED" ) {

      this.stateTime += dt;
      this.frame.x = growFrames; //( this.stateTime / 300 % 2 | 0) + 3;


    }

  }

  reliquishItem () {

    const { state, item } = this;

    if ( state !== "LOADED" || ! item ) {

      return null;

    }

    this.state = "BIRTHING";
    this.stateTime = 0;
    this.item = null;

    return item;

  }

}

module.exports = Tree;
