'use strict';

/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.settings
 * @description
 * # settings
 * Factory in the accessimapEditeurDerApp.
 */
angular.module('accessimapEditeurDerApp')
  .factory('settings', ['editSvg',
    function (editSvg) {

    var leafletConf = {
        GLOBAL_MAP_CENTER: [1.44, 43.6], // [lon, lat]
        GLOBAL_MAP_DEFAULT_ZOOM: 13,
    };

    var QUERY_LIST = [{
      id: 'trottoirs',
      name: 'Trottoirs',
      type: 'line',
      query: 'way["footway"="sidewalk"]'
    }, {
      id: 'ppietons',
      name: 'Passages piétons',
      type: 'line',
      query: 'way["footway"="crossing"]'
    }, {
      id: 'principales',
      name: 'Routes principales',
      type: 'line',
      query: 'way["highway"~"motorway|trunk|primary|secondary"]'
    }, {
      id: 'places',
      name: 'Places',
      type: 'polygon',
      query: 'way["highway"="pedestrian"]["area"="yes"]'
    }, {
      id: 'trafficSignals',
      name: 'Feux tricolores',
      type: 'point',
      query: 'node["highway"="traffic_signals"]'
    }, {
      id: 'rues',
      name: 'Toutes les rues',
      type: 'line',
      query: 'way["highway"]["footway"!="sidewalk"]["footway"!="crossing"]["area"!="yes"]'
    }];

    var POLYGON_STYLES = {
      'bighash': textures.lines().orientation('vertical').thicker(),
      'smallhash': textures.lines().orientation('vertical'),
      'waves': textures.paths().d('waves').thicker(),
      'smalldots': textures.circles(),
      'bigdots': textures.circles().heavier()
    };

    var STYLES = {
    'line': [{
      id: 'straight',
      name: 'Trait',
      style: [{
        'k': 'stroke',
        'v': 'black'
      }, {
        'k': 'stroke-width',
        'v': '4'
      }, {
        'k': 'fill',
        'v': 'none'
      }]
    },{
      id: 'dashed55',
      name: 'Tirets 5 5',
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
        'v': '5, 5'
      }]
    },{
      id: 'dashed33',
      name: 'Tirets 2 2',
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
        'v': '2, 2'
      }]
    },{
      id: 'dashed1010',
      name: 'Tirets 10 10',
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
        'v': '10,10'
      }]
    },{
      id: 'dotted',
      name: 'Ronds',
      style: [{
        'k': 'stroke',
        'v': 'black'
      }, {
        'k': 'stroke-width',
        'v': '10'
      }, {
        'k': 'stroke-linecap',
        'v': 'round'
      }, {
        'k': 'fill',
        'v': 'none'
      }, {
        'k': 'stroke-dasharray',
        'v': '1, 15'
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
    }],
    'point': [{
      id: 'smallcircle',
      name: 'Petit cercle',
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
