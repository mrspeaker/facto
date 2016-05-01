class State {

  state = "";
  time = 0;
  lastState = "";

  first = false;

  constructor ( state ) {

    this.to( state );

  }

  get () {

    return this.state;

  }

  to ( state ) {

    this.lastState = state;
    this.state = state;
    this.time = 0;

  }

  is ( state ) {

    return state === this.state;

  }

  tick ( dt, t ) {

    this.time += dt;

    // check if t is same to calc "first"
    // depends if tick is called at the start or the end.

  }

}

export default State;
