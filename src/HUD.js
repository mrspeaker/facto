import pop from "pop";
import env from "./env";

const {
  Texture,
  Sprite
} = pop;

const hud = new Texture("res/images/hud.png");

class HUD extends Sprite {

  constructor () {

    super(hud);

  }

  checkButtons ( x, y ) {

    const h = 100;
    const yo = h - (env.h - y);

    // UI buttons
    if ( yo < 0 ) {

      return "";

    }

    if ( x < 117 ) {

      return "SWITCH";

    }

    // Left side (rotate)
    if ( x < 215 ) {

      return "ROTATE";

    }

    if ( x <= 312 ) {

      return "MOVE";

    }

    // Right side
    if ( x < 360 ) {

      return yo <= 50 ? "UP" : "DOWN";

    }

    const button = (x - 360) / 40 | 0;
    if ( button <= 5 ) {
      return "BUTTON_" + button;
    }

    return "";


  }

}

module.exports = HUD;
