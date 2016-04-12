(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _pop = require("pop");

var _pop2 = _interopRequireDefault(_pop);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Container = _pop2.default.Container;

// Just like a pop.TileMap - but pass a function to create the renderables

function TileMap(map, tileToRenderable) {
  Container.call(this);
  this.map = map;
  this.children = map.tiles.map(tileToRenderable).map(function (r, i) {
    r.pos = this.tileToWorldPosition(this.tileIndexToPosition(i));
    return r;
  }, this);
}
TileMap.prototype = Object.create(Container.prototype);
TileMap.prototype.constructor = TileMap;

TileMap.prototype.tileAtPosition = function (p) {
  return this.children[p.y * this.map.w + p.x];
};

TileMap.prototype.tileIndexToPosition = function (i) {
  var w = this.map.w;
  return {
    x: i % w,
    y: Math.floor(i / w)
  };
};
TileMap.prototype.positionToTileIndex = function (p) {
  return this.map.w * p.y + p.x;
};
TileMap.prototype.worldToTilePosition = function (p) {
  return {
    x: Math.floor(p.x / this.map.tileW),
    y: Math.floor(p.y / this.map.tileH)
  };
};
TileMap.prototype.tileToWorldPosition = function (p) {
  return {
    x: p.x * this.map.tileW,
    y: p.y * this.map.tileH
  };
};

TileMap.prototype.tilesAtCorners = function (bounds, xo, yo) {
  return [[bounds.x, bounds.y], // Top Left point
  [bounds.x + bounds.w, bounds.y], // Top Right point
  [bounds.x, bounds.y + bounds.h], // Bottom Left point
  [bounds.x + bounds.w, bounds.y + bounds.h]]. // Bottom Right point
  map(function (point) {
    return this.tileAtPosition(this.worldToTilePosition({
      x: point[0] + xo,
      y: point[1] + yo
    }));
  }, this);
};

module.exports = TileMap;

},{"pop":2}],2:[function(require,module,exports){
var CanvasRenderer = require('./src/CanvasRenderer.js');
var Container = require('./src/Container.js');
var Controls = require('./src/Controls.js');
var mathutils = require('./src/mathutils.js');
var Sound = require('./src/Sound.js');
var SoundGroup = require('./src/SoundGroup.js');
var SoundPool = require('./src/SoundPool.js');
var Sprite = require('./src/Sprite.js');
var State = require('./src/State.js');
var Text = require('./src/Text.js');
var Texture = require('./src/Texture.js');
var TileMap = require('./src/TileMap.js');
var TileSprite = require('./src/TileSprite.js');
var utils = require('./src/utils.js');
var wallSlide = require('./src/wallSlide.js');

module.exports = {
  CanvasRenderer: CanvasRenderer,
  Container: Container,
  Controls: Controls,
  mathutils: mathutils,
  Sound: Sound,
  SoundPool: SoundPool,
  SoundGroup: SoundGroup,
  Sprite: Sprite,
  State: State,
  Text: Text,
  Texture: Texture,
  TileMap: TileMap,
  TileSprite: TileSprite,
  utils: utils,
  wallSlide: wallSlide
};

},{"./src/CanvasRenderer.js":3,"./src/Container.js":4,"./src/Controls.js":5,"./src/Sound.js":6,"./src/SoundGroup.js":7,"./src/SoundPool.js":8,"./src/Sprite.js":9,"./src/State.js":10,"./src/Text.js":11,"./src/Texture.js":12,"./src/TileMap.js":13,"./src/TileSprite.js":14,"./src/mathutils.js":15,"./src/utils.js":16,"./src/wallSlide.js":17}],3:[function(require,module,exports){
var TileSprite = require("./TileSprite");

function CanvasRenderer (w, h, canvas) {
  canvas = canvas || document.createElement('canvas');
  this.w = canvas.width = w;
  this.h = canvas.height = h;
  this.view = canvas;
  this.ctx = canvas.getContext('2d');
  this.ctx.imageSmoothingEnabled = false;
  this.ctx.mozImageSmoothingEnabled = false;
}
CanvasRenderer.prototype = {
  render: function (container) {
    // Render the container
    var ctx = this.ctx;

    function render (container) {
      // Render the container children
      var pos = container.pos;

      container.children.forEach(function (child) {
        ctx.save();
        if (child.pos) ctx.translate(child.pos.x | 0, child.pos.y | 0);
        if (child.scale) ctx.scale(child.scale.x, child.scale.y);

        var pivotX = child.pivot && child.pivot.x || 0;
        var pivotY = child.pivot && child.pivot.y || 0;

        // Handle the child types
        if (child.children) {
          render(child);
        }
        else if (child.text) {
          ctx.font = child.style.font;
          ctx.fillStyle = child.style.fill;
          ctx.fillText(child.text, -pivotX, -pivotY);
        }
        else if (child.texture) {
          var img = child.texture.img;
          if (child instanceof TileSprite) {
            ctx.drawImage(
              img,
              child.frame.x * child.tileW,
              child.frame.y * child.tileH,
              child.tileW, child.tileH,
              -pivotX, -pivotY,
              child.tileW, child.tileH);
          }
          else {
            ctx.drawImage(img, -pivotX, -pivotY);
          }
        }

        ctx.restore();
      });
    }

    ctx.clearRect(0, 0, this.w, this.h);
    render(container);
  }
};

module.exports = CanvasRenderer;

},{"./TileSprite":14}],4:[function(require,module,exports){
function Container () {
  this.pos = {x: 0, y: 0};
  this.children = [];
}

Container.prototype = {

  add: function (child) {
    this.children.push(child);
  },

  remove: function (child) {
    this.children = this.children.filter(function (c) {
      return c !== child;
    });
  },

  update: function (dt, t) {
    this.children.forEach(function (child) {
      if (child.update) {
        child.update(dt, t, this);
      }
    }, this);
  }

};

module.exports = Container;

},{}],5:[function(require,module,exports){
function Controls () {

  var _keys = {};
  this._keys = _keys;

  // Bind event handlers
  document.addEventListener('keydown', function (e) {
    if ([37,38,39,40].indexOf(e.which) >= 0) {
      e.preventDefault();
    }
    _keys[e.which] = true;
  }, false);

  document.addEventListener('keyup', function (e) {
    _keys[e.which] = false;
  }, false);

}

Controls.prototype = {

  // Handle key actions
  action: function () {
    return this._keys[32];
  },

  reset: function () {
    this._keys[32] = false;
    for (key in this._keys) {
      this._keys[key] = false;
    }
  },

  x: function () {
    if (this._keys[37] || this._keys[65]) {
      return -1;
    }
    if (this._keys[39] || this._keys[68]) {
      return 1;
    }
    return 0;
  },

  y: function () {
    if (this._keys[38] || this._keys[87]) {
      return -1;
    }
    if (this._keys[40] || this._keys[83]) {
      return 1;
    }
    return 0;
  },

  key: function (keyCode) {
    return this._keys[keyCode];
  },

  unset: function (keyCode) {
    this._keys[keyCode] = false;
  }

};

module.exports = Controls;

},{}],6:[function(require,module,exports){

/*
  options can include:
    volume (0 - 1)
    loop (boolean)
*/
function Sound (src, options) {
  this.src = src;

  console.log(src);

  this.options = Object.assign({}, {volume: 1}, options);
  this.playing = false;

  // Configure audio element
  var audio = this.audio = new Audio();
  audio.src = src;
  if (options.loop) {
    audio.loop = true;
  }
  audio.addEventListener('error', function () {
    throw new Error('Error loading audio resource: ' + audio.src);
  }, false);
  audio.addEventListener('ended', function () {
    this.playing = false;
  }.bind(this), false);
}

Sound.prototype = {
  play: function (options) {
    options = Object.assign({}, this.options, options);
    var audio = this.audio;
    audio.volume = options.volume;
    audio.currentTime = 0;
    audio.play();
    this.playing = true;
  },
  stop: function () {
    this.audio.pause();
    this.playing = false;
  },
  get volume () {
    return this.audio.volume;
  },
  set volume (volume) {
    this.options.volume = this.audio.volume = volume;
  }
};

module.exports = Sound;

},{}],7:[function(require,module,exports){
function SoundGroup (sounds) {
  this.sounds = sounds;
}

SoundGroup.prototype = {
  // play one of the audio group (random)
  play: function (opts) {
    var index = Math.floor(Math.random() * this.sounds.length);
    var sound = this.sounds[index];
    sound.play(opts);
  },
  // stop ALL audio instance of the group
  stop: function () {
    this.sounds.forEach(function (sound) {
      sound.stop();
    });
  }
};

module.exports = SoundGroup;

},{}],8:[function(require,module,exports){
var Sound = require("./Sound");

function SoundPool (src, poolSize, soundOptions) {
  this.sounds = [];
  for (var i = 0; i < poolSize; i ++) {
    this.sounds.push(new Sound(src, soundOptions));
  }
  this.playCount = 0;
}
SoundPool.prototype = {
  // play one of audio instance of the pool
  play: function (opts) {
    var index = this.playCount % this.sounds.length;
    this.playCount ++;
    var sound = this.sounds[index];
    sound.play(opts);
  },
  // stop ALL audio instance of the pool
  stop: function () {
    this.sounds.forEach(function (sound) {
      sound.stop();
    });
  }
};

module.exports = SoundPool;

},{"./Sound":6}],9:[function(require,module,exports){
function Sprite (texture) {
  this.texture = texture;
  this.pos = { x: 0, y: 0 };
  this.scale = { x: 1, y: 1 };
  this.pivot = { x: 0, y: 0 };
}

module.exports = Sprite;

},{}],10:[function(require,module,exports){
function State (state) {
  this.state = state;
  this.last = '';
  this.stateTime = Date.now();
  this.isNewState = false;
}

State.prototype.set = function (state) {
  this.last = this.state;
  this.state = state;
  this.stateTime = Date.now();
  this.isNewState = true;
};

State.prototype.get = function () {
  return this.state;
};

State.prototype.is =  function (state) {
  return state === this.state;
};

State.prototype.isIn =  function () {
  var state = this.state;
  var args = Array.prototype.slice.call(arguments);
  return args.some(function (s) {
    return s === state;
  });
};

State.prototype.time =  function () {
  return Date.now() - this.stateTime;
};


module.exports = State;

},{}],11:[function(require,module,exports){
function Text (text, style) {
  this.text = text;
  this.style = style;
}

module.exports = Text;

},{}],12:[function(require,module,exports){
function Texture (url) {
  this.img = new Image();
  this.img.src = url;
}

module.exports = Texture;

},{}],13:[function(require,module,exports){
var Container = require("./Container");
var TileSprite = require("./TileSprite");

function TileMap (map) {
  Container.call(this);
  this.map = map;
  this.children = map.tiles.map(function (frame, i) {
    var s = new TileSprite(map.texture, map.tileW, map.tileH);
    s.frame = frame;
    s.pos = this.tileToWorldPosition(this.tileIndexToPosition(i));
    return s;
  }, this);
}
TileMap.prototype = Object.create(Container.prototype);
TileMap.prototype.constructor = TileMap;

TileMap.prototype.tileAtPosition = function(p) {
  return this.children[p.y * this.map.w + p.x];
};

TileMap.prototype.tileIndexToPosition = function (i) {
  var w = this.map.w;
  return {
    x: i % w,
    y: Math.floor(i / w)
  };
};
TileMap.prototype.positionToTileIndex = function (p) {
  return this.map.w * p.y + p.x;
};
TileMap.prototype.worldToTilePosition = function (p) {
  return {
    x: Math.floor(p.x / this.map.tileW),
    y: Math.floor(p.y / this.map.tileH)
  };
};
TileMap.prototype.tileToWorldPosition = function (p) {
  return {
    x: p.x * this.map.tileW,
    y: p.y * this.map.tileH
  };
};

TileMap.prototype.tilesAtCorners = function (bounds, xo, yo) {
  return [
    [bounds.x, bounds.y], // Top Left point
    [bounds.x + bounds.w, bounds.y], // Top Right point
    [bounds.x, bounds.y + bounds.h], // Bottom Left point
    [bounds.x + bounds.w, bounds.y + bounds.h], // Bottom Right point
  ].map(function (point) {
    return this.tileAtPosition(
      this.worldToTilePosition({
        x: point[0] + xo,
        y: point[1] + yo
      }));
  }, this);
};

module.exports = TileMap;

},{"./Container":4,"./TileSprite":14}],14:[function(require,module,exports){
var Sprite = require("./Sprite");

function TileSprite (texture, w, h) {
  Sprite.call(this, texture);
  this.tileW = w;
  this.tileH = h;
  this.frame = { x: 0, y: 0 };
}

TileSprite.prototype = Object.create(Sprite.prototype);
// WRITE THIS UP!
Object.defineProperties(TileSprite.prototype, {
  'w': {
    get: function () {
      return this.tileW;
    }
  },
  'h': {
    get: function () {
      return this.tileH;
    }
  }
});

module.exports = TileSprite;

},{"./Sprite":9}],15:[function(require,module,exports){
function lerp (x, inf, sup) {
  return (x-inf) / (sup-inf);
}

function clamp (x, min, max) {
  return Math.max(min, Math.min(x, max));
}

function smoothstep (value, inf, sup) {
  var x = clamp(lerp(value, inf, sup), 0, 1);
  return x*x*(3 - 2*x); // smooth formula
}

function gauss (x) {
  return Math.exp(- x * x);
}

function gaussDistance (x, center, dist) {
  return gauss((x-center)/dist);
}

function mix (a, b, p) {
  return a * (1 - p) + b * p;
}

var rnd = {
  seed: 42,
  rand: function(max, min) {
    max = max || 1;
    min = min || 0;
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return ((this.seed / 233280) * (max - min) + min) | 0;
  }
};


module.exports = {
  lerp: lerp,
  clamp: clamp,
  smoothstep: smoothstep,
  gauss: gauss,
  gaussDistance: gaussDistance,
  mix: mix,
  rnd: rnd
};

},{}],16:[function(require,module,exports){
var utils = {};

utils.getBounds = function (entity) {
  var hit = entity.hitBox || { x: 0, y: 0, w: entity.w, h: entity.h};
  return {
    x: hit.x + entity.pos.x,
    y: hit.y + entity.pos.y,
    w: hit.w,
    h: hit.h
  };
};

utils.checkCollision = function (e1, e2, hitCallback) {
  var a = utils.getBounds(e1);
  var b = utils.getBounds(e2);

  if (
    a.x + a.w >= b.x &&
    a.x <= b.x + b.w &&
    a.y + a.h >= b.y &&
    a.y <= b.y + b.h) {
    hitCallback(e1, e2);
  }
};


utils.checkCollisions = function (entity, container, hitCallback) {
  var a = utils.getBounds(entity);

  container.children.forEach(function (entity2) {
    var b = utils.getBounds(entity2);

    if (
      a.x + a.w >= b.x &&
      a.x <= b.x + b.w &&
      a.y + a.h >= b.y &&
      a.y <= b.y + b.h) {
      hitCallback(entity2);
    }
  });
};

utils.getCenter = function (entity) {
  var bounds = utils.getBounds(entity);
  return {
    x: bounds.x + (bounds.w / 2),
    y: bounds.y + (bounds.h / 2)
  };
};

module.exports = utils;

},{}],17:[function(require,module,exports){
var utils = require("./utils");

function wallSlide (x, y, map) {
  var tiles;
  var walkable;
  var tileEdge;
  var bounds = utils.getBounds(this);

  // Final amounts of movement to allow
  var xo = x;
  var yo = y;

  // Check vertical movement
  if (y !== 0) {
    tiles = map.tilesAtCorners(bounds, 0, yo);
    walkable = tiles.map(function (t) { return !!t.frame.walkable; });

    // Hit your head
    if (y < 0 && !walkable[0] || !walkable[1]) {
      tileEdge = tiles[0].pos.y + tiles[0].h + 1;
      yo = tileEdge - bounds.y;
    }
    // Hit your feet
    if (y > 0 && !walkable[2] || !walkable[3]) {
      tileEdge = tiles[2].pos.y - 1;
      yo = tileEdge - (bounds.y + bounds.h);
    }
  }

  // Check horizontal movement
  if (x !== 0) {
    tiles = map.tilesAtCorners(bounds, xo, yo);
    walkable = tiles.map(function (t) { return !!t.frame.walkable; });

    // Hit left edge
    if (x < 0 && !walkable[0] || !walkable[2]) {
      tileEdge = tiles[0].pos.x + tiles[0].w + 1;
      xo = tileEdge - bounds.x;
    }
    // Hit right edge
    if (x > 0 && !walkable[1] || !walkable[3]) {
      tileEdge = tiles[1].pos.x - 1;
      xo = tileEdge - (bounds.x + bounds.w);
    }
  }

  // xo & yo contain the amount we're allowed to move by.
  return {x: this.pos.x + xo, y: this.pos.y + yo};
}

module.exports = wallSlide;

},{"./utils":16}],18:[function(require,module,exports){
"use strict";

var pop = require("pop");
var Container = pop.Container;
var mathutils = pop.mathutils;

/**
 * props:
   - focusObject: an object with a .pos position to focus on
   - viewport: an array of [ width, height ] of the Canvas
   - mapSize: an array of [ width, height ] of the game map
   - scale (optional): number
   - moveSpeed (optional): number
 */
function Camera(props) {
  var defaults = {
    scale: 1,
    moveSpeed: 1
  };

  Container.call(this);
  // TODO: have to explain this defaults stuff if we use it.
  for (var key in defaults) {
    this[key] = defaults[key];
  }
  for (key in props) {
    this[key] = props[key];
  }
  this.scale = {
    x: this.scale,
    y: this.scale
  };
  this.focusOn(this.focusObject.pos, 1);
}
Camera.prototype = Object.create(Container.prototype);
Camera.prototype.focusOn = function (pos, easingFactor) {
  var x = -mathutils.clamp(pos.x * this.scale.x - this.viewport.w / 2, 0, this.scale.x * this.worldSize.w - this.viewport.w);
  var y = -mathutils.clamp(pos.y * this.scale.y - this.viewport.h / 2, 0, this.scale.y * this.worldSize.h - this.viewport.h);

  this.pos.x = mathutils.mix(this.pos.x, x, easingFactor);
  this.pos.y = mathutils.mix(this.pos.y, y, easingFactor);
};
Camera.prototype.update = function (dt, t) {
  Container.prototype.update.call(this, dt, t);
  this.focusOn(this.focusObject.pos, this.moveSpeed * dt);
};

module.exports = Camera;

},{"pop":2}],19:[function(require,module,exports){
"use strict";

module.exports = {

  NONE: 0,
  UP: 1,
  DOWN: 2,
  LEFT: 4,
  RIGHT: 8,

  isUp: function isUp(dir) {
    return dir === this.UP;
  },

  isDown: function isDown(dir) {
    return dir === this.DOWN;
  },

  isLeft: function isLeft(dir) {
    return dir === this.LEFT;
  },

  isRight: function isRight(dir) {
    return dir === this.RIGHT;
  },

  opposite: function opposite(dir) {
    return dir === this.UP ? this.DOWN : dir === this.DOWN ? this.UP : dir === this.LEFT ? this.RIGHT : this.LEFT;
  },

  isHoriz: function isHoriz(dir) {
    return dir === this.LEFT || dir == this.RIGHT;
  },

  isVert: function isVert(dir) {
    return dir === this.UP || dir == this.DOWN;
  },

  dtHoriz: function dtHoriz(dir) {
    return dir === this.LEFT ? -1 : dir === this.RIGHT ? 1 : 0;
  },

  dtVert: function dtVert(dir) {
    return dir === this.UP ? -1 : dir === this.DOWN ? 1 : 0;
  },

  toIndex: function toIndex(dir) {
    return { 0: 0, 1: 1, 2: 2, 4: 3, 8: 4 }[dir];
  },

  indexToDir: function indexToDir(idx) {
    return [0, 1, 2, 4, 8][idx];
  },

  notDir: function notDir(dir) {

    var out = [];
    dir !== 1 && out.push(1);
    dir !== 2 && out.push(2);
    dir !== 4 && out.push(4);
    dir !== 8 && out.push(8);
    return out;
  }

};

},{}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _GroundChunk = require("./chunks/GroundChunk");

var _GroundChunk2 = _interopRequireDefault(_GroundChunk);

var _MachineChunk = require("./chunks/MachineChunk");

var _MachineChunk2 = _interopRequireDefault(_MachineChunk);

var _pop = require("pop");

var _pop2 = _interopRequireDefault(_pop);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Container = _pop2.default.Container;

var Earth = function (_Container) {
  _inherits(Earth, _Container);

  function Earth(hChunks, vChunks) {
    _classCallCheck(this, Earth);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Earth).call(this));

    _this.ground = [];
    _this.machines = [];

    Array.from(new Array(hChunks * vChunks), function (_, i) {
      return _this.addChunk(i % hChunks, i / hChunks | 0);
    });

    return _this;
  }

  _createClass(Earth, [{
    key: "addChunk",
    value: function addChunk(x, y) {

      var ground = new _GroundChunk2.default(x, y);
      this.ground.push(ground);
      this.add(ground);

      var machines = new _MachineChunk2.default(x, y);
      this.machines.push(machines);
      this.add(machines);
    }
  }, {
    key: "setTile",
    value: function setTile(tile, pos) {

      this.machines[0].setTile(tile, pos);
    }
  }]);

  return Earth;
}(Container);

