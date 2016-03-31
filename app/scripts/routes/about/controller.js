
/**
 * @ngdoc controller
 * @name accessimapEditeurDerApp.controller:AboutController
 * @description
 * Display informations about libraries used & mapping
 */
(function() {
    'use strict';

    function AboutController () {
        this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma',
        ];
    };

    angular.module('accessimapEditeurDerApp')
            .controller('AboutController', AboutController);

})();