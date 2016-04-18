
/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.NominatimService
 * @requires $http
 * @requires $q
 * @requires accessimapEditeurDerApp.settings
 * @description
 * Provide functions to get information on nominatim
 */
(function() {
    'use strict';

    function NominatimService($http, $q, settings) {

        this.retrieveData = retrieveData;

        /**
         * @ngdoc method
         * @name  retrieveData
         * @methodOf accessimapEditeurDerApp.NominatimService
         * @description 
         * Retrieve data from OSM for a specific point, and display the information on the svg element
         * @param  {Object} point         Geographic point [lng, lat]
         * @param  {Object} queryChosen   Query to ask to nominatim : shop, park, ...
         * @return {Promise} Promise with data for successCallback
         */
        function retrieveData(point, queryChosen) {

            var deferred = $q.defer(),
                mapS, mapW, mapN, mapE;

            if (point) {
                mapS = parseFloat(point[1]) - 0.00005;
                mapW = parseFloat(point[0]) - 0.00005;
                mapN = parseFloat(point[1]) + 0.00005;
                mapE = parseFloat(point[0]) + 0.00005;
            } else {
                var boundsNW = _projection.invert([0, 0]),
                    boundsSE = _projection.invert([_width, _height]);
                mapS = boundsSE[1];
                mapW = boundsNW[0];
                mapN = boundsNW[1];
                mapE = boundsSE[0];
            }
            var url = settings.XAPI_URL + '[out:xml];(';

            for (var i = 0; i < queryChosen.query.length; i++) {
                url += queryChosen.query[i];
                url += '(' + mapS + ',' + mapW + ',' + mapN + ',' + mapE + ');';
            }
            url += ');out body;>;out skel qt;';
            $http.get(url)
                .success(function successCallback(data) {

                    var osmGeojson = osmtogeojson(new DOMParser().parseFromString(data, 'text/xml'));

                    // osmtogeojson writes polygon coordinates in anticlockwise order, not fitting the geojson specs.
                    // Polygon coordinates need therefore to be reversed
                    osmGeojson.features.forEach(function(feature, index) {

                        if (feature.geometry.type === 'Polygon') {
                            var n = feature.geometry.coordinates.length;
                            feature.geometry.coordinates[0].reverse();

                            if (n > 1) {
                                for (var i = 1; i < n; i++) {
                                    var reversedCoordinates = feature.geometry.coordinates[i].slice().reverse();
                                    osmGeojson.features[index].geometry.coordinates[i] = reversedCoordinates;
                                }
                            }
                        }

                        if (feature.geometry.type === 'MultiPolygon') {
                            // Split it in simple polygons
                            feature.geometry.coordinates.forEach(function(coords) {
                                var n = coords.length;
                                coords[0].reverse();

                                if (n > 1) {
                                    for (var i = 1; i < n; i++) {
                                        coords[i] = coords[i].slice().reverse();
                                    }
                                }
                                osmGeojson.features.push(
                                    {
                                        'type': 'Feature',
                                        'properties': osmGeojson.features[index].properties,
                                        'geometry': {
                                            'type': 'Polygon', 
                                            'coordinates': coords
                                        }
                                    });
                            });
                        }
                    });
                    deferred.resolve(osmGeojson);
                }) 
                .error(deferred.reject);
            
            return deferred.promise;

        }
        /*

        if (queryChosen.id === 'poi') {
            osmGeojson.features = [osmGeojson.features[0]];

            if (osmGeojson.features[0]) {
                geojsonToSvg(osmGeojson, 
                                undefined, 
                                'node_' + osmGeojson.features[0].properties.id, 
                                true, 
                                queryChosen, 
                                styleChosen, 
                                styleChoices, 
                                colorChosen, 
                                checkboxModel, 
                                rotationAngle);
            }

        } else {
            geojsonToSvg(osmGeojson, 
                        undefined, 
                        undefined, 
                        null, 
                        queryChosen, 
                        styleChosen, 
                        styleChoices, 
                        colorChosen, 
                        checkboxModel, 
                        rotationAngle);
        }
        */

                
    }

    angular.module(moduleApp).service('NominatimService', NominatimService);

    NominatimService.$inject = ['$http', '$q', 'settings'];

})();