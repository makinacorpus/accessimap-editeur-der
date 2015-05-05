'use strict';
/*global textures */

/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.settings
 * @description
 * # settings
 * Factory in the accessimapEditeurDerApp.
 */
angular.module('accessimapEditeurDerApp')
  .factory('settings', ['editSvg',
    function(editSvg) {

    var leafletConf = {
        GLOBAL_MAP_CENTER: [1.44, 43.6], // [lon, lat]
        GLOBAL_MAP_DEFAULT_ZOOM: 13,
    };

    var QUERY_LIST = [{
      id: 'poi',
      name: 'Point d\'intérêt',
      type: 'point',
      query: ['node["amenity"]', 'node["shop"]'],
      icon: 'road'
    },{
      id: 'trottoirs',
      name: 'Trottoirs',
      type: 'line',
      query: ['way["footway"="sidewalk"]'],
      icon: 'road'
    }, {
      id: 'ppietons',
      name: 'Passages piétons',
      type: 'line',
      query: ['way["footway"="crossing"]'],
      icon: 'road'
    }, {
      id: 'ppietonsp',
      name: 'Passages piétons',
      type: 'point',
      query: ['node["highway"="crossing"]'],
      icon: 'road'
    }, {
      id: 'principales',
      name: 'Routes principales',
      type: 'line',
      query: ['way["highway"~"motorway|trunk|primary|secondary"]'],
      icon: 'road'
    }, {
      id: 'places',
      name: 'Places',
      type: 'polygon',
      query: ['way["highway"="pedestrian"]["area"="yes"]'],
      icon: 'road'
    }, {
      id: 'rues',
      name: 'Toutes les rues',
      type: 'line',
      query: ['way["highway"]["footway"!="sidewalk"]["footway"!="crossing"]["area"!="yes"]'],
      icon: 'road'
    }, {
      id: 'trafficSignals',
      name: 'Feux tricolores',
      type: 'point',
      query: ['node["highway"="traffic_signals"]'],
      icon: 'street-view'
    }, {
      id: 'batiments',
      name: 'Batiments',
      type: 'polygon',
      query: ['way["building"]["building"!="no"]'],
      icon: 'building-o'
    }, {
      id: 'eau',
      name: 'Eau',
      type: 'polygon',
      query: ['relation["type"="multipolygon"]["natural"="water"]'],
      icon: 'leaf'
    }, {
      id: 'parc',
      name: 'Parc',
      type: 'polygon',
      query: ['way["leisure"="park"]'],
      icon: 'leaf'
    }];

    var POLYGON_STYLES = {
      'bighash': textures.lines().orientation('vertical'),
      'bighashm45': textures.lines().orientation('6/8'),
      'bighash45': textures.lines().orientation('2/8'),
      'smallhash': textures.lines().orientation('vertical').thicker(),
      'smallhashm45': textures.lines().orientation('6/8').thicker(),
      'smallhash45': textures.lines().orientation('2/8').thicker(),
      'wavest': textures.paths().d('waves').thicker(),
      'waves': textures.paths().d('waves'),
      'wavestg': textures.paths().d('waves').stroke("grey").thicker(),
      'wavesg': textures.paths().d('waves').stroke("grey"),
      'smalldots': textures.circles().complement(),
      'smalldotsthicker': textures.circles().lighter().thicker().complement(),
      'bigdots': textures.circles().heavier().complement(),
      'bigdotsg': textures.circles().fill("grey").heavier().complement(),
      'bigdotsempty': textures.circles().heavier().fill("transparent").strokeWidth(2).radius(7).complement().thinner(),
      'smalldotsempty': textures.circles().heavier().fill("transparent").strokeWidth(2).radius(4).complement(),
      'squares45': textures.lines().orientation("2/8", "6/8").size(20).strokeWidth(1),
      'squares': textures.lines().orientation('vertical', 'horizontal').size(20).strokeWidth(1),
      'hexagons': textures.paths().d("hexagons").size(10).strokeWidth(2),
      'crosses': textures.paths().d("crosses"),
      'caps': textures.paths().d("caps"),
      'woven': textures.paths().d("woven"),
    };




    var STYLES = {
    'line': [{
      id: 'straight_2',
      name: 'Trait 2',
      style: [{
        'k': 'stroke',
        'v': 'black'
      }, {
        'k': 'stroke-width',
        'v': '2'
      }, {
        'k': 'fill',
        'v': 'none'
      }],
      style_inner: [{
        'k': 'stroke-width',
        'v': '0'
      }, {
        'k': 'fill',
        'v': 'none'
      }]
    },{
      id: 'straight_3',
      name: 'Trait 3',
      style: [{
        'k': 'stroke',
        'v': 'black'
      }, {
        'k': 'stroke-width',
        'v': '3'
      }, {
        'k': 'fill',
        'v': 'none'
      }],
      style_inner: [{
        'k': 'stroke-width',
        'v': '0'
      }, {
        'k': 'fill',
        'v': 'none'
      }]
    },{
      id: 'straight_5',
      name: 'Trait 5',
      style: [{
        'k': 'stroke',
        'v': 'black'
      }, {
        'k': 'stroke-width',
        'v': '5'
      }, {
        'k': 'fill',
        'v': 'none'
      }],
      style_inner: [{
        'k': 'stroke-width',
        'v': '0'
      }, {
        'k': 'fill',
        'v': 'none'
      }]
    },{
      id: 'straight_8',
      name: 'Traits parallèles',
      style: [{
        'k': 'stroke',
        'v': 'black'
      }, {
        'k': 'stroke-width',
        'v': '8'
      }, {
        'k': 'stroke-linecap',
        'v': 'round'
      }, {
        'k': 'fill',
        'v': 'none'
      }],
      style_inner: [{
        'k': 'stroke',
        'v': 'white'
      }, {
        'k': 'stroke-width',
        'v': '4'
      }, {
        'k': 'stroke-linecap',
        'v': 'round'
      }, {
        'k': 'fill',
        'v': 'none'
      }]
    },{
      id: 'dashed21_5',
      name: 'Tirets 21_5',
      style: [{
        'k': 'stroke',
        'v': 'black'
      }, {
        'k': 'stroke-width',
        'v': '5'
      }, {
        'k': 'fill',
        'v': 'none'
      }, {
        'k': 'stroke-dasharray',
        'v': '10, 5'
      }],
      style_inner: [{
        'k': 'stroke-width',
        'v': '0'
      }, {
        'k': 'fill',
        'v': 'none'
      }]
    },{
      id: 'dashed22_3',
      name: 'Tirets 22_3',
      style: [{
        'k': 'stroke',
        'v': 'black'
      }, {
        'k': 'stroke-width',
        'v': '3'
      }, {
        'k': 'fill',
        'v': 'none'
      }, {
        'k': 'stroke-dasharray',
        'v': '6, 6'
      }],
      style_inner: [{
        'k': 'stroke-width',
        'v': '0'
      }, {
        'k': 'fill',
        'v': 'none'
      }]
    },{
      id: 'dashed22_5',
      name: 'Tirets 22_5',
      style: [{
        'k': 'stroke',
        'v': 'black'
      }, {
        'k': 'stroke-width',
        'v': '5'
      }, {
        'k': 'fill',
        'v': 'none'
      }, {
        'k': 'stroke-dasharray',
        'v': '10, 10'
      }],
      style_inner: [{
        'k': 'stroke-width',
        'v': '0'
      }, {
        'k': 'fill',
        'v': 'none'
      }]
    },{
      id: 'dashed42_3',
      name: 'Tirets 42_3',
      style: [{
        'k': 'stroke',
        'v': 'black'
      }, {
        'k': 'stroke-width',
        'v': '3'
      }, {
        'k': 'fill',
        'v': 'none'
      }, {
        'k': 'stroke-dasharray',
        'v': '12, 6'
      }],
      style_inner: [{
        'k': 'stroke-width',
        'v': '0'
      }, {
        'k': 'fill',
        'v': 'none'
      }]
    },{
      id: 'dashed42_5',
      name: 'Tirets 42_5',
      style: [{
        'k': 'stroke',
        'v': 'black'
      }, {
        'k': 'stroke-width',
        'v': '5'
      }, {
        'k': 'fill',
        'v': 'none'
      }, {
        'k': 'stroke-dasharray',
        'v': '20, 10'
      }],
      style_inner: [{
        'k': 'stroke-width',
        'v': '0'
      }, {
        'k': 'fill',
        'v': 'none'
      }]
    },{
      id: 'dashed42_5',
      name: 'Tirets 62_5',
      style: [{
        'k': 'stroke',
        'v': 'black'
      }, {
        'k': 'stroke-width',
        'v': '5'
      }, {
        'k': 'fill',
        'v': 'none'
      }, {
        'k': 'stroke-dasharray',
        'v': '30, 10'
      }],
      style_inner: [{
        'k': 'stroke-width',
        'v': '0'
      }, {
        'k': 'fill',
        'v': 'none'
      }]
    },{
      id: 'dashed4212_3',
      name: 'Tirets 4212_3',
      style: [{
        'k': 'stroke',
        'v': 'black'
      }, {
        'k': 'stroke-width',
        'v': '3'
      }, {
        'k': 'fill',
        'v': 'none'
      }, {
        'k': 'stroke-dasharray',
        'v': '12, 6, 3, 6'
      }],
      style_inner: [{
        'k': 'stroke-width',
        'v': '0'
      }, {
        'k': 'fill',
        'v': 'none'
      }]
    },{
      id: 'dashed4212_5',
      name: 'Tirets 4212_5',
      style: [{
        'k': 'stroke',
        'v': 'black'
      }, {
        'k': 'stroke-width',
        'v': '5'
      }, {
        'k': 'fill',
        'v': 'none'
      }, {
        'k': 'stroke-dasharray',
        'v': '20, 10, 5, 10'
      }],
      style_inner: [{
        'k': 'stroke-width',
        'v': '0'
      }, {
        'k': 'fill',
        'v': 'none'
      }]
    }],
    'polygon': [{
      id: 'bighash',
      name: 'Hachures',
      style: [{
        'k': 'stroke',
        'v': 'black'
      }, {
        'k': 'stroke-width',
        'v': '2'
      },{
        'k': 'fill',
        'v': POLYGON_STYLES.bighash.url()
      }]
    },{
      id: 'bighash-45',
      name: 'Hachures -45',
      style: [{
        'k': 'stroke',
        'v': 'black'
      }, {
        'k': 'stroke-width',
        'v': '2'
      },{
        'k': 'fill',
        'v': POLYGON_STYLES.bighashm45.url()
      }]
    },{
      id: 'bighash45',
      name: 'Hachures 45',
      style: [{
        'k': 'stroke',
        'v': 'black'
      }, {
        'k': 'stroke-width',
        'v': '2'
      },{
        'k': 'fill',
        'v': POLYGON_STYLES.bighash45.url()
      }]
    },{
      id: 'smallhash',
      name: 'Petites hachures',
      style: [{
        'k': 'stroke',
        'v': 'black'
      }, {
        'k': 'stroke-width',
        'v': '2'
      },{
        'k': 'fill',
        'v': POLYGON_STYLES.smallhash.url()
      }]
    },{
      id: 'smallhashm45',
      name: 'Petites hachures -45',
      style: [{
        'k': 'stroke',
        'v': 'black'
      }, {
        'k': 'stroke-width',
        'v': '2'
      },{
        'k': 'fill',
        'v': POLYGON_STYLES.smallhashm45.url()
      }]
    },{
      id: 'smallhash45',
      name: 'Petites hachures 45',
      style: [{
        'k': 'stroke',
        'v': 'black'
      }, {
        'k': 'stroke-width',
        'v': '2'
      },{
        'k': 'fill',
        'v': POLYGON_STYLES.smallhash45.url()
      }]
    },{
      id: 'wavest',
      name: 'Vaguest',
      style: [{
        'k': 'stroke',
        'v': 'black'
      }, {
        'k': 'stroke-width',
        'v': '2'
      },{
        'k': 'fill',
        'v': POLYGON_STYLES.wavest.url()
      }]
    },{
      id: 'waves',
      name: 'Vagues',
      style: [{
        'k': 'stroke',
        'v': 'black'
      }, {
        'k': 'stroke-width',
        'v': '2'
      },{
        'k': 'fill',
        'v': POLYGON_STYLES.waves.url()
      }]
    },{
      id: 'wavestg',
      name: 'Vaguestg',
      style: [{
        'k': 'stroke',
        'v': 'grey'
      }, {
        'k': 'stroke-width',
        'v': '2'
      },{
        'k': 'fill',
        'v': POLYGON_STYLES.wavestg.url()
      }]
    },{
      id: 'wavesg',
      name: 'Vaguesg',
      style: [{
        'k': 'stroke',
        'v': 'grey'
      }, {
        'k': 'stroke-width',
        'v': '2'
      },{
        'k': 'fill',
        'v': POLYGON_STYLES.wavesg.url()
      }]
    },{
      id: 'bigdots',
      name: 'Points',
      style: [{
        'k': 'stroke',
        'v': 'black'
      }, {
        'k': 'stroke-width',
        'v': '2'
      },{
        'k': 'fill',
        'v': POLYGON_STYLES.bigdots.url()
      }]
    },{
      id: 'bigdotsg',
      name: 'Pointsg',
      style: [{
        'k': 'stroke',
        'v': 'grey'
      }, {
        'k': 'stroke-width',
        'v': '2'
      },{
        'k': 'fill',
        'v': POLYGON_STYLES.bigdotsg.url()
      }]
    },{
      id: 'bigdotsempty',
      name: 'Points vides',
      style: [{
        'k': 'stroke',
        'v': 'black'
      }, {
        'k': 'stroke-width',
        'v': '2'
      },{
        'k': 'fill',
        'v': POLYGON_STYLES.bigdotsempty.url()
      }]
    },{
      id: 'smalldots',
      name: 'Petits points',
      style: [{
        'k': 'stroke',
        'v': 'black'
      }, {
        'k': 'stroke-width',
        'v': '2'
      },{
        'k': 'fill',
        'v': POLYGON_STYLES.smalldots.url()
      }]
    },{
      id: 'smalldotsthicker',
      name: 'Petits points rapprochés',
      style: [{
        'k': 'stroke',
        'v': 'black'
      }, {
        'k': 'stroke-width',
        'v': '2'
      },{
        'k': 'fill',
        'v': POLYGON_STYLES.smalldotsthicker.url()
      }]
    },{
      id: 'smalldotsempty',
      name: 'Petits points vides',
      style: [{
        'k': 'stroke',
        'v': 'black'
      }, {
        'k': 'stroke-width',
        'v': '2'
      },{
        'k': 'fill',
        'v': POLYGON_STYLES.smalldotsempty.url()
      }]
    },{
      id: 'squares',
      name: 'Quadrillage',
      style: [{
        'k': 'stroke',
        'v': 'black'
      }, {
        'k': 'stroke-width',
        'v': '1'
      },{
        'k': 'fill',
        'v': POLYGON_STYLES.squares.url()
      }]
    },{
      id: 'squares45',
      name: 'Quadrillage 45',
      style: [{
        'k': 'stroke',
        'v': 'black'
      }, {
        'k': 'stroke-width',
        'v': '1'
      },{
        'k': 'fill',
        'v': POLYGON_STYLES.squares45.url()
      }]
    },{
      id: 'redfill',
      name: 'Fond rouge',
      style: [{
        'k': 'stroke',
        'v': 'black'
      }, {
        'k': 'stroke-width',
        'v': '2'
      },{
        'k': 'fill',
        'v': 'red'
      }]
    },{
      id: 'hexagons',
      name: 'hexagons',
      style: [{
        'k': 'stroke',
        'v': 'black'
      }, {
        'k': 'stroke-width',
        'v': '2'
      },{
        'k': 'fill',
        'v': POLYGON_STYLES.hexagons.url()
      }]
    },{
      id: 'crosses',
      name: 'crosses',
      style: [{
        'k': 'stroke',
        'v': 'black'
      }, {
        'k': 'stroke-width',
        'v': '2'
      },{
        'k': 'fill',
        'v': POLYGON_STYLES.crosses.url()
      }]
    },{
      id: 'caps',
      name: 'caps',
      style: [{
        'k': 'stroke',
        'v': 'black'
      }, {
        'k': 'stroke-width',
        'v': '2'
      },{
        'k': 'fill',
        'v': POLYGON_STYLES.caps.url()
      }]
    },{
      id: 'woven',
      name: 'woven',
      style: [{
        'k': 'stroke',
        'v': 'black'
      }, {
        'k': 'stroke-width',
        'v': '2'
      },{
        'k': 'fill',
        'v': POLYGON_STYLES.woven.url()
      }]
    }],
    'point': [{
      id: 'smallcircleempty',
      name: 'Petit cercle vide',
      path: editSvg.circlePath,
      radius: 10,
      style: [{
        'k': 'stroke',
        'v': 'black'
      }, {
        'k': 'stroke-width',
        'v': '2'
      },{
        'k': 'fill',
        'v': 'none'
      }]
    },{
      id: 'bigcircleempty',
      name: 'Grand cercle vide',
      path: editSvg.circlePath,
      radius: 18,
      style: [{
        'k': 'stroke',
        'v': 'black'
      }, {
        'k': 'stroke-width',
        'v': '2'
      },{
        'k': 'fill',
        'v': 'none'
      }]
    },{
      id: 'smallcircle',
      name: 'Petit cercle plein',
      path: editSvg.circlePath,
      radius: 10,
      style: [{
        'k': 'stroke',
        'v': 'grey'
      }, {
        'k': 'stroke-width',
        'v': '2'
      },{
        'k': 'fill',
        'v': 'grey'
      }]
    },{
      id: 'bigcircle',
      name: 'Grand cercle',
      path: editSvg.circlePath,
      radius: 18,
      style: [{
        'k': 'stroke',
        'v': 'grey'
      }, {
        'k': 'stroke-width',
        'v': '2'
      },{
        'k': 'fill',
        'v': 'grey'
      }]
    },{
      id: 'circleCross',
      name: 'Cercle croix',
      path: editSvg.circleCrossPath,
      radius: 18,
      style: [{
        'k': 'stroke',
        'v': 'black'
      }, {
        'k': 'stroke-width',
        'v': '2'
      },{
        'k': 'fill',
        'v': 'none'
      }]
    },{
      id: 'ovalempty',
      name: 'Ovale vide',
      path: editSvg.ovalPath,
      radius: 18,
      style: [{
        'k': 'stroke',
        'v': 'black'
      }, {
        'k': 'stroke-width',
        'v': '2'
      },{
        'k': 'fill',
        'v': 'none'
      }]
    },{
      id: 'oval',
      name: 'Ovale',
      path: editSvg.ovalPath,
      radius: 18,
      style: [{
        'k': 'stroke',
        'v': 'grey'
      }, {
        'k': 'stroke-width',
        'v': '2'
      },{
        'k': 'fill',
        'v': 'grey'
      }]
    },{
      id: 'triangleempty',
      name: 'Triangle vide',
      path: editSvg.trianglePath,
      radius: 20,
      style: [{
        'k': 'stroke',
        'v': 'black'
      }, {
        'k': 'stroke-width',
        'v': '3'
      },{
        'k': 'fill',
        'v': 'none'
      }]
    },{
      id: 'triangle',
      name: 'Triangle',
      path: editSvg.trianglePath,
      radius: 20,
      style: [{
        'k': 'stroke',
        'v': 'grey'
      }, {
        'k': 'stroke-width',
        'v': '2'
      },{
        'k': 'fill',
        'v': 'grey'
      }]
    },{
      id: 'squareempty',
      name: 'Carré vide',
      path: editSvg.squarePath,
      radius: 20,
      style: [{
        'k': 'stroke',
        'v': 'black'
      }, {
        'k': 'stroke-width',
        'v': '3'
      },{
        'k': 'fill',
        'v': 'none'
      }]
    },{
      id: 'square',
      name: 'Carré',
      path: editSvg.squarePath,
      radius: 20,
      style: [{
        'k': 'stroke',
        'v': 'grey'
      }, {
        'k': 'stroke-width',
        'v': '2'
      },{
        'k': 'fill',
        'v': 'grey'
      }]
    },{
      id: 'squareDiag',
      name: 'Carré Diag',
      path: editSvg.squareDiagPath,
      radius: 20,
      style: [{
        'k': 'stroke',
        'v': 'black'
      }, {
        'k': 'stroke-width',
        'v': '3'
      },{
        'k': 'fill',
        'v': 'none'
      }]
    },{
      id: 'squareCross',
      name: 'Carré croix',
      path: editSvg.squareCrossPath,
      radius: 20,
      style: [{
        'k': 'stroke',
        'v': 'black'
      }, {
        'k': 'stroke-width',
        'v': '3'
      },{
        'k': 'fill',
        'v': 'none'
      }]
    },{
      id: 'cross',
      name: 'Croix',
      path: editSvg.crossPath,
      radius: 20,
      style: [{
        'k': 'stroke',
        'v': 'black'
      }, {
        'k': 'stroke-width',
        'v': '3'
      },{
        'k': 'fill',
        'v': 'black'
      }]
    },{
      id: 'horizontalRect',
      name: 'horizontalRect',
      path: editSvg.horizontalRectPath,
      radius: 20,
      style: [{
        'k': 'stroke',
        'v': 'black'
      }, {
        'k': 'stroke-width',
        'v': '10'
      },{
        'k': 'fill',
        'v': 'black'
      }]
    },{
      id: 'verticalRect',
      name: 'verticalRect',
      path: editSvg.verticalRectPath,
      radius: 20,
      style: [{
        'k': 'stroke',
        'v': 'black'
      }, {
        'k': 'stroke-width',
        'v': '10'
      },{
        'k': 'fill',
        'v': 'black'
      }]
    },{
      id: 'horizontalArrow',
      name: 'horizontalArrow',
      path: editSvg.horizontalArrowPath,
      radius: 100,
      style: [{
        'k': 'stroke',
        'v': 'black'
      }, {
        'k': 'stroke-width',
        'v': '4'
      },{
        'k': 'fill',
        'v': 'black'
      }]
    },{
      id: 'verticalArrow',
      name: 'verticalArrow',
      path: editSvg.verticalArrowPath,
      radius: 100,
      style: [{
        'k': 'stroke',
        'v': 'black'
      }, {
        'k': 'stroke-width',
        'v': '4'
      },{
        'k': 'fill',
        'v': 'black'
      }]
    }]};


    var XAPI_URL = 'http://overpass-api.de/api/interpreter?data=';

    // Public API here
    return {
      XAPI_URL: XAPI_URL,
      QUERY_LIST: QUERY_LIST,
      POLYGON_STYLES: POLYGON_STYLES,
      STYLES: STYLES,
      leaflet: leafletConf
    };
  }]);