exports.default = Earth;

},{"./chunks/GroundChunk":23,"./chunks/MachineChunk":24,"pop":2}],21:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _pop = require("pop");

var _pop2 = _interopRequireDefault(_pop);

var _env = require("./env");

var _env2 = _interopRequireDefault(_env);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Texture = _pop2.default.Texture;
var Sprite = _pop2.default.Sprite;


var hud = new Texture("res/images/hud.png");

var HUD = function (_Sprite) {
  _inherits(HUD, _Sprite);

  function HUD() {
    _classCallCheck(this, HUD);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(HUD).call(this, hud));
  }

  _createClass(HUD, [{
    key: "checkButtons",
    value: function checkButtons(x, y) {

      var h = 100;
      var yo = h - (_env2.default.h - y);

      // UI buttons
      if (yo < 0) {

        return "";
      }

      if (x < 117) {

        return "SWITCH";
      }

      // Left side (rotate)
      if (x < 215) {

        return "ROTATE";
      }

      if (x <= 312) {

        return "MOVE";
      }

      // Right side
      if (x > 312) {

        return yo <= 50 ? "UP" : "DOWN";
      }

      return "";
    }
  }]);

  return HUD;
}(Sprite);

module.exports = HUD;

},{"./env":27,"pop":2}],22:[function(require,module,exports){
"use strict";

var pop = require("pop");
var tiles = new pop.Texture("res/images/tiles.png");

function UITile() {
  pop.TileSprite.call(this, tiles, 32, 32);
  this.frame = { x: 0, y: 0 };
}

UITile.prototype = Object.create(pop.TileSprite.prototype);

module.exports = UITile;

},{"pop":2}],23:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pop = require("pop");

