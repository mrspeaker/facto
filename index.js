ejecta.include("bundle.js");

var w = window.innerWidth;
var h = window.innerHeight;
var scale = window.devicePixelRatio;

var canvas = document.getElementById("canvas");

canvas.width = w * scale;
canvas.height = h * scale;
canvas.style.width = w;
canvas.style.height = h;

var ctx = canvas.getContext("2d");
ctx.fillStyle = "#000000";
ctx.fillRect( 0, 0, w, h );

game( canvas );
