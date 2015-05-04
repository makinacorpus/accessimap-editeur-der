'use strict';

/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.geometryutils
 * @description
 * # geometryutils
 * Service in the accessimapEditeurDerApp.
 */
angular.module('accessimapEditeurDerApp')
  .service('geometryutils', function () {
      this.distance = function(point1, point2) {
        var distance = Math.sqrt(Math.pow((point1[0] - point2[0]), 2) + Math.pow((point1[1] - point2[1]), 2));
        return distance;
      };

      this.nearest = function(targetPoint, points) {
        var nearestPoint;
        var _this = this;
        points.forEach(function(pt) {
          if(!nearestPoint) {
            nearestPoint = pt;
            var dist = _this.distance(targetPoint, pt);
            nearestPoint[3] = dist;
          } else {
            var dist = _this.distance(targetPoint, pt);
            if(dist < nearestPoint[3]) {
              nearestPoint = pt;
              nearestPoint[3] = dist;
            }
          }
        });
        return nearestPoint;
      };
  });