var _pop2 = _interopRequireDefault(_pop);

var _env = require("../env");

var _env2 = _interopRequireDefault(_env);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TileMap = _pop2.default.TileMap;
var Texture = _pop2.default.Texture;
var tileW = _env2.default.tileW;
var tileH = _env2.default.tileH;
var chunkSize = _env2.default.chunkSize;


var mapTiles = new Texture("res/images/earth.png");

var GroundChunk = function (_TileMap) {
  _inherits(GroundChunk, _TileMap);

  function GroundChunk(chunkX, chunkY) {
    _classCallCheck(this, GroundChunk);

    var tiles = Array.from(new Array(chunkSize * chunkSize), function () {
      return { x: Math.random() * 4 | 0, y: 0 };
    });

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(GroundChunk).call(this, {
      texture: mapTiles,
      tiles: tiles,
      w: chunkSize,
      h: chunkSize,
      tileW: tileW,
      tileH: tileH
    }));

    _this.pos.x = chunkX * chunkSize * tileW;
    _this.pos.y = chunkY * chunkSize * tileH;

    return _this;
  }

  return GroundChunk;
}(TileMap);

exports.default = GroundChunk;

},{"../env":27,"pop":2}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _TileMap2 = require("../../lib/TileMap");

var _TileMap3 = _interopRequireDefault(_TileMap2);

