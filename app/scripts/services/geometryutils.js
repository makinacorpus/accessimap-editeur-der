'use strict';

/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.geometryutils
 * @description
 * # geometryutils
 * Service in the accessimapEditeurDerApp.
 */
angular.module('accessimapEditeurDerApp')
    .service('geometryutils', function() {
        this.distance = function(point1, point2) {
            var distance = Math.sqrt(Math.pow((point1[0] - point2[0]), 2) + Math.pow((point1[1] - point2[1]), 2));
            return distance;
        };

        this.nearest = function(targetPoint, points) {
            var nearestPoint;
            var _this = this;
            points.forEach(function(pt) {
                var dist = _this.distance(targetPoint, pt);
                if (!nearestPoint) {
                    nearestPoint = pt;
                    nearestPoint[3] = dist;
                } else {
                    if (dist < nearestPoint[3]) {
                        nearestPoint = pt;
                        nearestPoint[3] = dist;
                    }
                }
            });
            return nearestPoint;
        };

        this.isClockwise = function(ring) {
            var sum = 0;
            var i = 1;
            var len = ring.length;
            var prev, cur;
            while (i < len) {
                prev = cur || ring[0];
                cur = ring[i];
                sum += ((cur[0] - prev[0]) * (cur[1] + prev[1]));
                i++;
            }
            return sum > 0;
        };

        this.realCoordinates = function(coordinates) {
            var transform = d3.transform(d3.select('#map-layer').attr('transform'));
            var translate = transform.translate;
            var scale = transform.scale[0];
            var realCoordinates = [];
            realCoordinates[0] = (coordinates[0] - translate[0]) / scale;
            realCoordinates[1] = (coordinates[1] - translate[1]) / scale;
            return realCoordinates;
        };
    });
