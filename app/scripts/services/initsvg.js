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

    this.createSvg = function(id, width, height) {
      return d3.select(id).append('svg')
               .attr('width', width + 'mm')
               .attr('height', height + 'mm')
               .attr('viewBox', '0 0 ' + (width / 0.283) + ' ' + (height / 0.283));
    };

    this.createMap = function(width, height) {
      return this.createSvg('#map', width, height);
    };
    this.createLegend = function(width, height) {
      return this.createSvg('#legend', width, height);
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
            .attr('style', 'fill:none;stroke:#000000;stroke-width:2.5px;stroke-opacity:1');
    };

    this.createMargin = function(target, width, height) {
      var w40 = width - 40,
          h40 = height - 40;

      var marginGroup = target.append('g')
          .attr('width', width)
          .attr('height', height);

      marginGroup.append('path')
          .attr('d', function() {
            var outer = 'M 0 0 L 0 ' + height + ' L ' + width + ' ' + height + ' L ' + width + ' 0 L 0 0 z ';
            var inner = 'M 40 40 L ' + w40 + ' 40 L ' + w40 + ' ' + h40 + ' L 40 ' + h40 + ' L 40 40 z';
            return outer + inner;
          })
          .attr('style', 'opacity:1;fill:#ffffff;fill-opacity:1')
          .classed('notDeletable', true);

      marginGroup.append('path')
          .attr('d', function() {
            return 'M 40 40 L ' + w40 + ' 40 L ' + w40 + ' ' + h40 + ' L 40 ' + h40 + ' L 40 40 z';
          })
          .attr('style', 'fill:none;stroke:#000000;stroke-width:2.5px;stroke-opacity:1')
          .classed('notDeletable', true);
    };
  });