var _Blank = require("../tiles/Blank");

var _Blank2 = _interopRequireDefault(_Blank);

var _Switcher = require("../tiles/Switcher");

var _Switcher2 = _interopRequireDefault(_Switcher);

var _TakerGiver = require("../tiles/TakerGiver");

var _TakerGiver2 = _interopRequireDefault(_TakerGiver);

var _Dirs = require("../Dirs");

var _Dirs2 = _interopRequireDefault(_Dirs);

var _env = require("../env");

var _env2 = _interopRequireDefault(_env);

var _Iron = require("../items/Iron");

var _Iron2 = _interopRequireDefault(_Iron);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var tileW = _env2.default.tileW;
var tileH = _env2.default.tileH;
var chunkSize = _env2.default.chunkSize;

var MachineChunk = function (_TileMap) {
  _inherits(MachineChunk, _TileMap);

  function MachineChunk(chunkX, chunkY) {
    _classCallCheck(this, MachineChunk);

    var tiles = Array.from(new Array(chunkSize * chunkSize), function (_, i) {

      // Make a rectangle of passing
      var yp = i / chunkSize | 0;
      var xp = i % chunkSize;

      var isTop = yp === 2 && xp > 3 && xp < 11;
      var isBot = yp === 8 && xp > 4 && xp < 12;
      var isLeft = xp === 4 && yp > 2 && yp < 9;
      var isRight = xp === 11 && yp > 1 && yp < 9;

      var tile = isTop ? { type: "Passer", dir: _Dirs2.default.RIGHT } : isBot ? { type: "Passer", dir: _Dirs2.default.LEFT } : isLeft ? { type: "Passer", dir: _Dirs2.default.UP } : isRight ? { type: "Passer", dir: _Dirs2.default.DOWN } : { type: "Blank" };

      return tile;
    });

    // Add some items

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MachineChunk).call(this, {
      tiles: tiles,
      w: chunkSize,
      h: chunkSize,
      tileW: tileW,
      tileH: tileH
    }, function (tileDeets, i) {
      var type = tileDeets.type;
      var dir = tileDeets.dir;

      var tile = void 0;

      if (type === "Passer") {

        tile = new _Switcher2.default(dir);
      } else {

        tile = new _Blank2.default();
      }

      // Set tile X an Y positions
      tile.x = i % chunkSize;
      tile.y = i / chunkSize | 0;

      return tile;
    }));

    setInterval(function () {

      _this.addItem(new _Iron2.default(), { x: 4, y: 2 });
    }, 3000);

    _this.pos.x = chunkX * chunkSize * tileW;
    _this.pos.y = chunkY * chunkSize * tileH;

    return _this;
  }

  _createClass(MachineChunk, [{
    key: "getTileInDir",
    value: function getTileInDir(x, y, dir) {

      x += _Dirs2.default.dtHoriz(dir);
      y += _Dirs2.default.dtVert(dir);

      return this.children[y * this.map.w + x];
    }
  }, {
    key: "addItem",
    value: function addItem(item, pos) {

      var tile = this.tileAtPosition(pos);

      if (!tile || !tile.acceptItem(item)) {

        return;
      }

      this.add(item);

      return item;
    }
  }, {
    key: "setTile",
    value: function setTile(newTileDeets, pos) {
      var type = newTileDeets.type;
      var dir = newTileDeets.dir;


      var tilePos = this.worldToTilePosition(pos);
      var offset = tilePos.y * this.map.w + tilePos.x;

      var oldTileDeets = this.map.tiles[offset];
      var oldTile = this.children[offset];

      if (oldTileDeets.type === type && oldTileDeets.dir === dir) {
        return;
      }

      var newTile = new { Passer: _Switcher2.default, Blank: _Blank2.default }[type](dir);
      newTile.x = oldTile.x;
      newTile.y = oldTile.y;
      newTile.pos.x = oldTile.pos.x;
      newTile.pos.y = oldTile.pos.y;
      newTile.item = oldTile.item; // Copy items
      oldTile.item = null;

      this.map.tiles[offset] = newTileDeets;
      this.children[offset] = newTile;
    }
  }]);

  return MachineChunk;
}(_TileMap3.default);

