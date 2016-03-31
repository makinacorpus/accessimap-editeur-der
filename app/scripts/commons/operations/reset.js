
/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.reset
 * @description
 * # reset
 * Service in the accessimapEditeurDerApp.
 */
(function() {
    'use strict';

    function reset() {

        this.resetActions = function() {
            d3.selectAll('path:not(.menu-segment)')
                .on('click', function() {
                });
            d3.selectAll('svg')
                .on('click', function() {
                });
            d3.select('body')
                .on('keydown', function() {
                });
            d3.selectAll('path')
                .attr('marker-mid', null);
            //$('#der').css('cursor', 'auto');

            d3.selectAll('.ongoing').remove();

            d3.selectAll('.blink').classed('blink', false);
            d3.selectAll('.edition').classed('edition', false);
            d3.selectAll('.styleEdition').classed('styleEdition', false);
            d3.selectAll('.highlight').classed('highlight', false);
        };

    }

    angular.module('accessimapEditeurDerApp')
        .service('reset', reset);
        
})();