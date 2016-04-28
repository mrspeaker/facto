import pop from "pop";
import env from "../env";
import Dirs from "../Dirs";
import Player from "../entities/Player"; // probably should be in earth
import Earth from "../Earth";
import Camera from "../Camera"; // probably should be in earth

import UITile from "../UITile";
import HUD from "../HUD";

import MouseControls from "../controls/MouseControls";

const {
  Container,
  Sprite,
  Texture
} = pop;

const {
  chunksX,
  chunksY
} = env;

class GameScreen extends Container {

  constructor ( canvas, worldParams, controls, gameOver ) {

    super();

    this.controls = controls;
    this.gameOver = gameOver;

    this.mouse = new MouseControls( canvas );
    this.mouse_past = [];

    var player = new Player( controls, function ( pos, delta ) {
      return {
        x: pos.x + delta.x,
        y: pos.y + delta.y,
        ground: false,
        head: false
      };
    });
    player.pos = { x: 320, y: 120 };


    var camera = new Camera({
      focusObject: player,
      viewport: { w: canvas.width, h: canvas.height },
      //worldSize: { w: map.map.w * map.map.tileW, h: map.map.h * map.map.tileH },
      worldSize: { w: canvas.width * 2, h: canvas.height * 2 },
      moveSpeed: 0.008
    });

    this.add( camera) ;

    this.earth = new Earth( chunksX, chunksY );

    camera.add( this.earth );
    camera.add( player );

    this.camera = camera;
    this.player = player;

    this.hud = new HUD();
    this.hud.pos.x = 0;
    this.hud.pos.y = env.h - 100;

    this.add( this.hud );

    this.uiTile = new UITile();
    this.uiTile.pos.x = 45;
    this.uiTile.pos.y = env.h - 48;
    this.tile = 1;
    this.rot = 1;
    this.add( this.uiTile );
    this.setTileUI();

    this.selected = new Sprite(new Texture("./res/images/hud_selected.png"));
    this.selected.pos.y = env.h - 60;
    this.selected.pos.x = 30;
    this.add( this.selected );

    this.quiver = Array(6).fill().map(() => new UITile());
    this.quiver.forEach((t, i) => {
      this.add(t);
      t.pos.x = i * 40 + 10;//370;
      t.pos.y = env.h - 98;
      t.frame.y = i;
    });

    this.hover = new Sprite( new  Texture( "./res/images/hover.png" ) );
    this.hover.pos.x = 32;
    this.hover.pos.y = 32;
    this.add( this.hover );

  }

  setTileUI () {

    this.uiTile.frame.x = this.rot;
    this.uiTile.frame.y = this.tile ;

  }

  update ( dt, t ) {

    super.update( dt, t );

    const { earth, mouse, camera } = this;

    const wheelDt = this.mouse.wheelDt;
    if ( wheelDt !== 0 ) {

      this.camera.scale.x += 0.1 * wheelDt;
      this.camera.scale.y += 0.1 * wheelDt;
      this.mouse.wheelDt = 0;

    }

    if ( mouse.x > 0 && mouse.y < env.h - 100 ) {

      this.hover.pos.x = ( mouse.x / 32 | 0 ) * 32;
      this.hover.pos.y = ( mouse.y / 32 | 0 ) * 32;

    } else {

      this.hover.pos.x = this.hover.pos.y = -32;

    }

    const my = mouse.y;

    // Clickin' and touchin'
    if ( mouse.left ) {

      // Get current click position
      const x = ( mouse.x - camera.pos.x ) / camera.scale.x;
      const y = ( mouse.y - camera.pos.y ) / camera.scale.y;

      // Handle HUD buttons
      const pressed = this.hud.checkButtons( mouse.x, mouse.y );
      if ( pressed ) {

        if ( pressed.indexOf( "BUTTON" ) > -1 ) {

          this.tile = parseInt( pressed.slice( -1 ), 10 );
          this.rot = 1;
          this.selected.pos.x = 30;
          this.setTileUI();
          mouse.left = false;
          this.doMove = false;
          return;

        }

        switch ( pressed ) {

        case "ROTATE":
          this.rot = ( this.rot % 4 ) + 1;
          this.setTileUI();
          mouse.left = false;
          break;

        case "SWITCH":
          if ( this.doMove ) {

            this.doMove = false;

          }
          else {

            this.tile = ( this.tile + 1 ) % 4;
            this.rot = 1;

          }
          this.selected.pos.x = 30;
          this.setTileUI();
          mouse.left = false;
          break;

        case "MOVE":
          this.doMove = true;
          this.selected.pos.x = 230;
          return;

        case "UP":
          this.camera.scale.x += 0.01;
          this.camera.scale.y += 0.01;
          break;

        case "DOWN":
          this.camera.scale.x -= 0.01;
          this.camera.scale.y -= 0.01;
          break;

        }

        return;

      }


      // TODO: Move drag direction detection to mouse controls
      const samples = this.mouse_past.slice( -4 ).reverse();
      let dir = this.lastDir ||  Dirs.indexToDir( this.rot );
      let dx = 0;
      let dy = 0;

      if ( samples.length ) {

        const maybeDir = samples.reduce( ( acc, el ) => {

          acc.dx += acc.sx - el[ 0 ];
          acc.dy += acc.sy - el[ 1 ];

          return acc;

        }, { sx: mouse.x, sy: mouse.y, dx: 0, dy: 0 });

        dx = maybeDir.dx / samples.length;
        dy = maybeDir.dy / samples.length;
        const adx = Math.abs( dx );
        const ady = Math.abs( dy );

        if ( adx > 1 || ady > 1 ) {

          if ( adx > ady ) {

            dir = dx > 0 ? Dirs.RIGHT : Dirs.LEFT;

          }
          else {

            dir = dy > 0 ? Dirs.DOWN : Dirs.UP;

          }

          this.lastDir = dir;

        }

      }

      this.mouse_past.push( [ mouse.x, mouse.y ] );

      if ( this.doMove ) {

        // Pan.
        this.player.velocity.x += 0.03 * Dirs.dtHoriz( dir );
        this.player.velocity.y += 0.03 * Dirs.dtVert( dir );

      }
      else {

        earth.setTile(
          {
            type: env.tiles[ this.tile ],
            dir
          },
          { x, y });

      }

    } else {

      if ( this.mouse_past.length ) {

        this.mouse_past = [];

      }

      this.lastDir = Dirs.NONE;

    }

    // Check for inventory keys
    [ 0, 1, 2, 3, 4, 5 ].forEach( i => {

      if ( this.controls.key( 49 + i ) ) {

        this.tile = i;
        this.setTileUI();
        this.selected.pos.x = 30;
        this.doMove = false;

      }

    });

    // Q key: switch tile
    if ( this.controls.key( 81 ) ) {
      this.controls.unset( 81 );
      this.tile = ( this.tile + 1 ) % env.numTileTypes;
      this.rot = this.tile === 0 ? 0 : 1;
      this.setTileUI();

    }

    // R key: rotate tile
    if ( this.controls.key( 82 ) ) {

      this.controls.unset( 82 );
      this.rot = ( this.rot % 4 ) + 1;
      this.setTileUI();

    }

  }

}

module.exports = GameScreen;
