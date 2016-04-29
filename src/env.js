const env = {

  w: window.innerWidth,
  h: window.innerHeight,

  chunkW: 32,
  chunkH: 32,

  chunksX: 1,
  chunksY: 1,
  tileW: 32,
  tileH: 32,

  numTileTypes: 6,
  tiles: [ "Blank", "Source", "Passer", "Transformer", "Destroyer", "TakerGiver" ]

};

export default env;
