(function() {
    'use strict';


    /**
     * @ngdoc service
     * @name accessimapEditeurDerApp.geometryutils
     * 
     * @description
     * Useful functions for calc distances, angles, ...
     */
    function geometryutils() {

        this.distance         = distance ;
        this.nearest          = nearest ;
        this.realCoordinates  = realCoordinates ;
        this.angle            = angle ;
        this.extendPath       = extendPath ;
        this.getPathDirection = getPathDirection ;

        /**
         * @ngdoc method
         * @name  distance
         * @methodOf accessimapEditeurDerApp.geometryutils
         * 
         * @description 
         * Return the distance between two points
         * 
         * @param  {Point} point1 
         * Coordinates [x,y]
         * 
         * @param  {Point} point2 
         * Coordinates [x,y]
         * 
         * @return {float}        
         * Distance between the points
         */
        function distance(point1, point2) {
            var distance = Math.sqrt(Math.pow((point1[0] - point2[0]), 2) 
                                    + Math.pow((point1[1] - point2[1]), 2));

            return distance;
        }

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
        function nearest(targetPoint, points) {
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
        }

        /**
         * @ngdoc method
         * @name  realCoordinates
         * @methodOf accessimapEditeurDerApp.geometryutils
         * 
         * @param  {[type]} transform   [description]
         * 
         * @param  {[type]} coordinates [description]
         * 
         * @return {[type]}             [description]
         */
        function realCoordinates(transform, coordinates) {
            
            // var transform = d3.transform(d3.select('#map-layer')
            //                                 .attr('transform')),
            var translate = transform.translate,
                scale = transform.scale[0],
                realCoordinates = [];

            realCoordinates[0] = (coordinates[0] - translate[0]) / scale;
            realCoordinates[1] = (coordinates[1] - translate[1]) / scale;

            return realCoordinates;
        }

        /**
         * @ngdoc method
         * @name  angle
         * @methodOf accessimapEditeurDerApp.geometryutils
         * 
         * @param  {integer} cx 
         * X coordinate of the first point
         * 
         * @param  {integer} cy 
         * Y coordinate of the first point
         * 
         * @param  {integer} ex 
         * X coordinate of the second point
         * 
         * @param  {integer} ey 
         * Y coordinate of the second point
         * 
         * @return {integer}    
         * angle, in degrees, between the two points
         */
        function angle(cx, cy, ex, ey) {
            var dy = ey - cy,
                dx = ex - cx,
                theta = Math.atan2(dy, dx);
            theta *= 180 / Math.PI;
            //if (theta < 0) theta = 360 + theta; // range [0, 360)
            return theta;
        }

        /**
         * @ngdoc method
         * @name  extendPath
         * @methodOf accessimapEditeurDerApp.geometryutils
         *
         * @description
         * Extend a path composed by two points
         * 
         * Use Thales theorem to calculate the new coordinates
         *
         * Upon the direction path, we add / substract the extended coordinates
         * 
         * @param  {Array} point1
         * First point of the path
         * 
         * @param  {Array} point2
         * Second point of the path
         * 
         * @param  {float} extension
         * Length to add to each side of the path
         * 
         * @return {Array}
         * Array of points extended drawing the new path, 
         * in the same order than [ point1, point2 ]
         * 
         */
        function extendPath(point1, point2, extension) {

            var initialDistance = distance(point1,point2),
                extendedPath = [],

                vectorExtensionX = ((point1[0] - point2[0]) / initialDistance) * extension,
                vectorExtensionY = ((point1[1] - point2[1]) / initialDistance) * extension;
                
            extendedPath[0] = [ point1[0] + vectorExtensionX, point1[1] + vectorExtensionY ]
            extendedPath[1] = [ point2[0] - vectorExtensionX, point2[1] - vectorExtensionY ]
            
            return extendedPath;
        }

        /**
         * @ngdoc method
         * @name  getPathDirection
         * @methodOf accessimapEditeurDerApp.geometryutils
         *
         * @description 
         * Knowing the y axis is from top to bottom, 
         * and x axis is from left to right,
         * 
         * Calculate the direction of a path : 
         * - top right to bottom left (1)
         * - bottom right to top left (2)
         * - bottom left to top right (3)
         * - top left to bottom right (4)
         * 
         * @param  {Array} point1
         * First point of the path
         * 
         * @param  {Array} point2
         * Second point of the path
         * 
         * @return {integer}
         * The integer matching the direction
         * 
         */
        function getPathDirection(point1, point2) {

            var isLeftToRight,
                isBottomToTop,
                pathDirection;

            // if point1 x is at the left of the point2 x
            if (point1[0] < point2[0])
                isLeftToRight = true;
            else
                isLeftToRight = false;

            // if point1 y is above the point2 y
            if (point1[1] < point2[1])
                isBottomToTop = false;
            else
                isBottomToTop = true;

            if (! isLeftToRight && ! isBottomToTop) 
                pathDirection = 1
            else if (! isLeftToRight && isBottomToTop) 
                pathDirection = 2
            else if (isLeftToRight && isBottomToTop) 
                pathDirection = 3
            else if (isLeftToRight && ! isBottomToTop) 
                pathDirection = 4

            return pathDirection;

        }

    }

    angular.module(moduleApp).service('geometryutils', geometryutils);
})();