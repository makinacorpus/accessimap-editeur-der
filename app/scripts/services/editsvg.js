'use strict';

/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.editSvg
 * @description
 * # editSvg
 * Service in the accessimapEditeurDerApp.
 */
angular.module('accessimapEditeurDerApp')
  .service('editSvg', function() {
    this.circlePath = function(cx, cy, r) {
      var d = 'M ' + cx + ' ' + cy;
          d += ' m -' + r + ', 0';
          d += ' a ' + r + ',' + r + ' 0 1,0 ' + r * 2 + ',0';
          d += ' a ' + r + ',' + r + ' 0 1,0 -' + r * 2 + ',0';
      return d;
    };

    this.trianglePath = function(cx, cy, r) {
      var d = 'M ' + (cx - r / 2) + ' ' + cy;
          d += ' L' + cx + ' ' + (cy - Math.sqrt(3 * r * r / 4));
          d += ' L' + (cx + r / 2) + ' ' + cy;
          d += ' Z';
      return d;
    };

    this.squarePath = function(cx, cy, r) {
      var d = 'M ' + (cx - r / 2) + ' ' + (cy - r / 2);
          d += ' v' + r;
          d += ' h' + r;
          d += ' v' + (-r);
          d += ' Z';
      return d;
    };

    this.squareDiagPath = function(cx, cy, r) {
      var d = 'M ' + (cx - r / 2) + ' ' + (cy - r / 2);
          d += ' v' + r;
          d += ' h' + r;
          d += ' v' + (-r);
          d += ' Z';
          d += ' M ' + (cx - r / 2) + ' ' + (cy - r / 2);
          d += ' L ' + (cx + r / 2) + ' ' + (cy + r / 2);
          d += ' Z';
      return d;
    };

    this.squareCrossPath = function(cx, cy, r) {
      var d = 'M ' + (cx - r / 2) + ' ' + (cy - r / 2);
          d += ' v' + r;
          d += ' h' + r;
          d += ' v' + (-r);
          d += ' Z';
          d += ' M ' + (cx - r / 2) + ' ' + (cy - r / 2);
          d += ' L ' + (cx + r / 2) + ' ' + (cy + r / 2);
          d += ' Z';
          d += ' M ' + (cx - r / 2) + ' ' + (cy + r / 2);
          d += ' L ' + (cx + r / 2) + ' ' + (cy - r / 2);
          d += ' Z';
      return d;
    };

    this.crossPath = function(cx, cy, r) {
      var d = 'M ' + (cx - r / 2) + ' ' + cy;
          d += ' h' + r;
          d += ' Z';
          d += 'M ' + cx + ' ' + (cy - r / 2);
          d += ' v' + r;
          d += ' Z';
      return d;
    };

    this.horizontalRectPath = function(cx, cy, r) {
      var d = 'M ' + (cx - r / 2) + ' ' + cy;
          d += ' h' + r;
          d += ' Z';
      return d;
    };

    this.verticalRectPath = function(cx, cy, r) {
      var d = 'M ' + cx + ' ' + (cy - r / 2);
          d += ' v' + r;
          d += ' Z';
      return d;
    };
  });
