class MouseControls {

  left = false;
  right = false;
  x = -1;
  y = -1;
  wheelDt = 0;

  down ( e ) {
    var x, y;
    if (e.touches) {
      x = e.touches[0].pageX;
      y = e.touches[0].pageY;
    } else {
      var rect = this.el.getBoundingClientRect();
      x = e.clientX - rect.left | 0;
      y = e.clientY - rect.top | 0;
    }

    this.left = true;
    this.x = x;
    this.y = y;
  }

  up () {

    this.left = false;
    this.x = -1;
    this.y = -1;
  }

  move ( e ) {
    var x, y;
    if (e.touches) {
      x = e.touches[0].pageX;
      y = e.touches[0].pageY;
    } else {
      var rect = this.el.getBoundingClientRect();
      x = e.clientX - rect.left | 0;
      y = e.clientY - rect.top | 0;
    }
    this.x = x;
    this.y = y;
  }

  wheel ( e ) {
    e = window.event || e;
    this.wheelDt = Math.max( -1, Math.min( 1, ( e.wheelDelta || -e.detail ) ) );
    return false;
  }

  constructor ( container ) {

    this.el = container;

    // Bind event handlers
    document.addEventListener( "mousedown", e => this.down( e ), false );
    document.addEventListener( "touchstart", e => this.down( e ), false );
    document.addEventListener( "mousemove", e => this.move( e ), false );
    document.addEventListener( "touchmove", e => this.move( e ), false );
    document.addEventListener( "mouseup", e => this.up( e ), false );
    document.addEventListener( "touchend", e => this.up( e ), false );
    document.addEventListener( "mousewheel", e => this.wheel( e ), false);
    document.addEventListener( "DOMMouseScroll", e => this.wheel( e ), false);

  }
}

module.exports = MouseControls;
