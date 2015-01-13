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
        GLOBAL_MAP_CENTER: [43.6, 1.44],
        GLOBAL_MAP_DEFAULT_ZOOM: 13,
    };

    var QUERY_LIST = {
          name: 'trottoirs',
          query: '"footway"="sidewalk"'
    };

    var XAPI_URL = 'http://overpass-api.de/api/interpreter?data=';

    // Public API here
    return {
      XAPI_URL: XAPI_URL,
      QUERY_LIST: QUERY_LIST,
      leaflet: leaflet_conf
    };
  });
