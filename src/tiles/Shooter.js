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
  static icon = { x: 0, y: 8 };

  state = new State( "IDLE" );
  speed = 0.096;

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

    const { item, speed, dir, pos, state } = this;

    state.tick( dt, t );

    if ( state.is( "IDLE" ) ) {


      if ( ! item ) {

        return;

      }
      this.frame.x++;
      state.to( "SHOOTING" );

    }

    else if ( state.is( "SHOOTING" ) ) {

      const shotLength = 700;

      if ( state.time < shotLength ) {

        const xo = speed * dt * Dirs.dtHoriz( dir );
        const yo = speed * dt * Dirs.dtVert( dir );

        const perc = (shotLength / 2 - state.time) / shotLength;

        if ( xo !== 0 ) {

          item.pos.x += xo;
          item.pos.y -= perc * 8;

        }

        else {

          item.pos.x -= perc * 8;
          item.pos.y += yo;

        }

        return;

      }
      this.frame.x++;
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

      if ( next.acceptItem( item, this, map ) ) {

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
