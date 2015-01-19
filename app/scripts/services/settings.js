'use strict';

/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.settings
 * @description
 * # settings
 * Factory in the accessimapEditeurDerApp.
 */
angular.module('accessimapEditeurDerApp')
  .factory('settings', function () {

    var leaflet_conf = {
        GLOBAL_MAP_CENTER: [1.44, 43.6], // [lon, lat]
        GLOBAL_MAP_DEFAULT_ZOOM: 13,
    };

    var QUERY_LIST = [{
      id: 'trottoirs',
      name: 'Trottoirs',
      query: '["footway"="sidewalk"]'
    }, {
      id: 'ppietons',
      name: 'Passages piétons',
      query: '["footway"="crossing"]'
    }, {
      id: 'principales',
      name: 'Routes principales',
      query: '["highway"~"motorway|trunk|primary|secondary"]'
    }, {
      id: 'rues',
      name: 'Toutes les rues',
      query: '["highway"]["footway"!="sidewalk"]["footway"!="crossing"]["area"!="yes"]'
    }];

    var STYLES = [{
      id: 'wide',
      name: 'Large',
      style: [{
        'k': 'stroke',
        'v': 'black'
      }, {
        'k': 'stroke-width',
        'v': '4'
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
        'k': 'stroke-dasharray',
        'v': '1, 15'
      }]
    }];


    var XAPI_URL = 'http://overpass-api.de/api/interpreter?data=';

    // Public API here
    return {
      XAPI_URL: XAPI_URL,
      QUERY_LIST: QUERY_LIST,
      STYLES: STYLES,
      leaflet: leaflet_conf
    };
  });
