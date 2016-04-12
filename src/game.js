import pop from "pop";
import TitleScreen from "./screens/TitleScreen";
import GameScreen from "./screens/GameScreen";
import env from "./env";

const {
  Controls,
  CanvasRenderer
} = pop;

function Game ( canvas ) {

  const controls = new Controls();

  var scene;
  var w = env.w; //540;
  var h = env.h; //960;
  //w = 360;
  //h = 640;

  const renderer = new CanvasRenderer( w, h, canvas );
  if ( !canvas ) {

    document.querySelector("#board").appendChild(renderer.view);

  }

  function titleScreen () {

    scene = new TitleScreen(renderer.view, controls, newGame);

  }

  function newGame (worldParams) {

    scene = new GameScreen(renderer.view, worldParams, controls);
    
  }

  // Main loop
  var dt, last;
  function loopy (t) {
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

export default Game;
