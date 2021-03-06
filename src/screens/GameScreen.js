import pop from "pop";
import env from "../env";
import Dirs from "../Dirs";
import Player from "../entities/Player"; // probably should be in earth
import Earth from "../Earth";
import Camera from "../Camera"; // probably should be in earth
import State from "../State";

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

  hudLeft = 40;
  hudBottom = 100;

  constructor ( canvas, worldParams, controls, gameOver ) {

    super();

    this.controls = controls;
    this.gameOver = gameOver;

    this.mouse = new MouseControls( canvas );
    this.mouse_past = [];
    this.mouseState = new State("IDLE");

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

    this.hud = new HUD( this.hudLeft, this.hudBottom );
    this.add( this.hud );

    this.tile = 2;
    this.rot = 1;
    //this.uiTile = new UITile( {x: 0, y: 0}, false );
    //this.uiTile.pos.y = env.h - this.hud.bottom + 30;
    //this.uiTile.pos.x = 45;
    //this.add( this.uiTile );

    this.uiSelected = new Sprite( new  Texture( "./res/images/uiselected.png" ) );
    this.uiSelected.pos.x = 32;
    this.uiSelected.pos.y = 32;
    this.add( this.uiSelected );

    this.selected = new Sprite( new Texture( "./res/images/hud_selected.png" ) );
    this.selected.pos.y = env.h - 60;
    this.selected.pos.x = 30;
    this.add( this.selected );

    this.setTileUI();

    this.hover = new Sprite( new  Texture( "./res/images/hover.png" ) );
    this.hover.pos.x = 32;
    this.hover.pos.y = 32;
    this.add( this.hover );

    this.cursor = new Sprite( new  Texture( "./res/images/cursor2.png" ) );
    this.cursor.pos.x = 32;
    this.cursor.pos.y = 32;
    this.add( this.cursor );


  }

  setTileUI () {

    //const clz = env.tiles[ Object.keys( env.tiles )[ this.tile ] ];
    //this.uiTile.frame.x = clz.rotates ? this.rot : clz.icon.x;
    //this.uiTile.frame.y = clz.icon.y;
    this.uiSelected.pos.y = env.h - this.hud.bottom + 2;
    this.uiSelected.pos.x = (this.tile + 1) * 40 + 5;

  }

  update ( dt, t ) {

    super.update( dt, t );

    const { earth, mouse, camera } = this;

    /*const wheelDt = this.mouse.wheelDt;
    if ( wheelDt !== 0 ) {

      this.camera.scale.x += 0.1 * wheelDt;
      this.camera.scale.y += 0.1 * wheelDt;
      this.mouse.wheelDt = 0;

    }*/

    this.cursor.pos.x = mouse.x - 16;
    this.cursor.pos.y = mouse.y - 16;

    if ( mouse.x > 0 && mouse.y < env.h - 100 ) {

      this.hover.pos.x = ( mouse.x / 32 | 0 ) * 32;
      this.hover.pos.y = ( mouse.y / 32 | 0 ) * 32;

    } else {

      this.hover.pos.x = this.hover.pos.y = -32;

    }

    // Clickin' and touchin'
    if ( mouse.left || mouse.right ) {

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
          return;

        }

      }

      let dir = this.lastDir ||  Dirs.indexToDir( this.rot );

      if ( mouse.left ) {

        // TODO: Move drag direction detection to MouseControls
        const samples = this.mouse_past.slice( -4 ).reverse();
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

      }

      // TODO: lock drag to dir
      console.log(dir, y / 32 | 0);

      earth.setTile({
        type: mouse.left ? env.tiles[ Object.keys( env.tiles )[ this.tile ] ].type : "Blank",
        dir},
        { x, y }
      );

    } else {

      if ( this.mouse_past.length ) {

        this.mouse_past = [];

      }

      this.lastDir = Dirs.NONE;

    }

    // Check for inventory keys
    Object.keys( env.tiles ).forEach( ( t, i ) => {

      if ( this.controls.key( 49 + i ) ) {

        this.tile = i;
        this.setTileUI();
        this.selected.pos.x = 30;

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
