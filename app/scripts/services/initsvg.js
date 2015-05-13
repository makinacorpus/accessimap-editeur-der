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

    this.createDefs = function(target) {
      target.append('defs')
            .append('marker')
            .attr('orient', 'auto')
            .attr('refY', '0.0')
            .attr('refX', '0.0')
            .attr('id', 'arrowEnd')
            .attr('style', 'overflow:visible')
            .append('path')
            .attr('d', 'M -5,-5 L 0,0 L -5,5')
            .attr('style', 'fill:none;stroke:#000000;stroke-width:1pt;stroke-opacity:1')
    }


    this.createLegend = function(width, height) {
      return d3.select('#legend').append('svg')
               .attr('width', width)
               .attr('height', height);
    };
  });
