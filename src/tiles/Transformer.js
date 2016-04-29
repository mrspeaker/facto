import pop from "pop";
import Tile from "./Tile";
import Bronze from "../items/Bronze";
import Dirs from "../Dirs";

const {
  Texture
} = pop;

const mapTiles = new Texture( "res/images/transformer.png" );

class Transformer extends Tile {

  type = "Transformer";

  constructor ( dir ) {

    super( mapTiles, 32, 32 );

    this.dir = dir;
    this.frame.y = Dirs.toIndex( this.dir );

    this.state = "CONSUMING";
    this.stateTime = 0;

    this.requiredCount = 3;
    this.count = 0;

  }

  accepts () {

    return this.state === "CONSUMING" && ! this.item;

  }

  update ( dt, t, map ) {

    const { dir, pos } = this;
    let { item } = this;

    if ( this.state === "CONSUMING" ) {

      if ( ! item ) {

        return;

      }

      map.removeItem(  item );
      this.item = null;

      this.frame.y = Dirs.toIndex( this.dir );
      this.frame.x++;

      if ( ++this.count === this.requiredCount ) {

        this.state = "PRODUCING";
        this.stateTime = 0;
        this.count = 0;

      }

    }

    else if ( this.state === "PRODUCING" ) {

      if ( this.stateTime++ < 100 ) {
        return;
      }
      if ( ! item ) {

        item = this.item = new Bronze();
        const { x, y, } = map.worldToTilePosition( pos );
        const next = map.getTileInDir( x, y, dir );
        //if ( next.accepts( item ) ) {
        
          map.addItem( item, map.worldToTilePosition( pos ), true );



      }

      this.state === "LOADED";
      this.stateTime = 0;


      /*const { x, y, } = map.worldToTilePosition( pos );
      const next = map.getTileInDir( x, y, dir );
      if ( next.accepts( item ) ) {

        map.addItem( item, map.worldToTilePosition( next.pos ) );
        this.item = null;
        this.state = "CONSUMING";
        this.stateTime = 0;
        this.frame.x = 0;

      }*/

    }

    else if ( this.state === "LOADED" ) {


    }

  }

  reliquishItem () {

    const { item } = this;

    if ( ! item ) {

      return null;

    }

    this.state = "CONSUMING";
    this.stateTime = 0;
    this.frame.x = 0;
    this.item = null;

    return item;

  }

}

module.exports = Transformer;
