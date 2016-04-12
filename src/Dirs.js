module.exports = {

  NONE: 0,
  UP: 1,
  DOWN: 2,
  LEFT: 4,
  RIGHT: 8,

  isUp: function ( dir ) { return dir === this.UP; },

  isDown: function ( dir ) { return dir === this.DOWN; },

  isLeft: function ( dir ) { return dir === this.LEFT; },

  isRight: function ( dir ) { return dir === this.RIGHT; },

  opposite: function ( dir ) {
    return dir === this.UP ? this.DOWN :
      dir === this.DOWN ? this.UP :
      dir === this.LEFT ? this.RIGHT :
      this.LEFT;
  },

  isHoriz: function ( dir ) { return dir === this.LEFT || dir == this.RIGHT; },

  isVert: function ( dir ) { return dir === this.UP || dir == this.DOWN; },

  dtHoriz: function ( dir ) { return dir === this.LEFT ? -1 : dir === this.RIGHT ? 1 : 0; },

  dtVert: function ( dir ) { return dir === this.UP ? -1 : dir === this.DOWN ? 1 : 0; },

  toIndex: function ( dir ) { return { 0: 0, 1: 1, 2: 2, 4: 3, 8: 4 }[ dir ]; },

  indexToDir: function ( idx ) { return [0, 1, 2, 4, 8][ idx ]; },

  notDir: function ( dir ) {

    const out = [];
    dir !== 1 && out.push( 1 );
    dir !== 2 && out.push( 2 );
    dir !== 4 && out.push( 4 );
    dir !== 8 && out.push( 8 );
    return out;

  }

};
