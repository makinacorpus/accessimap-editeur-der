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
      id: 'principales',
      name: 'Routes principales',
      query: '["highway"~"motorway|trunk|primary|secondary"]'
    }, {
      id: 'rues',
      name: 'Toutes les rues',
      query: '["highway"]["footway"!="sidewalk"]["area"!="yes"]'
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
      id: 'dashed',
      name: 'Tirets',
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
