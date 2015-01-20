'use strict';

/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.exportService
 * @description
 * # exportService
 * Service in the accessimapEditeurDerApp.
 */
angular.module('accessimapEditeurDerApp')
  .service('exportService', function () {

    this.mapExport = function() {
      d3.select(".tiles").selectAll("*").remove();
      exportSvg();
    }

  });
