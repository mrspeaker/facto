import pop from "pop";
import env from "../env";

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

  acceptItem ( item, fromTile ) {

    const { x, y } = this;
    const { tileW, tileH } = env;
    const accepts = this.accepts( item );

    if ( accepts ) {

      this.item = item;
      this.fromTile = fromTile;

      this.item_x = tileW / 2 | 0;
      this.item_y = tileH / 2 | 0;

      item.pos.x = x * tileW + this.item_x - 8;
      item.pos.y = y * tileH + this.item_y - 8;

    }

    return accepts;

  }

}

module.exports = Tile;
