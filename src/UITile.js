import pop from "pop";
const tiles = new pop.Texture( "res/images/tiles.png" );

const {
  TileSprite
} = pop;

class UITile extends TileSprite {

  constructor ( icon, rotates ) {

    super( tiles, 32, 32 );
    this.frame = { x: icon.x, y: icon.y };
    this.rotates = rotates;

  }

}

export default UITile;