exports.default = MachineChunk;

},{"../../lib/TileMap":1,"../Dirs":19,"../env":27,"../items/Iron":30,"../tiles/Blank":33,"../tiles/Switcher":34,"../tiles/TakerGiver":35}],25:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MouseControls = function () {
  _createClass(MouseControls, [{
    key: "down",
    value: function down(e) {
      console.log(this, e.touches[0]);

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
  }, {
    key: "up",
    value: function up() {

      this.left = false;
      this.x = -1;
      this.y = -1;
    }
  }, {
    key: "move",
    value: function move(e) {
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
  }, {
    key: "wheel",
    value: function wheel(e) {
      e = window.event || e;
      this.wheelDt = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail));
      return false;
    }
  }]);

  function MouseControls(container) {
    var _this = this;

    _classCallCheck(this, MouseControls);

    this.left = false;
    this.right = false;
    this.x = -1;
    this.y = -1;
    this.wheelDt = 0;


    this.el = container;

    // Bind event handlers
    document.addEventListener("mousedown", function (e) {
      return _this.down(e);
    }, false);
    document.addEventListener("touchstart", function (e) {
      return _this.down(e);
    }, false);
    document.addEventListener("mousemove", function (e) {
      return _this.move(e);
    }, false);
    document.addEventListener("touchmove", function (e) {
      return _this.move(e);
    }, false);
    document.addEventListener("mouseup", function (e) {
      return _this.up(e);
    }, false);
    document.addEventListener("touchend", function (e) {
      return _this.up(e);
    }, false);
    document.addEventListener("mousewheel", function (e) {
      return _this.wheel(e);
    }, false);
    document.addEventListener("DOMMouseScroll", function (e) {
      return _this.wheel(e);
    }, false);
  }

  return MouseControls;
}();

