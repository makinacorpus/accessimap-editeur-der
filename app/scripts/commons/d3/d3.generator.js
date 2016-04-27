
/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.GeneratorService
 * 
 * @description
 * Service providing function to draw lines, cardinal & polygon
 */
(function() {
    'use strict';

    function GeneratorService() {

        this.lineFunction = d3.svg.line()
                                        .x(function(d) { return d[0]; })
                                        .y(function(d) { return d[1]; })
                                        .interpolate('linear');

        this.cardinalLineFunction = d3.svg.line()
                                        .x(function(d) { return d[0]; })
                                        .y(function(d) { return d[1]; })
                                        .interpolate('cardinal');

        this.polygonFunction = d3.svg.line()
                                        .x(function(d) { return d[0]; })
                                        .y(function(d) { return d[1]; })
                                        .interpolate('linear-closed');
                                     
        this.pathFunction = {
            'line': this.lineFunction,
            'polygon': this.polygonFunction
        };

    }

    angular.module(moduleApp)
          .service('GeneratorService', GeneratorService);

})();