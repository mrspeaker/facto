import pop from "pop";
import env from "./env";
import UITile from "./UITile";

const {
  Texture,
  Container,
  Sprite
} = pop;

const hud = new Texture("res/images/hud.png");

class HUD extends Container {

  constructor ( left, bottom ) {

    super(hud);
    this.left = left;
    this.bottom = bottom;

    this.pos.x = left;
    this.pos.y = env.h - bottom;

    this.add( new Sprite( hud ));

    this.quiver = Object.keys( env.tiles ).map( ( tile, i ) => {

      const clz = env.tiles[ tile ];
      const t = new UITile( clz.icon, clz.rotates );
      this.add( t );
      t.pos.x = i * 40 + 10;
      t.pos.y = 5;

    });

  }

  checkButtons ( x, y ) {

    const yo = this.bottom - (env.h - y);

    // UI buttons
    if ( yo < 0 || yo > 40 ) {

      return "";

    }

    const button = ( x - this.left - 10 ) / 40 | 0;
    if ( button < Object.keys( env.tiles ).length ) {
      return "BUTTON_" + button;
    }

    return "";

  }

}

module.exports = HUD;
