'use strict';

/**
 * @ngdoc function
 * @name angularleafletApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularleafletApp
 */
angular.module('angularleafletApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.geojson = [
        {"name": "poly",
        "geojson":
            {
              "type": "FeatureCollection",
              "features": [
                {
                  "type": "Feature",
                  "properties": {},
                  "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                      [
                        [
                          1.4335441589355469,
                          43.5979220538866
                        ],
                        [
                          1.4400672912597654,
                          43.60985526701817
                        ],
                        [
                          1.4544868469238281,
                          43.606996483663224
                        ],
                        [
                          1.4510536193847656,
                          43.597300467515375
                        ],
                        [
                          1.4335441589355469,
                          43.5979220538866
                        ]
                      ]
                    ]
                  }
                }
              ]
            }
        },
        {"name": "point",
        "geojson":
            {
              "type": "FeatureCollection",
              "features": [
                {
                  "type": "Feature",
                  "properties": {},
                  "geometry": {
                    "type": "Point",
                    "coordinates": [
                      1.4218711853027344,
                      43.60177574606796
                    ]
                  }
                }
              ]
            }
        }
    ];

    var map = L.map('map', {center: [43.6, 1.44], zoom: 13});

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: 'OpenStreetMap'
    }).addTo(map);

    $scope.geojson2 = {};
    angular.forEach($scope.geojson, function(data) {
        $scope.geojson2[data.name] = L.geoJson(data.geojson).addTo(map);
        //L.geoJson(geojson).addTo(map);
    });
    console.log($scope.geojson2);

  });
