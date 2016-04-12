import GroundChunk from "./chunks/GroundChunk";
import MachineChunk from "./chunks/MachineChunk";
import pop from "pop";

const {
  Container
} = pop;

class Earth extends Container {

  constructor ( hChunks, vChunks ) {

    super();

    this.ground = [];
    this.machines = [];

    Array.from(

      new Array( hChunks * vChunks ),

      ( _, i ) => this.addChunk( i % hChunks, i / hChunks | 0 )

    );

  }

  addChunk ( x, y ) {

    const ground = new GroundChunk( x, y );
    this.ground.push( ground );
    this.add( ground );

    const machines = new MachineChunk( x, y );
    this.machines.push( machines );
    this.add( machines );

  }

  setTile ( tile, pos ) {

    this.machines[ 0 ].setTile( tile, pos );

  }

}

export default Earth;
