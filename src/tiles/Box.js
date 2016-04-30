import pop from "pop";
import Tile from "./Tile";
import env from "../env";

const {
  Texture
} = pop;

const mapTiles = new Texture( "res/images/box.png" );

class Box extends Tile {

  static type = "Box";
  static rotates = false;
  static icon = { x: 0, y: 7 };

  constructor () {

    super( mapTiles, env.tileW, env.tileH );
    this.count = 0;
    this.maxCount = 50;
    this.fillFrames = mapTiles.img.width / env.tileW - 1;

    this.storage = [];

  }

  addCount ( amount ) {

    this.count += amount;
    this.frame.x = this.count / this.maxCount * this.fillFrames | 0;

  }

  accepts () {

    return ! this.item && this.count < this.maxCount;

  }

  reliquishItem ( map ) {

    if ( ! this.storage.length ) {

      return null;

    }

    const item = this.storage[ 0 ];
    this.addCount( -1 );
    this.storage = this.storage.slice( 1 );
    map.addItem( item, map.worldToTilePosition( this.pos ), true );

    return item;

  }

  update ( dt, t, map ) {

    const { item } = this;

    if ( ! item ) {

      return;

    }

    this.addCount( 1 );

    map.removeItem(  item );
    this.storage.push( item );
    this.item = null;

  }

}

export default Box;
