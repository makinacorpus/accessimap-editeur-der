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
                var transformString = null || feature.attr('transform');
                var emptyArea = el.cloneNode(true);
                var bbox = el.getBBox();

                d3.select(emptyArea)
                    .classed('c' + feature.attr('iid'), true)
                    .classed('notDeletable', true)
                    .attr('transform', transformString)
                    .attr('iid', null)
                    .attr('fill', 'white')
                    .attr('stroke', 'white')
                    .attr('stroke-width', '20');
                el.parentNode.insertBefore(emptyArea, el);
            }
        };

        this.textEmptyNearFeature = function(feature, scope) {

            var emptyCircleExists = d3.select('.c' + feature.attr('iid')).node();

            if (emptyCircleExists) {
                emptyCircleExists.remove();
            } else {
                var el = feature.node();
                var bbox = el.getBBox();

                var radius = Math.max(bbox.height, bbox.width) / 2 + 10;
                var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                d3.select(rect)
                    .classed('c' + feature.attr('iid'), true)
                    .classed('notDeletable', true)
                    .attr('x', bbox.x - 5)
                    .attr('y', bbox.y - 5)
                    .attr('width', bbox.width + 10)
                    .attr('height', bbox.height + 10)
                    .attr('fill', 'white');
                el.parentNode.insertBefore(rect, el);
            }
        };

        this.changeColor = function(feature, scope) {

            $('#changeColorModal').modal('show');
            feature.classed('styleEdition', true);
        };

        this.changePattern = function(feature, scope) {

            $('#changePatternModal').modal('show');
            feature.classed('styleEdition', true);
        };

    });
