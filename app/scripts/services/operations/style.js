'use strict';

/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.style
 * @description
 * # style
 * Service in the accessimapEditeurDerApp.
 */
angular.module('accessimapEditeurDerApp')
    .service('style', function() {
        this.toggleStroke = function(feature, scope) {
            if (feature.attr('stroke')) {
                feature.attr('stroke', null)
                    .attr('stroke-width', null);
            } else {
                feature.attr('stroke', 'black')
                    .attr('stroke-width', '2');
            }
        };

        this.toggleArrow = function(feature, scope) {
            if (feature.attr('marker-end')) {
                feature.attr('marker-end', null);
            } else {
                feature.attr('marker-end', 'url(#arrowmarker)');
            }
        };

        this.emptyNearFeature = function(feature, scope) {

            var emptyCircleExists = d3.select('.c' + feature.attr('iid')).node();

            if (emptyCircleExists) {
                emptyCircleExists.remove();
            } else {
                var el = feature.node();
                var bbox = el.getBBox();

                var radius = Math.max(bbox.height, bbox.width) / 2 + 10;
                var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                d3.select(circle)
                    .classed('c' + feature.attr('iid'), true)
                    .classed('notDeletable', true)
                    .attr('cx', bbox.x + bbox.width / 2)
                    .attr('cy', bbox.y + bbox.height / 2)
                    .attr('r', radius)
                    .attr('fill', 'white');
                el.parentNode.insertBefore(circle, el);
            }
        };

        this.changeColor = function(feature, scope) {

            $('#changeColorModal').modal('show')
            feature.classed('styleEdition', true)
        };

        this.changePattern = function(feature, scope) {

            $('#changePatternModal').modal('show')
            feature.classed('styleEdition', true)
        };

    });
