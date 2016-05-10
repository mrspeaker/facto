import pop from "pop";
import env from "../env";
import Dirs from "../Dirs";

const {
  TileSprite,
} = pop;

class Tile extends TileSprite {

  item = null;
  item_x = 0;
  item_y = 0;

  takeableItem = null;

  constructor ( texture, w, h ) {

    super( texture, w, h );

  }

  accepts ( item ) {

    return item && ! this.item;

  }

  acceptItem ( item, fromTile, map ) {

    const { x, y, pos } = this;
    const { tileW, tileH } = env;

    const accepts = this.accepts( item, map );

    if ( accepts ) {

      this.item = item;
      this.fromTile = fromTile;

      let xo = tileW / 2 | 0;
      let yo = tileH / 2 | 0;
      if ( fromTile ) {

        const xx = pos.x - fromTile.pos.x;
        const yy = pos.y - fromTile.pos.y;

        const dir = Dirs.opposite(
          xx < 0 ? Dirs.LEFT : xx > 0 ? Dirs.RIGHT : yy < 0 ? Dirs.UP : Dirs.DOWN
        );

        if ( dir === Dirs.LEFT ) { xo = 0; }
        if ( dir === Dirs.RIGHT ) { xo = tileW; }
        if ( dir === Dirs.UP ) { yo = 0; }
        if ( dir === Dirs.DOWN ) { yo = tileH; }

        if ( Dirs.isVert( this.dir ) && Dirs.isHoriz( dir ) ) {

          xo = tileW / 2 | 0;

        }
        if ( Dirs.isHoriz( this.dir ) && Dirs.isVert( dir ) ) {

          yo = tileH / 2 | 0;

        }

      }

      this.item_x = xo;
      this.item_y = yo;

      item.pos.x = x * tileW + this.item_x - item.w / 2;
      item.pos.y = y * tileH + this.item_y - item.h / 2;

    }

    return accepts;

  }

  itemToCentre () {

    const { item, pos } = this;

    if ( ! item ) {

      return;

    }

    item.pos.x = pos.x + item.w / 2;
    item.pos.y = pos.y + item.h / 2;

  }

  reliquishItem () {

    return null;

  }

}

module.exports = Tile;
