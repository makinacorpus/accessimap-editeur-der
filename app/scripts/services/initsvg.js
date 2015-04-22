'use strict';

/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.initSvg
 * @description
 * # initSvg
 * Service in the accessimapEditeurDerApp.
 */
angular.module('accessimapEditeurDerApp')
  .service('initSvg', function() {
    this.createMap = function(width, height) {
      return d3.select('#map').append('svg')
               .attr('width', width)
               .attr('height', height);
    };

    this.createLegend = function(width, height) {
      return d3.select('#legend').append('svg')
               .attr('width', width)
               .attr('height', height);
    };
  });
