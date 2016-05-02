import pop from "pop";
import Tile from "./Tile";
import Dirs from "../Dirs";
import env from "../env";
import State from "../State";

const {
  Texture
} = pop;

const mapTiles = new Texture( "res/images/shooter.png" );

class Shooter extends Tile {

  static type = "Shooter";
  static rotates = true;
  static icon = { x: 0, y: 4 };

  state = new State( "IDLE" );
  speed = 0.3;

  constructor ( dir ) {

    super( mapTiles, env.tileW, env.tileH );

    this.dir = dir;
    this.frame.y = Dirs.toIndex( dir );
    this.frame.x = 0;

  }

  accepts () {

    return this.state.is( "IDLE" ) && ! this.item;

  }

  update ( dt, t, map ) {

    const { item, speed, dir, pos } = this;

    this.state.tick( dt, t );

    if ( this.state.is( "IDLE" ) ) {


      if ( ! item ) {

        return;

      }

      //map.removeItem(  item );
      this.frame.x++;
      //this.item = null;

      this.state.to( "SHOOTING" );

    }

    else if ( this.state.is( "SHOOTING" ) ) {

      if ( this.state.time < 300 ) {

        const xo = speed * dt * Dirs.dtHoriz( dir );
        const yo = speed * dt * Dirs.dtVert( dir );

        if ( xo !== 0 ) {

          item.pos.x += xo;
          item.pos.y -= Math.cos( this.state.time / 65 ) * 5;

        }

        else {

          item.pos.x -= Math.sin( this.state.time / 60 ) * 5;
          item.pos.y += yo;

        }

        return;

      }
      this.frame.x++;
      //this.item = new Bronze();
      //map.addItem( this.item, map.worldToTilePosition( pos ), true );
      this.state.to( "SHOT" );

    }

    else if ( this.state.is( "SHOT" ) ) {

      if ( this.state.time < 2 ) {

        return;

      }

      const { x, y, } = map.worldToTilePosition( pos );
      let next = map.getTileInDir( x, y, dir );
      let nextTile = map.worldToTilePosition( next.pos );
      next = map.getTileInDir( nextTile.x, nextTile.y, dir );

      if ( next.acceptItem( item, this ) ) {

        this.item = null;
        next.itemToCentre();
        this.frame.x = 0;
        this.state.to( "IDLE" );

      } else {

        next.itemToCentre();

      }

    }

  }

}

module.exports = Shooter;