module.exports = MouseControls;

},{}],26:[function(require,module,exports){
"use strict";

var pop = require("pop");
var bubble_walk = new pop.Texture("res/images/cursor.png");
var walkFrames = [0].map(function (x) {
  return { x: x, y: 0 };
});

function Player(controls, tryMove) {
  pop.TileSprite.call(this, bubble_walk, 40, 40);
  this.tryMove = tryMove;
  this.controls = controls;
  this.curTick = 0;
  this.curWalk = 0;
  this.frame = walkFrames[0];

  this.hitBox = {
    x: 0,
    y: 0,
    w: 24,
    h: 30
  };

  this.dir = 1;
  this.velocity = { x: 0, y: 0 };
  this.acceleration = { x: 0.1, y: 0.12 };

  this.sounds = {
    swoosh: new pop.Sound("./res/sounds/swoosh.wav?a=2", { volume: 0.2, loop: true }),
    jump: new pop.SoundPool("./res/sounds/jump.wav?a=1", 3, { volume: 0.4 })
  };

  this.speed = 0.1;
}
Player.prototype = Object.create(pop.TileSprite.prototype);

Player.prototype.update = function (dt, t) {
  var controlsX = this.controls.x();
  var controlsY = this.controls.y();

  this.velocity.y += this.acceleration.y * dt * controlsY * 0.01;
  this.velocity.x += this.acceleration.x * dt * controlsX * 0.01;

  var response = this.tryMove(this.pos, {
    x: (controlsX * this.speed + this.velocity.x) * dt,
    y: (controlsY * this.speed + this.velocity.y) * dt
  });

  this.velocity.x *= 0.9;
  this.velocity.y *= 0.9;

  // Player fired
  if (this.controls.action() && this.weapon) {
    this.weapon.shoot({ x: this.pos.x, y: this.pos.y }, this.dir, t);
  }

  // Update position
  this.pos.x = response.x;
  this.pos.y = response.y;

  // Walking animation (when moving)
  var walkFrameRate = 15 / this.speed;
  if ((controlsY || controlsX) && (this.curTick += dt) > walkFrameRate) {
    this.curWalk++;
    this.frame = walkFrames[this.curWalk % walkFrames.length];
    this.curTick -= walkFrameRate;
  }
  this.dir = controlsX > 0 ? 1 : controlsX < 0 ? -1 : this.dir;
};

module.exports = Player;

},{"pop":2}],27:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var env = {

  w: window.innerWidth,
  h: window.innerHeight,

  chunkSize: 16,
  chunksX: 2,
  chunksY: 1,
  tileW: 32,
  tileH: 32

};

exports.default = env;

},{}],28:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pop = require("pop");

var _pop2 = _interopRequireDefault(_pop);

var _TitleScreen = require("./screens/TitleScreen");

var _TitleScreen2 = _interopRequireDefault(_TitleScreen);

var _GameScreen = require("./screens/GameScreen");

var _GameScreen2 = _interopRequireDefault(_GameScreen);

var _env = require("./env");

var _env2 = _interopRequireDefault(_env);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Controls = _pop2.default.Controls;
var CanvasRenderer = _pop2.default.CanvasRenderer;


function Game(canvas) {

  var controls = new Controls();

  var scene;
  var w = _env2.default.w; //540;
  var h = _env2.default.h; //960;
  //w = 360;
  //h = 640;

  var renderer = new CanvasRenderer(w, h, canvas);
  if (!canvas) {

    document.querySelector("#board").appendChild(renderer.view);
  }

  function titleScreen() {

    scene = new _TitleScreen2.default(renderer.view, controls, newGame);
  }

  function newGame(worldParams) {

    scene = new _GameScreen2.default(renderer.view, worldParams, controls);
  }

  // Main loop
  var dt, last;
  function loopy(t) {
    requestAnimationFrame(loopy);

    if (!last) last = t;
    dt = t - last;
    last = t;

    // Update & render everything
    scene.update(dt, t);
    renderer.render(scene);
  }
  titleScreen();

  requestAnimationFrame(loopy);
}

exports.default = Game;

},{"./env":27,"./screens/GameScreen":31,"./screens/TitleScreen":32,"pop":2}],29:[function(require,module,exports){
"use strict";

var _game = require("./game");

var _game2 = _interopRequireDefault(_game);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.game = _game2.default;

},{"./game":28}],30:[function(require,module,exports){
"use strict";

var pop = require("pop");

var bullet = new pop.Texture("res/images/bullet.png");

function Iron() {
  pop.Sprite.call(this, bullet);
  this.type = "iron";
  this.relPos = { x: 0, y: 0 };
}
Iron.prototype = Object.create(pop.Sprite.prototype);

module.exports = Iron;

},{"pop":2}],31:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _pop = require("pop");

var _pop2 = _interopRequireDefault(_pop);

var _env = require("../env");

var _env2 = _interopRequireDefault(_env);

var _Dirs = require("../Dirs");

var _Dirs2 = _interopRequireDefault(_Dirs);

var _Player = require("../entities/Player");

var _Player2 = _interopRequireDefault(_Player);

var _Earth = require("../Earth");

var _Earth2 = _interopRequireDefault(_Earth);

var _Camera = require("../Camera");

var _Camera2 = _interopRequireDefault(_Camera);

var _UITile = require("../UITile");

var _UITile2 = _interopRequireDefault(_UITile);

var _HUD = require("../HUD");

var _HUD2 = _interopRequireDefault(_HUD);

var _MouseControls = require("../controls/MouseControls");

var _MouseControls2 = _interopRequireDefault(_MouseControls);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // probably should be in earth
// probably should be in earth

var Container = _pop2.default.Container;
var Sprite = _pop2.default.Sprite;
var Texture = _pop2.default.Texture;
var chunksX = _env2.default.chunksX;
var chunksY = _env2.default.chunksY;

