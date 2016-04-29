import pop from "pop";
const { TileSprite, Texture } = pop;

const items = new Texture("res/images/items.png");


class Bronze extends TileSprite {

  type = "Bronze";

  constructor () {

    super( items, 16, 16 );

    this.frame.y = 1;
    this.relPos = { x: 0, y: 0 };

  }

}

export default Bronze;
