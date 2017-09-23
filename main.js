var mymap =  L.map('mymap',{
  center: [34.648000, 135.411472],
  zoom: 10.5,
});

//This is the variable to change the sealevel.
var seaLevelRise = '1.0';

//Sanchez code 1
// Create the fragment shader as a multi-line string. Note the "`" character, valid only in ES6 JavaScript.
// Shaders can be defined elsewhere, or loaded from other files or from the network,
// but they must be strings when used in a TileLayer.GL.

// You need to *not* define the varyings and uniforms. L.TileLayer.GL does that for you.
// // precision highp float;
// // uniform sampler2D uTexture0;  // This contains a reference to the tile image loaded from the network
// // varying vec2 vTextureCoords;  // This is the interpolated texel coords for this fragment

var antiTonerFragmentShader = `
    void main(void) {
  // Fetch color from texture 2, which is the terrain-rgb tile
  highp vec4 texelColour = texture2D(uTexture2, vec2(vTextureCoords.s, vTextureCoords.t));

  // Height is represented in TENTHS of a meter
  highp float height = (
    texelColour.r * 255.0 * 256.0 * 256.0 +
    texelColour.g * 255.0 * 256.0 +
    texelColour.b * 255.0 )
  -100000.0;

  vec4 floodColour;
  if (height > ${seaLevelRise}) {
    // High (>10m) over ground, transparent
    floodColour = vec4(0.5, 0.5, 0.5, 0.0);
  } else if (height > 50.0) {
    // Over ground but somewhat close to sea level, yellow
    floodColour = vec4(0.9, 0.9, 0.5, 0.4);
  } else if (height > 0.0) {
    // Over ground but very close to sea level, red
    floodColour = vec4(0.9, 0.5, 0.5, 0.4);
  } else {
    // Water, some semiopaque blue
    floodColour = vec4(0.05, 0.1, 0.9, 0.4);
  }

  // Now fetch color from texture 0, which is the basemap
  texelColour = texture2D(uTexture0, vec2(vTextureCoords.s, vTextureCoords.t));

  // And compose them
  floodColour = vec4(
    texelColour.rgb * (1.0 - floodColour.a) +
    floodColour.rgb * floodColour.a,
    1);

  // Last, fetch color from texture 1, which is the labels
  texelColour = texture2D(uTexture1, vec2(vTextureCoords.s, vTextureCoords.t));

  // And compose the labels on top of everything
  gl_FragColor = vec4(
    floodColour.rgb * (1.0 - texelColour.a) +
    texelColour.rgb * texelColour.a,
    1);
}
`

// Instantiate our L.TileLayer.GL...
var antitoner = L.tileLayer.gl({
    // ... with the shader we just wrote above...
    fragmentShader: antiTonerFragmentShader,

    // ...and loading tile images from Stamen Toner as "uTexture0".
    // If this array contained more than one tile template string,
    // there would be "uTexture1", "uTexture2" and so on.
    tileUrls: ['http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', 'http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', 'https://{s}.tiles.mapbox.com/v4/mapbox.terrain-rgb/{z}/{x}/{y}.pngraw?access_token=pk.eyJ1IjoiYmVuamFtaW5wYWxzYSIsImEiOiJjaWtqc2R6MjQwOGtidWRtNmVwY21jcDFiIn0.hJN_0BrRJTdB7KulNCEGaQ']
}).addTo(mymap);