var GameScreen = function (_Container) {
  _inherits(GameScreen, _Container);

  function GameScreen(canvas, worldParams, controls, gameOver) {
    _classCallCheck(this, GameScreen);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(GameScreen).call(this));

    _this.controls = controls;
    _this.gameOver = gameOver;

    _this.mouse = new _MouseControls2.default(canvas);
    _this.mouse_past = [];

    var player = new _Player2.default(controls, function (pos, delta) {
      return {
        x: pos.x + delta.x,
        y: pos.y + delta.y,
        ground: false,
        head: false
      };
    });
    player.pos = { x: 320, y: 120 };

    var camera = new _Camera2.default({
      focusObject: player,
      viewport: { w: canvas.width, h: canvas.height },
      //worldSize: { w: map.map.w * map.map.tileW, h: map.map.h * map.map.tileH },
      worldSize: { w: canvas.width * 2, h: canvas.height * 2 },
      moveSpeed: 0.008
    });

    _this.add(camera);

    _this.earth = new _Earth2.default(chunksX, chunksY);

    camera.add(_this.earth);
    camera.add(player);

    _this.camera = camera;
    _this.player = player;

    _this.hud = new _HUD2.default();
    _this.hud.pos.x = 0;
    _this.hud.pos.y = _env2.default.h - 100;

    _this.add(_this.hud);

    _this.uiTile = new _UITile2.default();
    _this.uiTile.pos.x = 45;
    _this.uiTile.pos.y = _env2.default.h - 70;
    _this.tile = 1;
    _this.rot = 1;
    _this.add(_this.uiTile);
    _this.setTileUI();

    _this.selected = new Sprite(new Texture("./res/images/hud_selected.png"));
    _this.selected.pos.y = _env2.default.h - 80;
    _this.selected.pos.x = 30;
    _this.add(_this.selected);
    return _this;
  }

  _createClass(GameScreen, [{
    key: "setTileUI",
    value: function setTileUI() {

      this.uiTile.frame.x = this.tile === 0 ? 0 : this.rot;
      this.uiTile.frame.y = this.tile < 2 ? 0 : 1;
    }
  }, {
    key: "update",
    value: function update(dt, t) {

      _get(Object.getPrototypeOf(GameScreen.prototype), "update", this).call(this, dt, t);

      var earth = this.earth;
      var mouse = this.mouse;
      var camera = this.camera;


      var wheelDt = this.mouse.wheelDt;
      if (wheelDt !== 0) {

        this.camera.scale.x += 0.1 * wheelDt;
        this.camera.scale.y += 0.1 * wheelDt;
        this.mouse.wheelDt = 0;
      }

      // Clickin' and touchin'
      if (mouse.left) {

        // Get current click position
        var x = (mouse.x - camera.pos.x) / camera.scale.x;
        var y = (mouse.y - camera.pos.y) / camera.scale.y;

        // Handle HUD buttons
        var pressed = this.hud.checkButtons(mouse.x, mouse.y);
        if (pressed) {

          switch (pressed) {

            case "ROTATE":
              this.rot = this.rot % 4 + 1;
              this.setTileUI();
              mouse.left = false;
              break;

            case "SWITCH":
              if (this.doMove) {

                this.doMove = false;
              } else {

                this.tile = (this.tile + 1) % 2;
                this.rot = 1;
              }
              this.selected.pos.x = 30;
              this.setTileUI();
              mouse.left = false;
              break;

            case "MOVE":
              this.doMove = true;
              this.selected.pos.x = 230;
              return;

            case "UP":
              this.camera.scale.x += 0.01;
              this.camera.scale.y += 0.01;
              break;

            case "DOWN":
              this.camera.scale.x -= 0.01;
              this.camera.scale.y -= 0.01;
              break;

          }

          return;
        }

        // TODO: Move drag direction detection to mouse controls
        var samples = this.mouse_past.slice(-4).reverse();
        var dir = this.lastDir || _Dirs2.default.indexToDir(this.rot);
        var dx = 0;
        var dy = 0;

        if (samples.length) {

          var maybeDir = samples.reduce(function (acc, el) {

            acc.dx += acc.sx - el[0];
            acc.dy += acc.sy - el[1];

            return acc;
          }, { sx: mouse.x, sy: mouse.y, dx: 0, dy: 0 });

          dx = maybeDir.dx / samples.length;
          dy = maybeDir.dy / samples.length;
          var adx = Math.abs(dx);
          var ady = Math.abs(dy);

          if (adx > 1 || ady > 1) {

            if (adx > ady) {

              dir = dx > 0 ? _Dirs2.default.RIGHT : _Dirs2.default.LEFT;
            } else {

              dir = dy > 0 ? _Dirs2.default.DOWN : _Dirs2.default.UP;
            }

            this.lastDir = dir;
          }
        }

        this.mouse_past.push([mouse.x, mouse.y]);

        if (this.doMove) {

          // Pan.
          this.player.velocity.x += 0.03 * _Dirs2.default.dtHoriz(dir);
          this.player.velocity.y += 0.03 * _Dirs2.default.dtVert(dir);
        } else {

          earth.setTile({
            type: this.tile === 0 ? "Blank" : "Passer",
            dir: dir
          }, { x: x, y: y });
        }
      } else {

        if (this.mouse_past.length) {

          this.mouse_past = [];
        }

        this.lastDir = _Dirs2.default.NONE;
      }

      // R key: rotate tile
      if (this.controls.key(81)) {

        this.controls.unset(81);
        this.tile = (this.tile + 1) % 3;
        this.rot = this.tile === 0 ? 0 : 1;
        this.setTileUI();
      }

      // Q key: switch tile
      if (this.controls.key(82)) {

        this.controls.unset(82);
        this.rot = this.rot % 4 + 1;
        this.setTileUI();
      }
    }
  }]);

  return GameScreen;
}(Container);

module.exports = GameScreen;

},{"../Camera":18,"../Dirs":19,"../Earth":20,"../HUD":21,"../UITile":22,"../controls/MouseControls":25,"../entities/Player":26,"../env":27,"pop":2}],32:[function(require,module,exports){
"use strict";

var pop = require("pop");

function TitleScreen(canvas, controls, onStart) {
  pop.Container.call(this);
  this.controls = controls;
  this.onStart = onStart;
}

TitleScreen.prototype = Object.create(pop.Container.prototype);

TitleScreen.prototype.update = function (dt, t) {
  pop.Container.prototype.update.call(this, dt, t);

  var actionPressed = this.controls.action();
  //if (actionPressed) {
  this.onStart({
    seed: Math.random() * 1000 | 0,
    localPlayerId: 0,
    players: []
  });
  //}
};

module.exports = TitleScreen;

},{"pop":2}],33:[function(require,module,exports){
"use strict";

var _pop = require("pop");

var _pop2 = _interopRequireDefault(_pop);

var _Tile2 = require("./Tile");

var _Tile3 = _interopRequireDefault(_Tile2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Texture = _pop2.default.Texture;


var mapTiles = new Texture("res/images/tiles.png");

var Blank = function (_Tile) {
  _inherits(Blank, _Tile);

  function Blank() {
    _classCallCheck(this, Blank);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Blank).call(this, mapTiles, 32, 32));

    _this.type = "Blank";
    _this.frame.x = 0;
    _this.frame.y = 0;

    _this.wall = false;
    _this.items = [];

    return _this;
  }

  return Blank;
}(_Tile3.default);

module.exports = Blank;

},{"./Tile":36,"pop":2}],34:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _pop = require("pop");

