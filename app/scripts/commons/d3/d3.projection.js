/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.ProjectionService
 * @description
 * Service used for the 'EditController', and the 'edit' view
 * Provide functions to 
 * - init a map/draw area
 * - draw features
 * - export data
 */
(function() {
    'use strict';

    function ProjectionService() {

        var _projection,
            _width,
            _height;

        this.project = project;
        this.init = init;

        /**
         * @ngdoc method
         * @name  project
         * @methodOf accessimapEditeurDerApp.ProjectionService
         * @param  {[type]} coordinates Coordinates to project in ?
         * @return {Array}          Array of projections
         */
        function project(coordinates) {
            return _projection(coordinates);
        }

        /**
         * @ngdoc method
         * @name  init
         * @methodOf accessimapEditeurDerApp.ProjectionService
         * @param  {integer} width  Width of the d3 div
         * @param  {integer} height Height of the d3 div
         */
        function init(width, height) {
            _width = width;
            _height = height;

            _projection = d3.geo.mercator()
                    .scale(Math.pow(2, 22) / 2 / Math.PI)
                    .translate([_width / 2, _height / 2]);
        }

    }

    angular.module(moduleApp)
        .service('ProjectionService', ProjectionService);

    ProjectionService.$inject = [];

})()
