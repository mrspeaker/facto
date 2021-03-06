import pop from "pop";
const { TileSprite, Texture } = pop;

const items = new Texture("res/images/items.png");


class Iron extends TileSprite {

  type = "Iron";

  constructor () {

    super( items, 16, 16 );

    this.frame.y = 0;
    this.relPos = { x: 0, y: 0 };

  }

}

export default Iron;
