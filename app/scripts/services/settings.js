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
      id: 'trottoirs',
      name: 'Trottoirs',
      type: 'line',
      query: 'way["footway"="sidewalk"]',
      icon: 'road'
    }, {
      id: 'ppietons',
      name: 'Passages piétons',
      type: 'line',
      query: 'way["footway"="crossing"]',
      icon: 'road'
    }, {
      id: 'principales',
      name: 'Routes principales',
      type: 'line',
      query: 'way["highway"~"motorway|trunk|primary|secondary"]',
      icon: 'road'
    }, {
      id: 'places',
      name: 'Places',
      type: 'polygon',
      query: 'way["highway"="pedestrian"]["area"="yes"]',
      icon: 'road'
    }, {
      id: 'rues',
      name: 'Toutes les rues',
      type: 'line',
      query: 'way["highway"]["footway"!="sidewalk"]["footway"!="crossing"]["area"!="yes"]',
      icon: 'road'
    }, {
      id: 'trafficSignals',
      name: 'Feux tricolores',
      type: 'point',
      query: 'node["highway"="traffic_signals"]',
      icon: 'street-view'
    }, {
      id: 'batiments',
      name: 'Batiments',
      type: 'polygon',
      query: 'way["building"]["building"!="no"]',
      icon: 'building-o'
    }];

    var POLYGON_STYLES = {
      'bighash': textures.lines().orientation('vertical'),
      'smallhash': textures.lines().orientation('vertical').thicker(),
      'waves': textures.paths().d('waves').thicker(),
      'smalldots': textures.circles(),
      'bigdots': textures.circles().heavier()
    };

    var STYLES = {
    'line': [{
      id: 'straight_1',
      name: 'Trait 1',
      style: [{
        'k': 'stroke',
        'v': 'black'
      }, {
        'k': 'stroke-width',
        'v': '1'
      }, {
        'k': 'fill',
        'v': 'none'
      }]
    },{
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
      }]
    },{
      id: 'dashed21_3',
      name: 'Tirets 21_3',
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
        'v': '6, 3'
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
      }]
    },{
      id: 'dashed61_3',
      name: 'Tirets 61_3',
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
        'v': '18, 3'
      }]
    },{
      id: 'dashed61_5',
      name: 'Tirets 61_5',
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
        'v': '30, 5'
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
      }]
    },{
      id: 'dashed42_2',
      name: 'Tirets 42_2',
      style: [{
        'k': 'stroke',
        'v': 'black'
      }, {
        'k': 'stroke-width',
        'v': '2'
      }, {
        'k': 'fill',
        'v': 'none'
      }, {
        'k': 'stroke-dasharray',
        'v': '8, 4'
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
        'v': 'black'
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
      id: 'smallcircle',
      name: 'Petit cercle vide',
      path: editSvg.circlePath,
      radius: 5,
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
      radius: 5,
      style: [{
        'k': 'stroke',
        'v': 'black'
      }, {
        'k': 'stroke-width',
        'v': '2'
      },{
        'k': 'fill',
        'v': 'black'
      }]
    },{
      id: 'bigcircle',
      name: 'Grand cercle',
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
        'v': 'black'
      }]
    },{
      id: 'circleCross',
      name: 'Cercle croix',
      path: editSvg.circleCrossPath,
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
      id: 'oval',
      name: 'Ovale',
      path: editSvg.ovalPath,
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
      id: 'triangle',
      name: 'Triangle',
      path: editSvg.trianglePath,
      radius: 15,
      style: [{
        'k': 'stroke',
        'v': 'black'
      }, {
        'k': 'stroke-width',
        'v': '2'
      },{
        'k': 'fill',
        'v': 'black'
      }]
    },{
      id: 'square',
      name: 'Carré',
      path: editSvg.squarePath,
      radius: 15,
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
      id: 'squareDiag',
      name: 'Carré Diag',
      path: editSvg.squareDiagPath,
      radius: 15,
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
      radius: 15,
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
      radius: 15,
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
      radius: 15,
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
      id: 'verticalRect',
      name: 'verticalRect',
      path: editSvg.verticalRectPath,
      radius: 15,
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
      id: 'horizontalArrow',
      name: 'horizontalArrow',
      path: editSvg.horizontalArrowPath,
      radius: 15,
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
      radius: 15,
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
