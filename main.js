$(document).ready(() => {
  // Initialize the map variable
  var mymap = '';

  var personHeight = 170.7

  let seaLevel = {
    _map: '0.0000000000',
    _cm: 0,
    _m: 0,
    // This is the percent of the figure we want to shade.
    _percent: "0%",

    //Setter for _cm
    set cm(newCm){
      //Here we update all the other properties whenever seaLevel.Cm is changed.
      this._cm = newCm;
      this._m = (newCm/100);
      this._map = (newCm/10).toFixed(10);
      this._percent = `${((100*newCm)/personHeight)}%`
    },

    //Getters for all the properties
    get map(){
      return this._map;
    },
    get cm(){
      return this._cm;
    },
    get m(){
      return this._m;
    },
    get percent(){
      return this._percent
    },
  };

  //This is the variable to change the sealevel. Units are 10ths of a meter. 
  //var seaLevelRise = '0.0';
  
  //DELETE
  //debugMe();

    //person-toggle behavior
  function mapSize(){
    $('.person').toggleClass('hidden');
    $('.map').toggleClass('full-width');
  }

  //Function to initialise the map
  function mapinit(){
    mymap = L.map('mymap',{
    center: [34.648000, 135.411472],
    zoom: 10.5,
    scrollWheelZoom: false,
    });
    //The following code makes the buttons visible. If they are not hidden by default, they'll show up at the top of the map before the map loads. 
    $('.map-menu').toggleClass('hidden');
    $('.map-search').toggleClass('hidden');
    $('.person-toggle').toggleClass('hidden');
  };



  // Function to draw the map
  function drawMap(){
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
    // This is new code for styling the map.
    if (${seaLevel.map === '0.0000000000'}) {
      floodColour = vec4(0.5, 0.5, 0.5, 0.0);
    } else if (height > ${seaLevel.map}) {
      // High (>10m) over ground, transparent
      floodColour = vec4(0.5, 0.5, 0.5, 0.0);
    } else if (height > 0.0) {
      // Over ground but very close to sea level, blue
      floodColour = vec4(0.05, 0.1, 0.9, 0.4);
    } else {
      // Water, some semiopaque blue
      floodColour = vec4(0.05, 0.1, 0.9, 0.4);
    }

    //   // This is the original code for the sea level rise.
    //   // Currently preserved in case we need it.
    // if (height > ${seaLevel.map}) {
    //   // High (>10m) over ground, transparent
    //   floodColour = vec4(0.5, 0.5, 0.5, 0.0);
    // } else if (height > 50.0) {
    //   // Over ground but somewhat close to sea level, yellow
    //   floodColour = vec4(0.9, 0.9, 0.5, 0.4);
    // } else if (height > 0.0) {
    //   // Over ground but very close to sea level, red
    //   floodColour = vec4(0.9, 0.5, 0.5, 0.4);
    // } else {
    //   // Water, some semiopaque blue
    //   floodColour = vec4(0.05, 0.1, 0.9, 0.4);
    // }

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
  };

  //Function to display the current sea level rise below the map
  function displayRise(){
    $('#sea-level-display').text(seaLevel.m);
  };

  // Update the shading on the person diagram
  function personLevel(){
    $('.person-level').height(`${seaLevel.percent}`);
  };

  //Draw the map
  mapinit();
  drawMap();
  mapSize();

  //Show the rise.
  displayRise();

  //Display shading on the person diagram
  personLevel();

  //Display values in debug section
  function debugMe() {
    $('#dmap').text(`Map Value: ${seaLevel.map}`);
    $('#dcm').text(`CM Value (slider input): ${seaLevel.cm}`);
    $('#dm').text(`Meter value (display output): ${seaLevel.m}`);
    $('#pct').text(`Percent to shade (from sea level object): ${seaLevel.percent}`);
  };
  debugMe();
  
  // Slider
  $('#slider').slider({
    max: 1000,
    min: 0,
    step: 1,
  });
  $('#slider').on('slidechange', function(){
    //alert($('#slider').slider('value'));
    seaLevel.cm = $('#slider').slider('value');
    displayRise();
    drawMap();
    debugMe();
    personLevel();
  }); 

  // Sidebar behavior
  $('#sidebar-button').on('click', () => {
    $(event.currentTarget).find('img').toggleClass('rotate');
    $('.sidebar').toggleClass('hidden');
  });
  $('.sidebar').on('mouseleave', () => {
    $('.sidebar').toggleClass('hidden');
    $('.sidebar-button').find('img').toggleClass('rotate');
  });

  // // Dropdown behavior
  // $('.dropdown-button').on('click', () => {
  //   $('.dropdown-menu').toggleClass('hidden');
  //   $(event.currentTarget).find('img').toggleClass('rotate');
  // });

    // Dropdown behavior 2
  $('.dropdown-button').on('click', () => {
    $('.dropdown-menu').toggleClass('hidden');
    $(event.currentTarget).toggleClass('rotate-full');
  });


  // person-toggle button
  $('.person-toggle').on('click', () => {
    mapSize();
    $(event.currentTarget).toggleClass('rotate-full');
  });
});
