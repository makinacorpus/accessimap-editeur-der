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

    var FORMATS = {
      'portraitA4': {
        name: 'A4 Portrait',
        width: '210mm',
        height: '297mm'
      },
      'landscapeA4': {
        name: 'A4 Paysage',
        width: '297mm',
        height: '210mm'
      },
      'portraitA3': {
        name: 'A3 Portrait',
        width: '297mm',
        height: '420mm'
      },
      'landscapeA3': {
        name: 'A3 Paysage',
        width: '420mm',
        height: '297mm'
      }
    }

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
      query: ['way["highway"]["highway"!="footway"]["highway"!="cycleway"]["highway"!="path"]["highway"!="steps"]["area"!="yes"]'],
      icon: 'road'
    }, {
      id: 'ruespietonnes',
      name: 'Chemins piétons',
      type: 'line',
      query: ['way["highway"~"footway|cycleway|path|steps"]["area"!="yes"]["footway"!="sidewalk"]["footway"!="crossing"]'],
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
      'waves': textures.paths().d('waves'),
      'smalldots': textures.circles().complement(),
      'smalldotsline': textures.circles().lighter().thicker().complement().strokeWidth(1.1).background('white'),
      'smalldotsthicker': textures.circles().lighter().thicker().complement().strokeWidth(1.1),
      'smalldotsthicker2': textures.circles().lighter().thicker().complement().strokeWidth(1.3),
      'bigdots': textures.circles().fill("grey").heavier().complement(),
      'squares45': textures.lines().orientation("2/8", "6/8").size(20).strokeWidth(1),
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
      id: 'straight_12',
      name: 'Traits parallèles 2',
      style: [{
        'k': 'stroke',
        'v': 'black'
      }, {
        'k': 'stroke-width',
        'v': '12'
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
        'v': '8'
      }, {
        'k': 'stroke-linecap',
        'v': 'round'
      }, {
        'k': 'fill',
        'v': 'none'
      }]
    },{
      id: 'straight_20',
      name: 'Traits parallèles 3',
      style: [{
        'k': 'stroke',
        'v': 'black'
      }, {
        'k': 'stroke-width',
        'v': '20'
      }, {
        'k': 'stroke-linecap',
        'v': 'round'
      }, {
        'k': 'fill',
        'v': 'none'
      }],
      style_inner: [{
        'k': 'stroke',
        'v': POLYGON_STYLES.smalldotsline.url()
      }, {
        'k': 'stroke-width',
        'v': '15'
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
      id: 'bigdots',
      name: 'Points',
      style: [{
        'k': 'stroke',
        'v': 'grey'
      }, {
        'k': 'stroke-width',
        'v': '2'
      },{
        'k': 'fill',
        'v': POLYGON_STYLES.bigdots.url()
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
      id: 'smalldotsthicker2',
      name: 'Petits points rapprochés 2',
      style: [{
        'k': 'stroke',
        'v': 'black'
      }, {
        'k': 'stroke-width',
        'v': '2'
      },{
        'k': 'fill',
        'v': POLYGON_STYLES.smalldotsthicker2.url()
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
      radius: 22,
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
      id: 'triangle',
      name: 'Triangle',
      path: editSvg.trianglePath,
      radius: 22,
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
      radius: 25,
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
      id: 'squareCross',
      name: 'Carré croix',
      path: editSvg.squareCrossPath,
      radius: 25,
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
      id: 'cross',
      name: 'Croix',
      path: editSvg.crossPath,
      radius: 25,
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
      id: 'cross2',
      name: 'Croix2',
      path: editSvg.crossPath,
      radius: 25,
      style: [{
        'k': 'stroke',
        'v': 'black'
      }, {
        'k': 'stroke-width',
        'v': '5'
      },{
        'k': 'fill',
        'v': 'black'
      }]
    },{
      id: 'cross3',
      name: 'Croix3',
      path: editSvg.crossPath,
      radius: 30,
      style: [{
        'k': 'stroke',
        'v': 'black'
      }, {
        'k': 'stroke-width',
        'v': '5'
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
      id: 'horizontalArrowMedium',
      name: 'horizontalArrowMedium',
      path: editSvg.horizontalArrowPath,
      radius: 60,
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
      id: 'horizontalArrowSmall',
      name: 'horizontalArrowSmall',
      path: editSvg.horizontalSmallArrowPath,
      radius: 30,
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
    },{
      id: 'verticalArrowMedium',
      name: 'verticalArrowMedium',
      path: editSvg.verticalArrowPath,
      radius: 60,
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
      id: 'verticalArrowSmall',
      name: 'verticalArrowSmall',
      path: editSvg.verticalSmallArrowPath,
      radius: 30,
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
      FORMATS: FORMATS,
      QUERY_LIST: QUERY_LIST,
      POLYGON_STYLES: POLYGON_STYLES,
      STYLES: STYLES,
      leaflet: leafletConf
    };
  }]);
