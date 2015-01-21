'use strict';

/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.initSvg
 * @description
 * # initSvg
 * Service in the accessimapEditeurDerApp.
 */
angular.module('accessimapEditeurDerApp')
  .service('initSvg', function () {
    this.createSvg = function(width, height) {
      return d3.select("#map").append("svg")
               .attr("width", width)
               .attr("height", height);
    }
  });
