(function() {
    'use strict';


    /**
     * @ngdoc service
     * @name accessimapEditeurDerApp.geometryutils
     * @description
     * # geometryutils
     * Service in the accessimapEditeurDerApp.
     */
    function geometryutils() {

        /**
         * @ngdoc method
         * @name  distance
         * @methodOf accessimapEditeurDerApp.geometryutils
         * @description 
         * Return the distance between two points
         * @param  {Point} point1 Coordinates [x,y]
         * @param  {Point} point2 Coordinates [x,y]
         * @return {float}        Distance between the points
         */
        this.distance = function(point1, point2) {
            var distance = Math.sqrt(Math.pow((point1[0] - point2[0]), 2) 
                                    + Math.pow((point1[1] - point2[1]), 2));

            return distance;
        };

        /**
         * @ngdoc method
         * @name  nearest
         * @methodOf accessimapEditeurDerApp.geometryutils
         * 
         * @description 
         * Return the nearest point of a targetPoint 
         * 
         * @param  {Point} targetPoint  
         * Coordinates [x,y]
         * 
         * @param  {[Point]} points
         * Array of coordinates
         * 
         * @return {Point}
         * Coordinates [x,y] of the nearest point
         */
        this.nearest = function(targetPoint, points) {
            var nearestPoint,
                _this = this;
            
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

        /**
         * @ngdoc method
         * @name  realCoordinates
         * @methodOf accessimapEditeurDerApp.geometryutils
         * @param  {[type]} transform   [description]
         * @param  {[type]} coordinates [description]
         * @return {[type]}             [description]
         */
        this.realCoordinates = function(transform, coordinates) {
            
            // var transform = d3.transform(d3.select('#map-layer')
            //                                 .attr('transform')),
            var translate = transform.translate,
                scale = transform.scale[0],
                realCoordinates = [];

            realCoordinates[0] = (coordinates[0] - translate[0]) / scale;
            realCoordinates[1] = (coordinates[1] - translate[1]) / scale;

            return realCoordinates;
        };

        /**
         * @ngdoc method
         * @name  angle
         * @methodOf accessimapEditeurDerApp.geometryutils
         * @param  {integer} cx X coordinate of the first point
         * @param  {integer} cy Y coordinate of the first point
         * @param  {integer} ex X coordinate of the second point
         * @param  {integer} ey Y coordinate of the second point
         * @return {integer}    angle, in degrees, between the two points
         */
        this.angle = function(cx, cy, ex, ey) {
            var dy = ey - cy,
                dx = ex - cx,
                theta = Math.atan2(dy, dx);
            theta *= 180 / Math.PI;
            //if (theta < 0) theta = 360 + theta; // range [0, 360)
            return theta;
        };

    }

    angular.module(moduleApp)
        .service('geometryutils', geometryutils);
})();