var _pop2 = _interopRequireDefault(_pop);

var _Tile2 = require("./Tile");

var _Tile3 = _interopRequireDefault(_Tile2);

var _Dirs = require("../Dirs");

var _Dirs2 = _interopRequireDefault(_Dirs);

var _env = require("../env");

var _env2 = _interopRequireDefault(_env);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Texture = _pop2.default.Texture;


var mapTiles = new Texture("res/images/passer.png");

var Switcher = function (_Tile) {
  _inherits(Switcher, _Tile);

  function Switcher(dir) {
    _classCallCheck(this, Switcher);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Switcher).call(this, mapTiles, 32, 32));

    _this.speed = 0.03;


    _this.type = "Switcher";
    _this.dir = dir;
    _this.lastDir = dir;

    _this.frame.y = _Dirs2.default.toIndex(dir);
    _this.frame.x = 0;

    _this.wall = true;
    _this.state = "IDLE";
    _this.stateTime = 0;

    return _this;
  }

  _createClass(Switcher, [{
    key: "update",
    value: function update(dt, t, map) {
      var _this2 = this;

      this.frame.x = (t / 600 | 0) % 2;

      if (this.dir === _Dirs2.default.RIGHT) {

        this.frame.x = !this.item ? 3 : (this.item_x - 16) / 4 | 0;
      }

      if (this.dir === _Dirs2.default.LEFT) {

        this.frame.x = !this.item ? 0 : (this.item_x - 1) / 4 | 0;
      }

      if (this.dir === _Dirs2.default.DOWN) {

        this.frame.x = !this.item ? 2 : (this.item_y - 16) / 4 | 0;
      }

      if (this.dir === _Dirs2.default.UP) {

        this.frame.x = !this.item ? 2 : Math.max(0, 15 - this.item_y) / 4 | 0;
      }

      var item = this.item;
      var speed = this.speed;
      var dir = this.dir;
      var pos = this.pos;
      var tileW = _env2.default.tileW;
      var tileH = _env2.default.tileH;


      if (!item) {

        return;
      }

      var xo = speed * dt * _Dirs2.default.dtHoriz(dir);
      var yo = speed * dt * _Dirs2.default.dtVert(dir);

      // Logical position
      var rxo = this.item_x += xo;
      var ryo = this.item_y += yo;

      // Did move off tile?
      var wantsToMoveToNextTile = dir === _Dirs2.default.UP && ryo < 0 || dir === _Dirs2.default.DOWN && ryo > tileH || dir === _Dirs2.default.LEFT && rxo < 0 || dir === _Dirs2.default.RIGHT && rxo > tileW;

      if (wantsToMoveToNextTile) {
        var _map$worldToTilePosit = map.worldToTilePosition(pos);

        var x = _map$worldToTilePosit.x;
        var y = _map$worldToTilePosit.y;

        var next = map.getTileInDir(x, y, dir);

        var dirsToCheck = _Dirs2.default.notDir(_Dirs2.default.opposite(dir));
        if (dirsToCheck.length > 1) {

          dirsToCheck = dirsToCheck.filter(function (d) {
            return d !== _this2.lastDir;
          });
        }

        // console.log( dirsToCheck );

        if (next && next.acceptItem(item)) {

          this.item = null;
        }

        return;
      }

      // Screen position
      item.pos.x += xo;
      item.pos.y += yo;
    }
  }]);

  return Switcher;
}(_Tile3.default);

module.exports = Switcher;

},{"../Dirs":19,"../env":27,"./Tile":36,"pop":2}],35:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _pop = require("pop");

var _pop2 = _interopRequireDefault(_pop);

var _Tile2 = require("./Tile");

var _Tile3 = _interopRequireDefault(_Tile2);

var _Dirs = require("../Dirs");

var _Dirs2 = _interopRequireDefault(_Dirs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Texture = _pop2.default.Texture;


var mapTiles = new Texture("res/images/passer.png");

var TakerGiver = function (_Tile) {
  _inherits(TakerGiver, _Tile);

  function TakerGiver(dir) {
    _classCallCheck(this, TakerGiver);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TakerGiver).call(this, mapTiles, 32, 32));

    _this.type = "TakerGiver";
    _this.dir = dir;

    _this.frame.y = _Dirs2.default.toIndex(dir);
    _this.frame.x = 0;

    _this.wall = true;
    _this.items = [];
    _this.state = "IDLE";
    _this.stateTime = 0;

    return _this;
  }

  _createClass(TakerGiver, [{
    key: "update",
    value: function update() {}
  }]);

  return TakerGiver;
}(_Tile3.default);

module.exports = TakerGiver;

},{"../Dirs":19,"./Tile":36,"pop":2}],36:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _pop = require("pop");

var _pop2 = _interopRequireDefault(_pop);

var _env = require("../env");

var _env2 = _interopRequireDefault(_env);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TileSprite = _pop2.default.TileSprite;

var Tile = function (_TileSprite) {
  _inherits(Tile, _TileSprite);

  function Tile(texture, w, h) {
    _classCallCheck(this, Tile);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Tile).call(this, texture, w, h));

    _this.item = null;
    _this.item_x = 0;
    _this.item_y = 0;
    _this.takeableItem = null;
    return _this;
  }

  _createClass(Tile, [{
    key: "accepts",
    value: function accepts(item) {

      return item && !this.item;
    }
  }, {
    key: "acceptItem",
    value: function acceptItem(item) {
      var x = this.x;
      var y = this.y;
      var tileW = _env2.default.tileW;
      var tileH = _env2.default.tileH;

      var accepts = this.accepts(item);

      if (accepts) {

        this.item = item;

        this.item_x = tileW / 2 | 0;
        this.item_y = tileH / 2 | 0;

        item.pos.x = x * tileW + this.item_x - 8;
        item.pos.y = y * tileH + this.item_y - 8;
      }

      return accepts;
    }
  }]);

  return Tile;
}(TileSprite);

module.exports = Tile;

},{"../env":27,"pop":2}]},{},[29]);
