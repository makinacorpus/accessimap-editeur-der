(function() {
    'use strict';

    /**
     * @ngdoc service
     * @name accessimapEditeurDerApp.style
     * @description
     * # style
     * Service in the accessimapEditeurDerApp.
     */
    function style() {
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
            $('#changeArrowsModal').modal('show');
            feature.classed('styleEdition', true);
        };

        this.emptyNearFeature = function(feature, scope) {

            var emptyCircleExists = d3.select('.c' + feature.attr('data-link')).node();

            if (emptyCircleExists) {
                emptyCircleExists.remove();
            } else {
                var el = feature.node(),
                    bbox = el.getBBox(),
                    transformString = null || feature.attr('transform'),
                    emptyArea = el.cloneNode(true),
                    bbox = el.getBBox();

                d3.select(emptyArea)
                    .classed('c' + feature.attr('data-link'), true)
                    .classed('notDeletable', true)
                    .attr('transform', transformString)
                    .attr('iid', null)
                    .attr('fill', 'none')
                    .attr('stroke', 'white')
                    .attr('stroke-width', '20');
                el.parentNode.insertBefore(emptyArea, el);
            }
        };

        this.textEmptyNearFeature = function(feature, scope) {

            var emptyCircleExists = d3.select('.c' + feature.attr('data-link')).node();

            if (emptyCircleExists) {
                emptyCircleExists.remove();
            } else {
                var el = feature.node(),
                    bbox = el.getBBox(),
                    radius = Math.max(bbox.height, bbox.width) / 2 + 14,
                    rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                    
                d3.select(rect)
                    .classed('c' + feature.attr('data-link'), true)
                    .classed('link_' + feature.attr('data-link'), true)
                    .classed('notDeletable', true)
                    .attr('x', bbox.x - 7)
                    .attr('y', bbox.y - 7)
                    .attr('width', bbox.width + 14)
                    .attr('height', bbox.height + 14)
                    .attr('fill', 'white');
                el.parentNode.insertBefore(rect, el);
            }
        };

        this.changeColor = function(feature, scope) {
            scope.styleChoices = scope.styles.polygon;
            var style = $.grep(scope.styleChoices, function(style) {
                return style.id == feature.attr('e-style');
            }),
                color = $.grep(scope.colors, function(color) {
                return color.color == feature.attr('e-color');
            });
            scope.styleChosen = style[0];
            scope.colorChosen = color[0];

            $('#changeColorModal').modal('show');
            feature.classed('styleEdition', true);
        };

        this.changePattern = function(feature, scope) {
            scope.styleChoices = scope.styles.polygon;
            var style = $.grep(scope.styleChoices, function(style) {
                return style.id == feature.attr('e-style');
            }),
                color = $.grep(scope.colors, function(color) {
                return color.color == feature.attr('e-color');
            });
            scope.styleChosen = style[0];
            scope.colorChosen = color[0];

            $('#changePatternModal').modal('show');
            feature.classed('styleEdition', true);
        };

    }

    angular.module(moduleApp)
        .service('style', style);
})();