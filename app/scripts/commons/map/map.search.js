
/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.SearchService
 * 
 * @requires $http
 * @requires $q
 * @requires accessimapEditeurDerApp.settings
 * 
 * @description
 * Provide functions to get information on nominatim
 */
(function() {
    'use strict';

    function SearchService($http, $q, settings) {

        this.retrieveData  = retrieveData;
        this.searchAddress = searchAddress;

        /**
         * @ngdoc method
         * @name  retrieveData
         * @methodOf accessimapEditeurDerApp.SearchService
         * 
         * @description 
         * Retrieve data from overpass for a specific point, 
         * and display the information on the svg element
         * 
         * @param  {Object} point         
         * Geographic point [lng, lat]
         * 
         * @param  {Object} queryChosen   
         * Query to ask to nominatim : shop, park, ...
         * 
         * @return {Promise} 
         * Promise with data for successCallback
         */
        function retrieveData(point, queryChosen) {

            var deferred = $q.defer(),
                mapS, mapW, mapN, mapE;

            if (Array.isArray(point) && point.length === 2) {
                mapS = parseFloat(point[1]) - 0.00005;
                mapW = parseFloat(point[0]) - 0.00005;
                mapN = parseFloat(point[1]) + 0.00005;
                mapE = parseFloat(point[0]) + 0.00005;
            } else if (point._southWest && point._northEast) {
                mapS = point._southWest.lat;
                mapW = point._southWest.lng;
                mapN = point._northEast.lat;
                mapE = point._northEast.lng;
            } else {
                throw new Error('Parameter "point" is unacceptable. ' +
                    'Please see the docs to provide an array[x,y] or an object {_southWest,_northEast}.')
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

        /**
         * @ngdoc method
         * @name  searchAddress
         * @methodOf accessimapEditeurDerApp.SearchService
         *
         * @description 
         * Search to nominatim an address
         * 
         * @param  {String} address 
         * Address to search
         * 
         * @return {Promise} 
         * Promise with array of results for successCallback
         * Could be empty, or having one or more results
         * 
         */
        function searchAddress(address) {

            var deferred = $q.defer(),
                url = settings.NOMINATIM_URL + address + '?format=json';

            $http.get(url)
                .success(deferred.resolve)
                .error(deferred.reject);

            return deferred.promise;

        }
                
    }

    angular.module(moduleApp).service('SearchService', SearchService);

    SearchService.$inject = ['$http', '$q', 'settings'];

})();