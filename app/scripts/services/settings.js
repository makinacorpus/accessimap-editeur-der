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

    var FONTS = [{
        name: 'Braille',
        size: '35px',
        family: 'Braille_2007'
      }, {
        name: 'Arial 32',
        size: '32px',
        family: 'Arial'
      }, {
        name: 'Arial 28',
        size: '28px',
        family: 'Arial'
      }, {
        name: 'Arial 22',
        size: '22px',
        family: 'Arial'
      }, {
        name: 'Arial 18',
        size: '18px',
        family: 'Arial'
      }
    ];

    var COLORS = [{
        name: 'Noir',
        color: 'black',
      }, {
        name: 'Bleu',
        color: 'blue',
      }, {
        name: 'Rouge',
        color: 'red',
      }
    ];

    var FORMATS = {
      'portraitA4': {
        name: 'A4 Portrait',
        width: 210,
        height: 297
      },
      'landscapeA4': {
        name: 'A4 Paysage',
        width: 297,
        height: 210
      },
      'portraitA3': {
        name: 'A3 Portrait',
        width: 297,
        height: 420
      },
      'landscapeA3': {
        name: 'A3 Paysage',
        width: 420,
        height: 297
      }
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
      'bighash_bg': textures.lines().orientation('vertical').background("white"),
      'bighashm45': textures.lines().orientation('6/8'),
      'bighashm45_bg': textures.lines().orientation('6/8').background("white"),
      'bighash45': textures.lines().orientation('2/8'),
      'bighash45_bg': textures.lines().orientation('2/8').background("white"),
      'smallhash': textures.lines().orientation('vertical').thicker(),
      'smallhash_bg': textures.lines().orientation('vertical').thicker().background("white"),
      'smallhashm45': textures.lines().orientation('6/8').thicker(),
      'smallhashm45_bg': textures.lines().orientation('6/8').thicker().background("white"),
      'smallhash45': textures.lines().orientation('2/8').thicker(),
      'smallhash45_bg': textures.lines().orientation('2/8').thicker().background("white"),
      'waves': textures.paths().d('waves'),
      'waves_bg': textures.paths().d('waves').background("white"),
      'smalldots': textures.circles().complement(),
      'smalldots_bg': textures.circles().complement().background("white"),
      'smalldotsline': textures.circles().lighter().thicker().complement().strokeWidth(1.1).background('white'),
      'smalldotsline_bg': textures.circles().lighter().thicker().complement().strokeWidth(1.1).background('white').background("white"),
      'smalldotsthicker': textures.circles().lighter().thicker().complement().strokeWidth(1.1),
      'smalldotsthicker_bg': textures.circles().lighter().thicker().complement().strokeWidth(1.1).background("white"),
      'smalldotsthicker2': textures.circles().lighter().thicker().complement().strokeWidth(1.3),
      'smalldotsthicker2_bg': textures.circles().lighter().thicker().complement().strokeWidth(1.3).background("white"),
      'bigdots': textures.circles().fill('grey').heavier().complement(),
      'bigdots_bg': textures.circles().fill('grey').heavier().complement().background("white"),
      'squares45': textures.lines().orientation('2/8', '6/8').size(20).strokeWidth(1),
      'squares45_bg': textures.lines().orientation('2/8', '6/8').size(20).strokeWidth(1).background("white"),
      'caps': textures.paths().d('caps'),
      'caps_bg': textures.paths().d('caps').background("white"),
      'woven': textures.paths().d('woven'),
      'woven_bg': textures.paths().d('woven').background("white"),
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
      styleInner: [{
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
      styleInner: [{
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
      styleInner: [{
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
      styleInner: [{
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
      styleInner: [{
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
      styleInner: [{
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
      id: 'straight_35',
      name: 'Traits parallèles 4',
      style: [{
        'k': 'stroke',
        'v': 'black'
      }, {
        'k': 'stroke-width',
        'v': '35'
      }, {
        'k': 'stroke-linecap',
        'v': 'round'
      }, {
        'k': 'fill',
        'v': 'none'
      }],
      styleInner: [{
        'k': 'stroke',
        'v': 'white'
      }, {
        'k': 'stroke-width',
        'v': '30'
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
      styleInner: [{
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
      styleInner: [{
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
      styleInner: [{
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
      styleInner: [{
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
      styleInner: [{
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
      styleInner: [{
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
      styleInner: [{
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
      styleInner: [{
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
        'k': 'fill-pattern',
        'v': 'bighash'
      }]
    },{
      id: 'bighash-45',
      name: 'Hachures -45',
      style: [{
        'k': 'fill-pattern',
        'v': 'bighashm45'
      }]
    },{
      id: 'bighash45',
      name: 'Hachures 45',
      style: [{
        'k': 'fill-pattern',
        'v': 'bighash45'
      }]
    },{
      id: 'smallhash',
      name: 'Petites hachures',
      style: [{
        'k': 'fill-pattern',
        'v': 'smallhash'
      }]
    },{
      id: 'smallhashm45',
      name: 'Petites hachures -45',
      style: [{
        'k': 'fill-pattern',
        'v': 'smallhashm45'
      }]
    },{
      id: 'smallhash45',
      name: 'Petites hachures 45',
      style: [{
        'k': 'fill-pattern',
        'v': 'smallhash45'
      }]
    },{
      id: 'waves',
      name: 'Vagues',
      style: [{
        'k': 'fill-pattern',
        'v': 'waves'
      }]
    },{
      id: 'bigdots',
      name: 'Points',
      style: [{
        'k': 'fill-pattern',
        'v': 'bigdots'
      }]
    },{
      id: 'smalldots',
      name: 'Petits points',
      style: [{
        'k': 'fill-pattern',
        'v': 'smalldots'
      }]
    },{
      id: 'smalldotsthicker',
      name: 'Petits points rapprochés',
      style: [{
        'k': 'fill-pattern',
        'v': 'smalldotsthicker'
      }]
    },{
      id: 'smalldotsthicker2',
      name: 'Petits points rapprochés 2',
      style: [{
        'k': 'fill-pattern',
        'v': 'smalldotsthicker2'
      }]
    },{
      id: 'squares45',
      name: 'Quadrillage 45',
      style: [{
        'k': 'fill-pattern',
        'v': 'squares45'
      }]
    },{
      id: 'caps',
      name: 'caps',
      style: [{
        'k': 'fill-pattern',
        'v': 'caps'
      }]
    },{
      id: 'woven',
      name: 'woven',
      style: [{
        'k': 'fill-pattern',
        'v': 'woven'
      }]
    },{
      id: 'redfill',
      name: 'Fond rouge',
      style: [{
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
        'v': 'grey'
      }, {
        'k': 'stroke-width',
        'v': '4'
      },{
        'k': 'fill',
        'v': 'grey'
      }]
    },{
      id: 'horizontalArrowHash',
      name: 'horizontalArrowHash',
      path: editSvg.horizontalArrowPath,
      radius: 100,
      style: [{
        'k': 'stroke-width',
        'v': '0'
      },{
        'k': 'fill',
        'v': POLYGON_STYLES.smallhashm45.url()
      }]
    },{
      id: 'horizontalArrowDots',
      name: 'horizontalArrowDots',
      path: editSvg.horizontalArrowPath,
      radius: 100,
      style: [{
        'k': 'stroke',
        'v': '#343434'
      }, {
        'k': 'stroke-width',
        'v': '2'
      },{
        'k': 'fill',
        'v': POLYGON_STYLES.smalldotsthicker2.url()
      }]
    },{
      id: 'horizontalArrowMedium',
      name: 'horizontalArrowMedium',
      path: editSvg.horizontalArrowPath,
      radius: 60,
      style: [{
        'k': 'stroke',
        'v': 'grey'
      }, {
        'k': 'stroke-width',
        'v': '4'
      },{
        'k': 'fill',
        'v': 'grey'
      }]
    },{
      id: 'horizontalArrowSmall',
      name: 'horizontalArrowSmall',
      path: editSvg.horizontalSmallArrowPath,
      radius: 30,
      style: [{
        'k': 'stroke',
        'v': 'grey'
      }, {
        'k': 'stroke-width',
        'v': '4'
      },{
        'k': 'fill',
        'v': 'grey'
      }]
    },{
      id: 'verticalArrow',
      name: 'verticalArrow',
      path: editSvg.verticalArrowPath,
      radius: 100,
      style: [{
        'k': 'stroke',
        'v': 'grey'
      }, {
        'k': 'stroke-width',
        'v': '4'
      },{
        'k': 'fill',
        'v': 'grey'
      }]
    },{
      id: 'verticalArrowHash',
      name: 'verticalArrowHash',
      path: editSvg.verticalArrowPath,
      radius: 100,
      style: [{
        'k': 'stroke-width',
        'v': '0'
      },{
        'k': 'fill',
        'v': POLYGON_STYLES.smallhashm45.url()
      }]
    }, {
      id: 'verticalArrowDots',
      name: 'verticalArrowDots',
      path: editSvg.verticalArrowPath,
      radius: 100,
      style: [{
        'k': 'stroke',
        'v': '#343434'
      }, {
        'k': 'stroke-width',
        'v': '2'
      },{
        'k': 'fill',
        'v': POLYGON_STYLES.smalldotsthicker2.url()
      }]
    },{
      id: 'verticalArrowMedium',
      name: 'verticalArrowMedium',
      path: editSvg.verticalArrowPath,
      radius: 60,
      style: [{
        'k': 'stroke',
        'v': 'grey'
      }, {
        'k': 'stroke-width',
        'v': '4'
      },{
        'k': 'fill',
        'v': 'grey'
      }]
    },{
      id: 'verticalArrowSmall',
      name: 'verticalArrowSmall',
      path: editSvg.verticalSmallArrowPath,
      radius: 30,
      style: [{
        'k': 'stroke',
        'v': 'grey'
      }, {
        'k': 'stroke-width',
        'v': '4'
      },{
        'k': 'fill',
        'v': 'grey'
      }]
    }]};


    var XAPI_URL = 'http://overpass-api.de/api/interpreter?data=';

    // Public API here
    return {
      XAPI_URL: XAPI_URL,
      FONTS: FONTS,
      COLORS: COLORS,
      FORMATS: FORMATS,
      QUERY_LIST: QUERY_LIST,
      POLYGON_STYLES: POLYGON_STYLES,
      STYLES: STYLES,
      leaflet: leafletConf
    };
  }]);
