(function() {
    'use strict';
    /**
     * @ngdoc overview
     * @name accessimapEditeurDerApp
     * @description
     * Main module of the application.
     */
    var moduleApp = 'accessimapEditeurDerApp';

    window.moduleApp = moduleApp;

    angular
        .module(moduleApp, [
            'ngAnimate',
            'ngCookies',
            'ngResource',
            'ngRoute',
            'ngSanitize',
            'ngTouch',
            'angularSpinner',
            'ui.select',
            'ui.bootstrap',
            'ui.bootstrap-slider',
            'ui.grid',
            'ui.grid.edit',
            'ui.grid.autoResize'
        ])
        .config(function($routeProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: 'scripts/views/home/template.html',
                    controller: 'HomeController',
                    controllerAs: '$ctrl'
                })
                .when('/edit', {
                    templateUrl: 'scripts/views/edit/template.html',
                    controller: 'EditController',
                    controllerAs: '$ctrl'
                })
                .otherwise({
                    redirectTo: '/'
                });
        })
        .config(function(uiSelectConfig) {
            uiSelectConfig.dropdownPosition = 'down';
        });

})();

/**
 * @ngdoc filter
 * @name accessimapEditeurDerApp.filter:layerNotSelected
 * @function
 * 
 * @description
 * Return all the layers not selected from an array of layers 
 * & another of selected layers
 * 
 * Intersection between layers'set and selectedLayer'set
 */
(function() {
    'use strict';

    angular.module(moduleApp)
        .filter('layerNotSelected', function() {
        return function(layers, selectedLayers) {
            var filteredLayers = [];

            angular.forEach(layers, function(layer) {
                var toAdd = true;
                angular.forEach(selectedLayers, function(selectedLayer) {
                    if (layer.id === selectedLayer.id) {
                        toAdd = false;
                    }
                });

                if (toAdd) {
                    filteredLayers.push(layer);
                }
            });

            return filteredLayers;
        };
    });
})();
(function() {
    'use strict';

    /**
     * @ngdoc service
     * @name accessimapEditeurDerApp.editSvg
     * @description
     * # editSvg
     * Service in the accessimapEditeurDerApp.
     */
    function editSvg() {
        this.circlePath = function(cx, cy, r) {
            var d = 'M ' + cx + ' ' + cy;
            d += ' m -' + r + ', 0';
            d += ' a ' + r + ',' + r + ' 0 1,0 ' + r * 2 + ',0';
            d += ' a ' + r + ',' + r + ' 0 1,0 -' + r * 2 + ',0';

            return d;
        };

        this.circleCrossPath = function(cx, cy, r) {
            var d = 'M ' + cx + ' ' + cy;
            d += ' m -' + r + ', 0';
            d += ' a ' + r + ',' + r + ' 0 1,0 ' + r * 2 + ',0';
            d += ' a ' + r + ',' + r + ' 0 1,0 -' + r * 2 + ',0';
            d += ' Z';
            r = r / Math.cos(45 * Math.PI / 180);
            d += ' M ' + (cx - r / 2) + ' ' + (cy - r / 2);
            d += ' L ' + (cx + r / 2) + ' ' + (cy + r / 2);
            d += ' Z';
            d += ' M ' + (cx - r / 2) + ' ' + (cy + r / 2);
            d += ' L ' + (cx + r / 2) + ' ' + (cy - r / 2);
            d += ' Z';

            return d;
        };

        this.ovalPath = function(cx, cy, r) {
            var d = 'M ' + cx + ' ' + cy;
            d += ' m -' + r / 2 + ', 0';
            d += ' a ' + r / 2 + ',' + r + ' 0 1,0 ' + r + ',0';
            d += ' a ' + r / 2 + ',' + r + ' 0 1,0 -' + r + ',0';

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

        this.northOrientation = function(cx, cy, r) {
            var d = 'M ' + (cx + r / 2) + ' ' + (cy + r / 2);
            d += ' h' + (-r);
            d += ' Z';
            d += 'M ' + cx + ' ' + (cy + r / 2);
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

        this.horizontalArrowPath = function(cx, cy, r) {
            var d = 'M ' + cx + ' ' + cy;
            d += ' L' + (cx - 3 * r / 10) + ' ' + (cy - 3 * r / 10);
            d += ' L' + (cx - 3 * r / 10) + ' ' + (cy - 1 * r / 10);
            d += ' L' + (cx - 12 * r / 10) + ' ' + (cy - 1 * r / 10);
            d += ' L' + (cx - 12 * r / 10) + ' ' + (cy + 1 * r / 10);
            d += ' L' + (cx - 3 * r / 10) + ' ' + (cy + 1 * r / 10);
            d += ' L' + (cx - 3 * r / 10) + ' ' + (cy + 3 * r / 10);
            d += ' Z';

            return d;
        };

        this.horizontalSmallArrowPath = function(cx, cy, r) {
            var d = 'M ' + cx + ' ' + cy;
            d += ' L' + (cx - 5 * r / 10) + ' ' + (cy - 4 * r / 10);
            d += ' L' + (cx - 5 * r / 10) + ' ' + (cy - 1 * r / 10);
            d += ' L' + (cx - 12 * r / 10) + ' ' + (cy - 1 * r / 10);
            d += ' L' + (cx - 12 * r / 10) + ' ' + (cy + 1 * r / 10);
            d += ' L' + (cx - 5 * r / 10) + ' ' + (cy + 1 * r / 10);
            d += ' L' + (cx - 5 * r / 10) + ' ' + (cy + 4 * r / 10);
            d += ' Z';

            return d;
        };
    }
    
    angular.module(moduleApp).service('editSvg', editSvg);
})();
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

    angular.module(moduleApp).service('geometryutils', geometryutils);
})();

/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.shareSvg
 * @description
 * # shareSvg
 * Service in the accessimapEditeurDerApp.
 */
(function() {
    'use strict';

    function shareSvg($q) {
        var map,
            legend,
            interactions;

        function setMap(newMap) {
            var deferred = $q.defer();
            map = newMap;

            deferred.resolve();

            return deferred.promise;
        };

        function getMap() {
            var deferred = $q.defer();

            deferred.resolve(map);

            return deferred.promise;
        };

        function setLegend(newLegend) {
            var deferred = $q.defer();
            legend = newLegend;

            deferred.resolve();

            return deferred.promise;
        };

        function getLegend() {
            var deferred = $q.defer();

            deferred.resolve(legend);

            return deferred.promise;
        };

        function setInteractions(newInteractions) {
            var deferred = $q.defer();
            interactions = newInteractions;

            deferred.resolve();

            return deferred.promise;
        };

        function getInteractions() {
            var deferred = $q.defer();

            deferred.resolve(interactions);

            return deferred.promise;
        };

        return {
            setMap: setMap,
            getMap: getMap,
            setLegend: setLegend,
            getLegend: getLegend,
            setInteractions: setInteractions,
            getInteractions: getInteractions
        };
    }

    angular.module(moduleApp).service('shareSvg', shareSvg);

    shareSvg.$inject = ['$q'];
    
})();

/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.generators
 * @description
 * # generators
 * Service in the accessimapEditeurDerApp.
 */
(function() {
    'use strict';

    function generators() {

        this.lineFunction = d3.svg.line()
                                        .x(function(d) { return d[0]; })
                                        .y(function(d) { return d[1]; })
                                        .interpolate('linear');

        this.cardinalLineFunction = d3.svg.line()
                                        .x(function(d) { return d[0]; })
                                        .y(function(d) { return d[1]; })
                                        .interpolate('cardinal');

        this.polygonFunction = d3.svg.line()
                                        .x(function(d) { return d[0]; })
                                        .y(function(d) { return d[1]; })
                                        .interpolate('linear-closed');
                                     
        this.pathFunction = {
            'line': this.lineFunction,
            'polygon': this.polygonFunction
        };

    }

    angular.module(moduleApp)
          .service('generators', generators);

})();

/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.typeOf
 * @description
 * # typeOf
 * Service in the accessimapEditeurDerApp.
 */
(function() {
    'use strict';

    function typeOfFeature() {

        this.getType = function(feature) {
            var nodeType = feature.node().nodeName;

            switch (nodeType) {
                case 'path':
                    var parent = feature.node().parentNode;

                    if (d3.select(parent).classed('vector')) {
                        parent = parent.parentNode;
                    }
                    var parentId = parent.id;

                    switch (parentId) {
                        case 'points-layer':
                            return 'point';
                            break;

                        case 'lines-layer':
                            return 'line';
                            break;

                        /*case 'polygons-layer':
                            return 'polygon';
                            break;
                        */
                        default:
                            return 'polygon';
                    }
                    break;

                case 'circle':
                    return 'circle';
                    break;

                case 'text':
                    return 'text';
                    break;

                default:
                    return null;
            }
        }

    }

    angular.module(moduleApp)
        .service('typeOfFeature', typeOfFeature);

})();
/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.ToasterService
 * @description
 * Service providing functions to display messages to the user.
 *
 * Can be an error message, or just information
 */
(function() {
    'use strict';

    function ToasterService() {

        this.displayError       = displayError;
        this.displayMessage     = displayMessage;
        // this.displayInformation = displayInformation;

        /**
         * @ngdoc method
         * @name  displayError
         * @methodOf accessimapEditeurDerApp.ToasterService
         *
         * @description
         * Display an error message to the user
         *
         * @param  {Error} error
         * Error raised or throwned by the system.
         * 
         */
        function displayError(error) {
            alert(error);            
        }

        /**
         * @ngdoc method
         * @name  displayMessage
         * @methodOf accessimapEditeurDerApp.ToasterService
         *
         * @description
         * Display a message to the user
         *
         * @param  {string} message
         * Message to be displayed
         * 
         */
        function displayMessage(message) {
            alert(message);            
        }

    }

    angular.module(moduleApp).service('ToasterService', ToasterService);

    ToasterService.$inject = [];

})();
/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.UtilService
 * @description
 * Service exposing utils functions
 */
(function() {
    'use strict';

    function UtilService($q) {

        this.convertImgToBase64 = convertImgToBase64;
        this.getiid             = getiid;
        this.uploadFile         = uploadFile;

        /**
         * @ngdoc method
         * @name  convertImgToBase64
         * @methodOf accessimapEditeurDerApp.UtilService
         * 
         * @description
         * Convert a png tile into a base64 image
         *
         * Useful for later edition in software like Inkscape for better display / edition
         * @param  {Object} tile [description]
         */
        function convertImgToBase64(tile) {
            if (tile) {
                var img = new Image();
                img.crossOrigin = 'Anonymous';
                img.src = d3.select(tile).attr('href');
                img.onload = function() {
                    var canvas = document.createElement('CANVAS'),
                        ctx = canvas.getContext('2d');
                    canvas.height = this.height;
                    canvas.width = this.width;
                    ctx.drawImage(this, 0, 0);
                    var dataURL = canvas.toDataURL('image/png');
                    d3.select(tile).attr('href', dataURL);
                };
            }
        }

        var iid = 1;

        /**
         * ngdoc method
         * @name  getiid
         * @methodOf accessimapEditeurDerApp.UtilService
         * 
         * @description 
         * Function returning an unique identifier
         * Useful to store svg element with a uid
         * 
         * @return {integer} Fresh id !
         */
        function getiid() {
            return iid++;
        }

        /**
         * @ngdoc method
         * @name  uploadFile
         * @methodOf accessimapEditeurDerApp.UtilService
         *
         * @description 
         * Get a file and send back the dataUrl with the file type
         * 
         * @param  {Object} element  Input file object
         * @return {Promise}         Promise containing if success an object { type, dataUrl }
         */
        function uploadFile(element) {
            var file = element.files[0],
                fileType = file.type,
                reader = new FileReader(),
                deferred = $q.defer();

            reader.readAsDataURL(file);
            reader.onload = function(e) {
                deferred.resolve({type: fileType, dataUrl: e.target.result })
            };

            reader.onerror = deferred.reject;

            return deferred.promise;
        };        
    }
    
    angular.module(moduleApp).service('UtilService', UtilService);

    UtilService.$inject= ['$q'];

})();
/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.StorageService
 * 
 * @description
 * Service exposing storage functions to allow user retrieve his drawings
 */
(function() {
    'use strict';

    function StorageService() {
        
    }
    
    angular.module(moduleApp)
        .service('StorageService', StorageService);

})();
/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.InteractionService
 * 
 * @description
 * Service providing methods to CRUD interactions
 */
(function() {
    'use strict';

    function InteractionService(UtilService) {

        this.isFeatureInteractive = isFeatureInteractive;
        this.addInteraction       = addInteraction;
        this.setInteraction       = setInteraction;
        this.addFilter            = addFilter;
        this.removeFilter         = removeFilter;
        this.getXMLExport         = getXMLExport;
        
        this.getInteractions = function() { 
            return interactions 
        }
        this.getFilters = function() { 
            return filters 
        }

        var
        /**
         * @ngdoc property
         * @name  interactions
         * @propertyOf accessimapEditeurDerApp.InteractionService
         *
         * @description 
         * Array of interactions
         *
         * An interaction is a feature (point, circle, polygon, ...) that
         * will be attached to a pointer/touch event (click, double click, ...)
         * and play a specific media (sound, vibration, ...)
         * 
         * @type {Array}
         */
        interactions = [],

        /**
         * @ngdoc property
         * @name  filters
         * @propertyOf accessimapEditeurDerApp.InteractionService
         *
         * @description 
         * Array of filters
         *
         * A filter define a specific type of interaction.
         * It's composed by :
         * - a name, useful for display 
         * - a type of interaction : tap, double tap, ...
         * - a protocol : mp3, text-to-speech (tts), ...
         * 
         * @type {Array}
         */
        filters = [{
            id       : 'f1',
            name     : 'Valeur OSM',
            gesture  : 'tap',
            protocol : 'tts'
        }];

        /**
         * @ngdoc method
         * @name  isFeatureInteractive
         * @methodOf accessimapEditeurDerApp.InteractionService
         *
         * @description 
         * Return if the feature is an interactive one
         * 
         * @param  {Object}  feature
         * Feature to be checked
         * 
         * @return {Boolean}
         * True if interactive, false if not
         */
        function isFeatureInteractive(feature) {
            var featureIid = feature.attr('data-link'),
                featurePosition = 
                    interactions.filter(function(row) {
                        return row.id === 'poi-' + featureIid;
                    });


            return interactions.indexOf(featurePosition[0]) >= 0;
        }
        
        /**
         * @ngdoc method
         * @name  addInteraction
         * @methodOf accessimapEditeurDerApp.InteractionService
         *
         * @description
         * Add an interaction on a feature
         * 
         * @param {Object} feature
         * Feature that will be interactive
         */
        function addInteraction(feature) {

            var featureIid = feature.attr('data-link');

            if (!featureIid) {
                featureIid = UtilService.getiid();
                feature.attr('data-link', featureIid);
            }

            // Add the highlight class to the relevant cells of the grid
            // TODO: this method DO NOT change CSS properties...
            // d3.selectAll('.poi-' + featureIid).classed('highlight', true);

            setInteraction('poi-' + featureIid, 'f1', feature.attr('name'));

        }

        /**
         * @ngdoc method
         * @name  setInteraction
         * @methodOf accessimapEditeurDerApp.InteractionService
         *
         * @description 
         * Set an interaction {filter: value} for a feature (id)
         * 
         * @param {String} id
         * Id of the feature
         * 
         * @param {String} filter
         * Category/filter to  [description]
         * @param {[type]} value    [description]
         */
        function setInteraction(id, filter, value) {

            var interaction = interactions.find(function(element) {
                    return element.id === id;
                });

            if (! interaction) {
                interactions.push(
                    {
                        'id': id,
                        'filters': {
                        }
                    });
                interaction = interactions[interactions.length - 1]
            }

            interaction.filters[filter] = value;
        } 

        function addFilter(name, gesture, protocol) {
            filters.push({
                id       : 'f' + (filters.length + 1),
                name     : name,
                gesture  : gesture,
                protocol : protocol
            });
        }

        function removeFilter(id) {
            // first, delete for each interaction the corresponding filter
            interactions.forEach(function deleteCategory(current) {
                delete current.filters[id]
            })
            
            // then remove the filter
            filters = filters.filter(function removeFilter(element, index) {
                return element.id !== id;
            })
        }

        function getXMLExport() {

            var xmlToExport = '<?xml version="1.0" encoding="UTF-8"?>';

            if (filters.length > 0) {

                var nodeXML = d3.select(document.createElement('exportXML')).append('xml'),
                    config = nodeXML.append('config');

                config.append('filters')
                    .selectAll('filter')
                    .data(filters)
                    .enter()
                    .append('filter')
                    .attr('id', function(d) {
                        return d.id;
                    })
                    .attr('name', function(d) {
                        return d.name;
                    })
                    .attr('gesture', function(d) {
                        return d.gesture;
                    })
                    .attr('protocol', function(d) {
                        return d.protocol;
                    })
                    .attr('expandable', function(d) {
                        // return d.expandable;
                        return false; // TODO: qu'est ce qu'expandable ?
                    });

                config.append('pois')
                    .selectAll('poi')
                    .data(interactions)
                    .enter()
                    .append('poi')
                    .attr('id', function(d) {
                        return d.id;
                    })
                    .each(function(d) {

                        // get the bounding box of the current POI,
                        // no matter if it is a drawing or a geojson feature
                        // > no selection of a specific svg, we search in the entire DOM
                        var bbox, poi;
                        d3.selectAll('path')[0]
                            .forEach(function(shape) {
                                if ('poi-' + d3.select(shape).attr('data-link') === d.id) {
                                    bbox = d3.select(shape).node().getBBox();
                                }
                            });

                        poi = d3.select(this).attr('id', d.id);

                        if (bbox) {
                            poi.attr('x', bbox.x);
                            poi.attr('y', bbox.y);
                            poi.attr('width', bbox.width);
                            poi.attr('height', bbox.height);
                        }
                        
                        // exporting actions for the current POI                        
                        var actions = poi.append('actions');
                        d3.keys(d.filters).forEach(function(key) {
                            var currentCategory = filters.find(function(element) {
                                return element.id === key;
                            })
                            actions.append('action')
                                .attr('gesture', currentCategory.gesture)
                                .attr('filter', key)
                                .attr('value', d.filters[key])
                                .attr('protocol', currentCategory.protocol);
                        });
                    });

                xmlToExport += (new XMLSerializer()).serializeToString(nodeXML.node())
                                    .replace(/<xml.*<config>/, '<config>')
                                    .replace('</xml>', '');

            }

            return xmlToExport;
        }
    }

    angular.module(moduleApp).service('InteractionService', InteractionService);

    InteractionService.$inject = ['UtilService'];

})();
/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.FeatureService
 * 
 * @description
 * Service providing actions to manage features
 */
(function() {
    'use strict';

    function FeatureService(InteractionService, geometryutils, generators) {
        
        // this.getType              = getType;
        this.movePath             = movePath;
        this.movePoint            = movePoint;
        this.rotatePath           = rotatePath;
        this.removeObject         = removeObject;
        this.undo                 = undo;
        this.isUndoAvailable      = isUndoAvailable;
        
        this.toggleStroke         = toggleStroke;
        this.toggleArrow          = toggleArrow;
        this.emptyNearFeature     = emptyNearFeature;
        this.textEmptyNearFeature = textEmptyNearFeature;
        this.changeColor          = changeColor;
        this.changePattern        = changePattern;
        this.lineToCardinal       = lineToCardinal;

        this.init                  = init;
        
        // this var retain the last feature deleted
        // useful for cancel this deletion
        // TODO: need to be improved to integrate the history pattern (undo/redo)
        var removedFeature        = null,
            pointsLayer,
            polygonsLayer,
            linesLayer,
            textLayer,
            svgDrawing;

        function init(_svgDrawing) {
            svgDrawing = _svgDrawing;
            pointsLayer   = d3.select(svgDrawing).node().select('g[data-name="points-layer"]');
            polygonsLayer = d3.select(svgDrawing).node().select('g[data-name="polygons-layer"]');
            linesLayer    = d3.select(svgDrawing).node().select('g[data-name="lines-layer"]');
            textLayer     = d3.select(svgDrawing).node().select('g[data-name="text-layer"]');
        }

        function isUndoAvailable() {
            return removedFeature !== null;
        }

        function undo() {
            if (isUndoAvailable()) {
                
                var deletedElement = d3.select('#deletedElement').node(),
                    t = document.createElement('path');

                d3.select(t).attr('id', 'restoredElement');
                deletedElement.parentNode.insertBefore(t, deletedElement);
                d3.select('#restoredElement').node().outerHTML = removedFeature;
                d3.select('#deletedElement').remove();
                removedFeature = null;
            }
        }
        
        function removeFeature(feature) {
            var featuresToUpdate = feature;

            if (feature.attr('data-link')) {
                featuresToUpdate = d3.selectAll('.link_' + feature.attr('data-link'));
            }
            var el = featuresToUpdate.node(),
                t = document.createElement('foreignObject');

            removedFeature = new XMLSerializer().serializeToString(el),
            // scope.updateView();

            d3.select(t).attr('id', 'deletedElement');
            el.parentNode.insertBefore(t, el);
            featuresToUpdate.remove();

        }

        function removeObject(feature) {

            // Some objects should not be deletable
            if (!d3.select(feature).node().classed('notDeletable')) {

                // Remove previous deleted Element placeholder if it exists
                d3.select('#deletedElement').remove();

                if (InteractionService.isFeatureInteractive(feature)) {
                    // var iid = d3.select(feature).node().attr('data-link'),
                    //     featurePosition = scope.interactiveFilters.data.filter(function(row) {
                    //         return row.id === 'poi-' + iid;
                    //     }),
                    //     featureInFilters = scope.interactiveFilters.data.indexOf(featurePosition[0]);
                    if (window.confirm('Ce point est interactif. Voules-vous vraiment le supprimer ?')) {
                        // InteractionService.removeFeature(feature);
                        // scope.removeRow(scope.interactiveFilters.data[featureInFilters]);
                        return removeFeature(feature);
                    } else {
                        return false;
                    }
                } else {
                    return removeFeature(feature);
                }

            }
        }

        /**
         * @ngdoc method
         * @name  getType
         * @methodOf accessimapEditeurDerApp.FeatureService
         *
         * @description 
         * Return the type of a feature
         * 
         * @param  {Object} feature
         * Feature to be analyzed
         * 
         * @return {string}
         * Type in this set :
         * - point
         * - line
         * - polygon
         * - circle
         * - text
         * - null
         */
        /*function getType(feature) {
            var nodeType = feature.node().nodeName;

            switch (nodeType) {
                case 'path':
                    var parent = feature.node().parentNode;

                    if (d3.select(parent).classed('vector')) {
                        parent = parent.parentNode;
                    }
                    var name = $(parent).data('name');

                    switch (name) {
                        case 'points-layer':
                            return 'point';
                            break;

                        case 'lines-layer':
                            return 'line';
                            break;
                            
                        default:
                            return 'polygon';
                    }
                    break;

                case 'circle':
                    return 'circle';
                    break;

                case 'text':
                    return 'text';
                    break;

                default:
                    return null;
            }
        }
        */

        function movePath(feature) {
            var el = feature.node(),
                temporaryPath = el.cloneNode(true),
                bbox = el.getBBox();

            d3.select(temporaryPath)
                .attr('id', 'temporaryPath')
                .attr('opacity', 0.5);
            pointsLayer.node().appendChild(temporaryPath);

            d3.select(svgDrawing)
                .on('click', function() {
                    
                    d3.event.preventDefault();
                    d3.event.stopPropagation();

                    if (d3.select(temporaryPath).classed('moved')) {
                        var coordinates = d3.mouse(this),
                            transform = d3.transform(d3.select(svgDrawing)
                                            .attr('transform')),
                            realCoordinates = 
                                geometryutils.realCoordinates(transform, coordinates),
                            transX = realCoordinates[0] - bbox.x,
                            transY = realCoordinates[1] - bbox.y,
                            emptyCircle = 
                                d3.select('.c' + feature.attr('data-link')),
                            emptyCircleExists = emptyCircle.node(),

                            transformString = '',
                            hasRotate = 
                                /rotate\((.*?)(?: |,)(.*?)(?: |,)(.*?)\)/
                                .exec(feature.attr('transform'));

                        if (hasRotate) {
                            transformString += 
                                'rotate(' + [hasRotate[1], 
                                    (parseFloat(hasRotate[2]) + transX), 
                                    (parseFloat(hasRotate[3]) + transY)] + ')';
                        }
                        transformString += 
                            'translate(' + [transX, transY] + ')';

                        feature.attr('transform', transformString);

                        if (emptyCircleExists) {
                            emptyCircle.attr('transform', transformString);
                        }

                        d3.select(svgDrawing).on('click', null);
                        d3.select(svgDrawing).on('mousemove', null);

                        d3.select(temporaryPath).remove();
                    }
                })
                .on('mousemove', function() {
                    var coordinates = d3.mouse(this),
                            transform = d3.transform(d3.select(svgDrawing)
                                            .attr('transform')),
                        realCoordinates = 
                            geometryutils.realCoordinates(transform, coordinates),
                        transX = realCoordinates[0] - bbox.x,
                        transY = realCoordinates[1] - bbox.y,
                        transformString = '',
                        hasRotate = /rotate\((.*?)(?: |,)(.*?)(?: |,)(.*?)\)/
                            .exec(feature.attr('transform'));

                    if (hasRotate) {
                        transformString += 'rotate(' 
                            + [hasRotate[1], 
                            (parseFloat(hasRotate[2]) + transX), 
                            (parseFloat(hasRotate[3]) + transY)] + ')';
                    }
                    transformString += 'translate(' + [transX, transY] + ')';

                    d3.select(temporaryPath)
                        .classed('moved', true)
                        .attr('transform', transformString);
                });
        };

        function movePoint(feature) {
            var el = feature.node(),
                pathData = el.getPathData(),
                featuresToUpdate = feature;

            if (feature.attr('data-link')) {
                featuresToUpdate = d3.selectAll('.link_' + feature.attr('data-link'));
            }

            // draw temporary node at all path breaks
            var features = [],
                drag = d3.behavior.drag();

            angular.forEach(pathData, function(point, index) {
                var pointValues = point.values;

                if (pointValues && pointValues.length === 2) {
                    var px = pointValues[0],
                        py = pointValues[1];
                    features.push([px, py, index]);
                    pointsLayer
                        .append('circle')
                        .classed('ongoing', true)
                        .attr('id', 'n' + index)
                        .attr('cx', px)
                        .attr('cy', py)
                        .attr('r', 10)
                        .attr('fill', 'red')
                        .call(drag);
                }
            });

            var nearest = null;

            drag.on('dragstart', function(e) {
                // silence other listeners
                d3.event.sourceEvent.stopPropagation();
                nearest = geometryutils.nearest(d3.mouse(this), features);
            });

            drag.on('drag', function() {
                d3.event.sourceEvent.stopPropagation();
                var mousePosition = d3.mouse(this);
                d3.select(this)
                    .attr('cx', mousePosition[0])
                    .attr('cy', mousePosition[1]);

                var vertexNumber = 
                    parseInt(d3.select(this).attr('id').replace('n', ''));
                featuresToUpdate.each(function(d, i) {
                    var pathDataToUpdate = this.getPathData();
                    pathDataToUpdate[vertexNumber].values[0] = mousePosition[0];
                    pathDataToUpdate[vertexNumber].values[1] = mousePosition[1];
                    this.setPathData(pathDataToUpdate);
                });
            });
        };

        function rotatePath(feature) {
            var el = feature.node(),
                bbox = el.getBBox(),
                pathCenter = [bbox.x + bbox.width / 2, 
                                bbox.y + bbox.height / 2],
                pathCenterTranslate = [],
                emptyCircle = d3.select('.c' + feature.attr('data-link')),
                emptyCircleExists = emptyCircle.node();
            pathCenterTranslate[0] = pathCenter[0];
            pathCenterTranslate[1] = pathCenter[1];

            if (feature.attr('transform')) {
                var pathHasTranslate = /translate\((.*?)(?: |,)(.*?)\)/
                                    .exec(feature.attr('transform'));

                if (pathHasTranslate) {
                    pathCenterTranslate[0] = pathCenter[0] 
                                        + parseFloat(pathHasTranslate[1]);
                    pathCenterTranslate[1] = pathCenter[1] 
                                        + parseFloat(pathHasTranslate[2]);
                }
            }

            var drag = d3.behavior.drag(),

            rotationMarker = pointsLayer
                .append('g')
                .classed('ongoing', true)
                .attr('transform', 'translate(' 
                                    + pathCenterTranslate[0] 
                                    + ',' 
                                    + (pathCenterTranslate[1] 
                                    + bbox.height * 2) 
                                    + ')')
                .attr('pathCenter', pathCenter)
                .attr('pathCenterTranslate', pathCenterTranslate)
                .call(drag);

            rotationMarker.append('circle')
                .attr('cx', 0)
                .attr('cy', 0)
                .attr('r', 10)
                .attr('fill', 'red')
                .attr('stroke', 'none');

            rotationMarker.append('svg:image')
                .attr('xlink:href', 'assets/icons/autorenew.svg')
                .attr('width', 20)
                .attr('height', 20)
                .attr('x', -10)
                .attr('y', -10);

            var initialAngle = 0;

            drag.on('dragstart', function() {
                // silence other listeners
                d3.event.sourceEvent.stopPropagation(); 
                var mouse = d3.mouse(pointsLayer.node());
                initialAngle = geometryutils.angle(pathCenterTranslate[0], 
                                        pathCenterTranslate[1], 
                                        mouse[0], 
                                        mouse[1]);
            }).on('drag', function() {
                var mouse = d3.mouse(pointsLayer.node()),
                    currentAngle = geometryutils.angle(pathCenterTranslate[0], 
                                        pathCenterTranslate[1], 
                                        mouse[0], 
                                        mouse[1]),
                    diffAngle = currentAngle - initialAngle,

                    transformString = '',
                    hasTranslate = /translate\((.*?)\)/
                                    .exec(feature.attr('transform'));

                if (hasTranslate) {
                    transformString += hasTranslate[0];
                }

                transformString += 'rotate(' 
                                + diffAngle 
                                + ' ' 
                                + pathCenter[0] 
                                + ' ' 
                                + pathCenter[1] 
                                + ')';

                feature.attr('transform', transformString);

                if (emptyCircleExists) {
                    emptyCircle.attr('transform', transformString);
                }

                rotationMarker.attr('transform', 'translate(' 
                                                    + mouse[0] 
                                                    + ',' 
                                                    + mouse[1] 
                                                    + ')');
            }).on('dragend', function() {
                pointsLayer.on('mousedown.drag', null);
                $('#der').css('cursor', 'auto');
            });
        };

        function toggleStroke(feature) {
            if (feature.attr('stroke')) {
                feature.attr('stroke', null)
                    .attr('stroke-width', null);
            } else {
                feature.attr('stroke', 'black')
                    .attr('stroke-width', '2');
            }
        };

        function toggleArrow(feature) {
            $('#changeArrowsModal').modal('show');
            feature.classed('styleEdition', true);
        };

        function emptyNearFeature(feature) {

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

        function textEmptyNearFeature(feature) {

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

        function changeColor(feature) {
            // TODO: init correctly value of modal dialog
            /*
            scope.styleChoices = scope.styles.polygon;
            var style = $.grep(scope.styleChoices, function(style) {
                return style.id == feature.attr('e-style');
            }),
                color = $.grep(scope.colors, function(color) {
                return color.color == feature.attr('e-color');
            });
            scope.styleChosen = style[0];
            scope.colorChosen = color[0];
            */
            $('#changeColorModal').modal('show');
            feature.classed('styleEdition', true);
        };

        function changePattern(feature) {
            // TODO: init correctly value of modal dialog
            /* 
            scope.styleChoices = scope.styles.polygon;
            var style = $.grep(scope.styleChoices, function(style) {
                return style.id == feature.attr('e-style');
            }),
                color = $.grep(scope.colors, function(color) {
                return color.color == feature.attr('e-color');
            });
            scope.styleChosen = style[0];
            scope.colorChosen = color[0];
            */
            $('#changePatternModal').modal('show');
            feature.classed('styleEdition', true);
        };

        /**
         * @ngdoc method
         * @name  lineToCardinal
         * @methodOf accessimapEditeurDerApp.FeatureService
         *
         * @description 
         * Transform a line into a bezier curve ?
         * 
         * @param  {Object} feature
         * Path to 'simplify'
         * 
         */
        function lineToCardinal(feature) {
            var arr = feature.attr('d').split('L'),
                featuresToUpdate = feature;

            if (feature.attr('data-link')) {
                featuresToUpdate = 
                    d3.selectAll('.link_' + feature.attr('data-link'));
            }
            var coords = undefined;

            if (arr.length > 1) { // line's type is linear
                coords = arr.map(function(c) {
                    c = c.replace(/M(\s?)+/, '');
                    c = c.replace('Z', '');
                    c = c.replace(/(\s?)+/, ''); //remove first space
                    c = c.replace(/\s+$/, ''); //remove last space
                    var coordsArray = c.split(',');

                    if (coordsArray.length < 2) {
                        coordsArray = c.split(' ');
                    }

                    return coordsArray.map(function(ca) {
                        return parseFloat(ca);
                    });
                });
                featuresToUpdate.attr('d', generators.cardinalLineFunction(coords));
            }

            else { // line's type is cardinal
                arr = feature.attr('d').split(/[CQS]+/);
                coords = arr.map(function(c) {
                    c = c.replace(/M(\s?)+/, '');
                    c = c.replace('Z', '');
                    c = c.replace(/(\s?)+/, ''); //remove first space
                    c = c.replace(/\s+$/, ''); //remove last space
                    var coordsArray = c.split(',');

                    if (coordsArray.length < 2) {
                        coordsArray = c.split(' ');
                    }

                    if (coordsArray.length > 2) {
                        var l = coordsArray.length;
                        coordsArray = [coordsArray[l - 2], coordsArray[l - 1]];
                    }

                    return coordsArray.map(function(ca) {
                        return parseFloat(ca);
                    });
                });
                featuresToUpdate.attr('d', generators.lineFunction(coords));
            }
        };

    }

    angular.module(moduleApp)
        .service('FeatureService', FeatureService);

    FeatureService.$inject = ['InteractionService', 'geometryutils', 'generators']

})();
/*global textures */
// jscs:disable maximumLineLength
/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.settings
 * @requires accessimapEditeurDerApp.editSvg
 * @requires accessimapEditeurDerApp.FeatureService
 * @requires accessimapEditeurDerApp.InteractionService
 * @description
 * # settings
 * Factory in the accessimapEditeurDerApp.
 */
(function() {
    'use strict';

    function settings (editSvg, FeatureService, InteractionService) {

        var leafletConf = {
                GLOBAL_MAP_CENTER1: [1.441019, 43.604268], // [lon, lat]
                GLOBAL_MAP_CENTER: [43.604268, 1.441019], // [lon, lat]
                GLOBAL_MAP_DEFAULT_ZOOM: 13,
            },

        /**
         * @ngdoc property
         * @name  ratioPixelPoint
         * @propertyOf accessimapEditeurDerApp.settings
         * @type {Number}
         * @description Ratio between a pixel and a millimeter
         */
        ratioPixelPoint = 0.283,

        margin = 40,

        mapCategories = [{
                id: 'world',
                name: 'Monde',
                images: [{
                    path: 'assets/data/BlankMap-World6-Equirectangular.svg'
                }]
            }, {
                id: 'france',
                name: 'France',
                images: [{
                    path: 'assets/data/France_all_regions_A4.svg'
                }]
            }],

        FONTS = [{
                name: 'Braille',
                size: '35px',
                family: 'Braille_2007',
                weight: null,
                color: 'black'
            }, {
                name: 'Arial gras 32',
                size: '32px',
                family: 'Arial',
                weight: 'bold',
                color: 'other'
            }, {
                name: 'Arial gras 28',
                size: '28px',
                family: 'Arial',
                weight: 'bold',
                color: 'other'
            }, {
                name: 'Arial gras 22',
                size: '22px',
                family: 'Arial',
                weight: 'bold',
                color: 'other'
            }, {
                name: 'Arial gras 18',
                size: '18px',
                family: 'Arial',
                weight: 'bold',
                color: 'other'
            }
        ],

        COLORS = {
            'black': [{
                name: 'Noir',
                color: 'black',
            }],
            'transparent': [{
                name: 'Transparent',
                color: 'none',
            }, {
                name: 'Blanc',
                color: 'white',
            }],
            'other': [{
                name: 'Bleu',
                color: 'blue',
            }, {
                name: 'Cyan',
                color: 'cyan',
            }, {
                name: 'Rouge',
                color: 'red',
            }, {
                name: 'Jaune',
                color: 'yellow',
            }, {
                name: 'Vert',
                color: 'limegreen',
            }, {
                name: 'Violet',
                color: 'purple',
            }
        ]},

        /**
         * @ngdoc property
         * @name  accessimapEditeurDerApp.settings.FORMATS
         * @propertyOf accessimapEditeurDerApp.settings
         * @description
         * Formats availables for editing documents.
         */
        FORMATS = {
            'portraitA4': {
                name: 'A4 Portrait',
                width: 210,
                height: 297
            },
            'landscapeA4': {
                name: 'A4 Paysage',
                width: 297,
                height: 210
            },
            'portraitA3': {
                name: 'A3 Portrait',
                width: 297,
                height: 420
            },
            'landscapeA3': {
                name: 'A3 Paysage',
                width: 420,
                height: 297
            },
            'nexus9': {
                name: 'Nexus 9 Paysage',
                width: 181, // 7.12"
                height: 136 // 5.35"
            }
        },

        QUERY_LIST = [{
            id: 'poi',
            name: 'Point d\'intérêt',
            type: 'point',
            query: ['node["amenity"]', 'node["shop"]'],
            icon: 'road'
        },{
            id: 'trottoirs',
            name: 'Trottoirs',
            type: 'line',
            query: ['way["footway"="sidewalk"]'],
            icon: 'road'
        }, {
            id: 'ppietons',
            name: 'Passages piétons',
            type: 'line',
            query: ['way["footway"="crossing"]'],
            icon: 'road'
        }, {
            id: 'principales',
            name: 'Routes principales',
            type: 'line',
            query: ['way["highway"~"motorway|trunk|primary|secondary"]'],
            icon: 'road'
        }, {
            id: 'places',
            name: 'Places',
            type: 'polygon',
            query: ['way["highway"="pedestrian"]["area"="yes"]'],
            icon: 'road'
        }, {
            id: 'rues',
            name: 'Toutes les rues',
            type: 'line',
            query: ['way["highway"]["highway"!="footway"]["highway"!="cycleway"]["highway"!="path"]["highway"!="steps"]["area"!="yes"]'],
            icon: 'road'
        }, {
            id: 'ruespietonnes',
            name: 'Chemins piétons',
            type: 'line',
            query: ['way["highway"~"footway|cycleway|path|steps"]["area"!="yes"]["footway"!="sidewalk"]["footway"!="crossing"]'],
            icon: 'road'
        }, {
            id: 'trafficSignals',
            name: 'Feux tricolores',
            type: 'point',
            query: ['node["highway"="traffic_signals"]'],
            icon: 'street-view'
        }, {
            id: 'trafficSignals_sound',
            name: 'Feux sonores',
            type: 'point',
            query: ['node["traffic_signals:sound"]'],
            icon: 'street-view'
        }, {
            id: 'batiments',
            name: 'Batiments',
            type: 'polygon',
            query: ['way["building"]["building"!="no"]'],
            icon: 'building-o'
        }, {
            id: 'eau',
            name: 'Eau',
            type: 'polygon',
            query: ['relation["type"="multipolygon"]["natural"="water"]', 'way["waterway"="riverbank"]'],
            icon: 'leaf'
        }, {
            id: 'parc',
            name: 'Parc',
            type: 'polygon',
            query: ['way["leisure"="park"]'],
            icon: 'leaf'
        }],

        POLYGON_STYLES = {
            'bighash': textures.lines().id('bighash').orientation('vertical'),
            'bighashm45': textures.lines().id('bighashm45').orientation('6/8'),
            'bighash45': textures.lines().id('bighash45').orientation('2/8'),
            'smallhash': textures.lines().id('smallhash').orientation('vertical').thicker(),
            'smallhashm45': textures.lines().id('smallhashm45').orientation('6/8').thicker(),
            'smallhash45': textures.lines().id('smallhash45').orientation('2/8').thicker(),
            'waves': textures.paths().id('waves').d('waves'),
            'smalldots': textures.circles().id('smalldots').complement(),
            'smalldotsline': textures.circles().id('smalldotsline').lighter().thicker().complement().strokeWidth(1.1).background('white'),
            'smalldotsthicker': textures.circles().id('smalldotsthicker').lighter().thicker().complement().strokeWidth(1.1),
            'smalldotsthicker2': textures.circles().id('smalldotsthicker2').lighter().thicker().complement().strokeWidth(1.3),
            'bigdots': textures.circles().id('bigdots').fill('grey').heavier().complement(),
            'squares45': textures.lines().id('squares45').orientation('2/8', '6/8').size(20).strokeWidth(1),
            'caps': textures.paths().id('caps').d('caps'),
            'woven': textures.paths().id('woven').d('woven'),
            'solid': textures.lines().id('solid').strokeWidth(0),
            'bighash_white': textures.lines().id('bighash_white').orientation('vertical').background('white'),
            'bighashm45_white': textures.lines().id('bighashm45_white').orientation('6/8').background('white'),
            'bighash45_white': textures.lines().id('bighash45_white').orientation('2/8').background('white'),
            'smallhash_white': textures.lines().id('smallhash_white').orientation('vertical').thicker().background('white'),
            'smallhashm45_white': textures.lines().id('smallhashm45_white').orientation('6/8').thicker().background('white'),
            'smallhash45_white': textures.lines().id('smallhash45_white').orientation('2/8').thicker().background('white'),
            'waves_white': textures.paths().id('waves_white').d('waves').background('white'),
            'smalldots_white': textures.circles().id('smalldots_white').complement().background('white'),
            'smalldotsline_white': textures.circles().id('smalldotsline_white').lighter().thicker().complement().strokeWidth(1.1).background('white'),
            'smalldotsthicker_white': textures.circles().id('smalldotsthicker_white').lighter().thicker().complement().strokeWidth(1.1).background('white'),
            'smalldotsthicker2_white': textures.circles().id('smalldotsthicker2_white').lighter().thicker().complement().strokeWidth(1.3).background('white'),
            'bigdots_white': textures.circles().id('bigdots_white').fill('grey').heavier().complement().background('white'),
            'squares45_white': textures.lines().id('squares45_white').orientation('2/8', '6/8').size(20).strokeWidth(1).background('white'),
            'caps_white': textures.paths().id('caps_white').d('caps').background('white'),
            'woven_white': textures.paths().id('woven_white').d('woven').background('white'),
            'solid_white': textures.lines().id('solid_white').strokeWidth(0).background('white'),
            'bighash_blue': textures.lines().id('bighash_blue').orientation('vertical').background('blue'),
            'bighashm45_blue': textures.lines().id('bighashm45_blue').orientation('6/8').background('blue'),
            'bighash45_blue': textures.lines().id('bighash45_blue').orientation('2/8').background('blue'),
            'smallhash_blue': textures.lines().id('smallhash_blue').orientation('vertical').thicker().background('blue'),
            'smallhashm45_blue': textures.lines().id('smallhashm45_blue').orientation('6/8').thicker().background('blue'),
            'smallhash45_blue': textures.lines().id('smallhash45_blue').orientation('2/8').thicker().background('blue'),
            'waves_blue': textures.paths().id('waves_blue').d('waves').background('blue'),
            'smalldots_blue': textures.circles().id('smalldots_blue').complement().background('blue'),
            'smalldotsline_blue': textures.circles().id('smalldotsline_blue').lighter().thicker().complement().strokeWidth(1.1).background('blue'),
            'smalldotsthicker_blue': textures.circles().id('smalldotsthicker_blue').lighter().thicker().complement().strokeWidth(1.1).background('blue'),
            'smalldotsthicker2_blue': textures.circles().id('smalldotsthicker2_blue').lighter().thicker().complement().strokeWidth(1.3).background('blue'),
            'bigdots_blue': textures.circles().id('bigdots_blue').fill('grey').heavier().complement().background('blue'),
            'squares45_blue': textures.lines().id('squares45_blue').orientation('2/8', '6/8').size(20).strokeWidth(1).background('blue'),
            'caps_blue': textures.paths().id('caps_blue').d('caps').background('blue'),
            'woven_blue': textures.paths().id('woven_blue').d('woven').background('blue'),
            'solid_blue': textures.lines().id('solid_blue').strokeWidth(0).background('blue'),
            'bighash_cyan': textures.lines().id('bighash_cyan').orientation('vertical').background('cyan'),
            'bighashm45_cyan': textures.lines().id('bighashm45_cyan').orientation('6/8').background('cyan'),
            'bighash45_cyan': textures.lines().id('bighash45_cyan').orientation('2/8').background('cyan'),
            'smallhash_cyan': textures.lines().id('smallhash_cyan').orientation('vertical').thicker().background('cyan'),
            'smallhashm45_cyan': textures.lines().id('smallhashm45_cyan').orientation('6/8').thicker().background('cyan'),
            'smallhash45_cyan': textures.lines().id('smallhash45_cyan').orientation('2/8').thicker().background('cyan'),
            'waves_cyan': textures.paths().id('waves_cyan').d('waves').background('cyan'),
            'smalldots_cyan': textures.circles().id('smalldots_cyan').complement().background('cyan'),
            'smalldotsline_cyan': textures.circles().id('smalldotsline_cyan').lighter().thicker().complement().strokeWidth(1.1).background('cyan'),
            'smalldotsthicker_cyan': textures.circles().id('smalldotsthicker_cyan').lighter().thicker().complement().strokeWidth(1.1).background('cyan'),
            'smalldotsthicker2_cyan': textures.circles().id('smalldotsthicker2_cyan').lighter().thicker().complement().strokeWidth(1.3).background('cyan'),
            'bigdots_cyan': textures.circles().id('bigdots_cyan').fill('grey').heavier().complement().background('cyan'),
            'squares45_cyan': textures.lines().id('squares45_cyan').orientation('2/8', '6/8').size(20).strokeWidth(1).background('cyan'),
            'caps_cyan': textures.paths().id('caps_cyan').d('caps').background('cyan'),
            'woven_cyan': textures.paths().id('woven_cyan').d('woven').background('cyan'),
            'solid_cyan': textures.lines().id('solid_cyan').strokeWidth(0).background('cyan'),
            'bighash_red': textures.lines().id('bighash_red').orientation('vertical').background('red'),
            'bighashm45_red': textures.lines().id('bighashm45_red').orientation('6/8').background('red'),
            'bighash45_red': textures.lines().id('bighash45_red').orientation('2/8').background('red'),
            'smallhash_red': textures.lines().id('smallhash_red').orientation('vertical').thicker().background('red'),
            'smallhashm45_red': textures.lines().id('smallhashm45_red').orientation('6/8').thicker().background('red'),
            'smallhash45_red': textures.lines().id('smallhash45_red').orientation('2/8').thicker().background('red'),
            'waves_red': textures.paths().id('waves_red').d('waves').background('red'),
            'smalldots_red': textures.circles().id('smalldots_red').complement().background('red'),
            'smalldotsline_red': textures.circles().id('smalldotsline_red').lighter().thicker().complement().strokeWidth(1.1).background('red'),
            'smalldotsthicker_red': textures.circles().id('smalldotsthicker_red').lighter().thicker().complement().strokeWidth(1.1).background('red'),
            'smalldotsthicker2_red': textures.circles().id('smalldotsthicker2_red').lighter().thicker().complement().strokeWidth(1.3).background('red'),
            'bigdots_red': textures.circles().id('bigdots_red').fill('grey').heavier().complement().background('red'),
            'squares45_red': textures.lines().id('squares45_red').orientation('2/8', '6/8').size(20).strokeWidth(1).background('red'),
            'caps_red': textures.paths().id('caps_red').d('caps').background('red'),
            'woven_red': textures.paths().id('woven_red').d('woven').background('red'),
            'solid_red': textures.lines().id('solid_red').strokeWidth(0).background('red'),
            'bighash_yellow': textures.lines().id('bighash_yellow').orientation('vertical').background('yellow'),
            'bighashm45_yellow': textures.lines().id('bighashm45_yellow').orientation('6/8').background('yellow'),
            'bighash45_yellow': textures.lines().id('bighash45_yellow').orientation('2/8').background('yellow'),
            'smallhash_yellow': textures.lines().id('smallhash_yellow').orientation('vertical').thicker().background('yellow'),
            'smallhashm45_yellow': textures.lines().id('smallhashm45_yellow').orientation('6/8').thicker().background('yellow'),
            'smallhash45_yellow': textures.lines().id('smallhash45_yellow').orientation('2/8').thicker().background('yellow'),
            'waves_yellow': textures.paths().id('waves_yellow').d('waves').background('yellow'),
            'smalldots_yellow': textures.circles().id('smalldots_yellow').complement().background('yellow'),
            'smalldotsline_yellow': textures.circles().id('smalldotsline_yellow').lighter().thicker().complement().strokeWidth(1.1).background('yellow'),
            'smalldotsthicker_yellow': textures.circles().id('smalldotsthicker_yellow').lighter().thicker().complement().strokeWidth(1.1).background('yellow'),
            'smalldotsthicker2_yellow': textures.circles().id('smalldotsthicker2_yellow').lighter().thicker().complement().strokeWidth(1.3).background('yellow'),
            'bigdots_yellow': textures.circles().id('bigdots_yellow').fill('grey').heavier().complement().background('yellow'),
            'squares45_yellow': textures.lines().id('squares45_yellow').orientation('2/8', '6/8').size(20).strokeWidth(1).background('yellow'),
            'caps_yellow': textures.paths().id('caps_yellow').d('caps').background('yellow'),
            'woven_yellow': textures.paths().id('woven_yellow').d('woven').background('yellow'),
            'solid_yellow': textures.lines().id('solid_yellow').strokeWidth(0).background('yellow'),
            'bighash_limegreen': textures.lines().id('bighash_limegreen').orientation('vertical').background('limegreen'),
            'bighashm45_limegreen': textures.lines().id('bighashm45_limegreen').orientation('6/8').background('limegreen'),
            'bighash45_limegreen': textures.lines().id('bighash45_limegreen').orientation('2/8').background('limegreen'),
            'smallhash_limegreen': textures.lines().id('smallhash_limegreen').orientation('vertical').thicker().background('limegreen'),
            'smallhashm45_limegreen': textures.lines().id('smallhashm45_limegreen').orientation('6/8').thicker().background('limegreen'),
            'smallhash45_limegreen': textures.lines().id('smallhash45_limegreen').orientation('2/8').thicker().background('limegreen'),
            'waves_limegreen': textures.paths().id('waves_limegreen').d('waves').background('limegreen'),
            'smalldots_limegreen': textures.circles().id('smalldots_limegreen').complement().background('limegreen'),
            'smalldotsline_limegreen': textures.circles().id('smalldotsline_limegreen').lighter().thicker().complement().strokeWidth(1.1).background('limegreen'),
            'smalldotsthicker_limegreen': textures.circles().id('smalldotsthicker_limegreen').lighter().thicker().complement().strokeWidth(1.1).background('limegreen'),
            'smalldotsthicker2_limegreen': textures.circles().id('smalldotsthicker2_limegreen').lighter().thicker().complement().strokeWidth(1.3).background('limegreen'),
            'bigdots_limegreen': textures.circles().id('bigdots_limegreen').fill('grey').heavier().complement().background('limegreen'),
            'squares45_limegreen': textures.lines().id('squares45_limegreen').orientation('2/8', '6/8').size(20).strokeWidth(1).background('limegreen'),
            'caps_limegreen': textures.paths().id('caps_limegreen').d('caps').background('limegreen'),
            'woven_limegreen': textures.paths().id('woven_limegreen').d('woven').background('limegreen'),
            'solid_limegreen': textures.lines().id('solid_limegreen').strokeWidth(0).background('limegreen'),
            'bighash_purple': textures.lines().id('bighash_purple').orientation('vertical').background('purple'),
            'bighashm45_purple': textures.lines().id('bighashm45_purple').orientation('6/8').background('purple'),
            'bighash45_purple': textures.lines().id('bighash45_purple').orientation('2/8').background('purple'),
            'smallhash_purple': textures.lines().id('smallhash_purple').orientation('vertical').thicker().background('purple'),
            'smallhashm45_purple': textures.lines().id('smallhashm45_purple').orientation('6/8').thicker().background('purple'),
            'smallhash45_purple': textures.lines().id('smallhash45_purple').orientation('2/8').thicker().background('purple'),
            'waves_purple': textures.paths().id('waves_purple').d('waves').background('purple'),
            'smalldots_purple': textures.circles().id('smalldots_purple').complement().background('purple'),
            'smalldotsline_purple': textures.circles().id('smalldotsline_purple').lighter().thicker().complement().strokeWidth(1.1).background('purple'),
            'smalldotsthicker_purple': textures.circles().id('smalldotsthicker_purple').lighter().thicker().complement().strokeWidth(1.1).background('purple'),
            'smalldotsthicker2_purple': textures.circles().id('smalldotsthicker2_purple').lighter().thicker().complement().strokeWidth(1.3).background('purple'),
            'bigdots_purple': textures.circles().id('bigdots_purple').fill('grey').heavier().complement().background('purple'),
            'squares45_purple': textures.lines().id('squares45_purple').orientation('2/8', '6/8').size(20).strokeWidth(1).background('purple'),
            'caps_purple': textures.paths().id('caps_purple').d('caps').background('purple'),
            'woven_purple': textures.paths().id('woven_purple').d('woven').background('purple'),
            'solid_purple': textures.lines().id('solid_purple').strokeWidth(0).background('purple'),
        },

        STYLES = {
        'line': [{
            id: 'straight_2',
            name: 'Trait 2',
            style: [{
                'k': 'stroke',
                'v': 'black'
            }, {
                'k': 'stroke-width',
                'v': '2'
            }, {
                'k': 'fill',
                'v': 'none'
            }],
            styleInner: [{
                'k': 'stroke-width',
                'v': '0'
            }, {
                'k': 'fill',
                'v': 'none'
            }]
        },{
            id: 'straight_3',
            name: 'Trait 3',
            style: [{
                'k': 'stroke',
                'v': 'black'
            }, {
                'k': 'stroke-width',
                'v': '3'
            }, {
                'k': 'fill',
                'v': 'none'
            }],
            styleInner: [{
                'k': 'stroke-width',
                'v': '0'
            }, {
                'k': 'fill',
                'v': 'none'
            }]
        },{
            id: 'straight_5',
            name: 'Trait 5',
            style: [{
                'k': 'stroke',
                'v': 'black'
            }, {
                'k': 'stroke-width',
                'v': '5'
            }, {
                'k': 'fill',
                'v': 'none'
            }],
            styleInner: [{
                'k': 'stroke-width',
                'v': '0'
            }, {
                'k': 'fill',
                'v': 'none'
            }]
        },{
            id: 'straight_8',
            name: 'Traits parallèles',
            style: [{
                'k': 'stroke',
                'v': 'black'
            }, {
                'k': 'stroke-width',
                'v': '8'
            }, {
                'k': 'stroke-linecap',
                'v': 'butt'
            }, {
                'k': 'fill',
                'v': 'none'
            }],
            styleInner: [{
                'k': 'stroke',
                'v': 'white'
            }, {
                'k': 'stroke-width',
                'v': '4'
            }, {
                'k': 'stroke-linecap',
                'v': 'round'
            }, {
                'k': 'fill',
                'v': 'none'
            }]
        },{
            id: 'straight_12',
            name: 'Traits parallèles 2',
            style: [{
                'k': 'stroke',
                'v': 'black'
            }, {
                'k': 'stroke-width',
                'v': '12'
            }, {
                'k': 'stroke-linecap',
                'v': 'butt'
            }, {
                'k': 'fill',
                'v': 'none'
            }],
            styleInner: [{
                'k': 'stroke',
                'v': 'white'
            }, {
                'k': 'stroke-width',
                'v': '8'
            }, {
                'k': 'stroke-linecap',
                'v': 'round'
            }, {
                'k': 'fill',
                'v': 'none'
            }]
        },{
            id: 'straight_20',
            name: 'Traits parallèles 3',
            style: [{
                'k': 'stroke',
                'v': 'black'
            }, {
                'k': 'stroke-width',
                'v': '20'
            }, {
                'k': 'stroke-linecap',
                'v': 'butt'
            }, {
                'k': 'fill',
                'v': 'none'
            }],
            styleInner: [{
                'k': 'stroke',
                'v': 'white'
            }, {
                'k': 'stroke-width',
                'v': '15'
            }, {
                'k': 'stroke-linecap',
                'v': 'round'
            }, {
                'k': 'fill',
                'v': 'none'
            }]
        },{
            id: 'straight_20_fill',
            name: 'Traits parallèles 3 rempli',
            style: [{
                'k': 'stroke',
                'v': 'black'
            }, {
                'k': 'stroke-width',
                'v': '20'
            }, {
                'k': 'stroke-linecap',
                'v': 'round'
            }, {
                'k': 'fill',
                'v': 'none'
            }],
            styleInner: [{
                'k': 'stroke',
                'v': POLYGON_STYLES.smalldotsline.url()
            }, {
                'k': 'stroke-width',
                'v': '15'
            }, {
                'k': 'stroke-linecap',
                'v': 'round'
            }, {
                'k': 'fill',
                'v': 'none'
            }]
        },{
            id: 'straight_35',
            name: 'Traits parallèles 4',
            style: [{
                'k': 'stroke',
                'v': 'black'
            }, {
                'k': 'stroke-width',
                'v': '35'
            }, {
                'k': 'stroke-linecap',
                'v': 'butt'
            }, {
                'k': 'fill',
                'v': 'none'
            }],
            styleInner: [{
                'k': 'stroke',
                'v': 'white'
            }, {
                'k': 'stroke-width',
                'v': '30'
            }, {
                'k': 'stroke-linecap',
                'v': 'round'
            }, {
                'k': 'fill',
                'v': 'none'
            }]
        },{
            id: 'dashed11_11_5',
            name: 'Passage',
            style: [{
                'k': 'stroke',
                'v': 'black'
            }, {
                'k': 'stroke-width',
                'v': '15'
            }, {
                'k': 'fill',
                'v': 'none'
            }, {
                'k': 'stroke-dasharray',
                'v': '4, 4'
            }],
            styleInner: [{
                'k': 'stroke',
                'v': 'white'
            }, {
                'k': 'stroke-width',
                'v': '15'
            }, {
                'k': 'fill',
                'v': 'none'
            }, {
                'k': 'stroke-dasharray',
                'v': '4, 4'
            }, {
                'k': 'stroke-dashoffset',
                'v': '4'
            }]
        },{
            id: 'dashed21_5',
            name: 'Tirets 21_5',
            style: [{
                'k': 'stroke',
                'v': 'black'
            }, {
                'k': 'stroke-width',
                'v': '5'
            }, {
                'k': 'fill',
                'v': 'none'
            }, {
                'k': 'stroke-dasharray',
                'v': '10, 5'
            }],
            styleInner: [{
                'k': 'stroke-width',
                'v': '0'
            }, {
                'k': 'fill',
                'v': 'none'
            }]
        },{
            id: 'dashed22_3',
            name: 'Tirets 22_3',
            style: [{
                'k': 'stroke',
                'v': 'black'
            }, {
                'k': 'stroke-width',
                'v': '3'
            }, {
                'k': 'fill',
                'v': 'none'
            }, {
                'k': 'stroke-dasharray',
                'v': '6, 6'
            }],
            styleInner: [{
                'k': 'stroke-width',
                'v': '0'
            }, {
                'k': 'fill',
                'v': 'none'
            }]
        },{
            id: 'dashed22_5',
            name: 'Tirets 22_5',
            style: [{
                'k': 'stroke',
                'v': 'black'
            }, {
                'k': 'stroke-width',
                'v': '5'
            }, {
                'k': 'fill',
                'v': 'none'
            }, {
                'k': 'stroke-dasharray',
                'v': '10, 10'
            }],
            styleInner: [{
                'k': 'stroke-width',
                'v': '0'
            }, {
                'k': 'fill',
                'v': 'none'
            }]
        },{
            id: 'dashed42_3',
            name: 'Tirets 42_3',
            style: [{
                'k': 'stroke',
                'v': 'black'
            }, {
                'k': 'stroke-width',
                'v': '3'
            }, {
                'k': 'fill',
                'v': 'none'
            }, {
                'k': 'stroke-dasharray',
                'v': '12, 6'
            }],
            styleInner: [{
                'k': 'stroke-width',
                'v': '0'
            }, {
                'k': 'fill',
                'v': 'none'
            }]
        },{
            id: 'dashed42_5',
            name: 'Tirets 42_5',
            style: [{
                'k': 'stroke',
                'v': 'black'
            }, {
                'k': 'stroke-width',
                'v': '5'
            }, {
                'k': 'fill',
                'v': 'none'
            }, {
                'k': 'stroke-dasharray',
                'v': '20, 10'
            }],
            styleInner: [{
                'k': 'stroke-width',
                'v': '0'
            }, {
                'k': 'fill',
                'v': 'none'
            }]
        },{
            id: 'dashed42_5',
            name: 'Tirets 62_5',
            style: [{
                'k': 'stroke',
                'v': 'black'
            }, {
                'k': 'stroke-width',
                'v': '5'
            }, {
                'k': 'fill',
                'v': 'none'
            }, {
                'k': 'stroke-dasharray',
                'v': '30, 10'
            }],
            styleInner: [{
                'k': 'stroke-width',
                'v': '0'
            }, {
                'k': 'fill',
                'v': 'none'
            }]
        },{
            id: 'dashed4212_3',
            name: 'Tirets 4212_3',
            style: [{
                'k': 'stroke',
                'v': 'black'
            }, {
                'k': 'stroke-width',
                'v': '3'
            }, {
                'k': 'fill',
                'v': 'none'
            }, {
                'k': 'stroke-dasharray',
                'v': '12, 6, 3, 6'
            }],
            styleInner: [{
                'k': 'stroke-width',
                'v': '0'
            }, {
                'k': 'fill',
                'v': 'none'
            }]
        },{
            id: 'dashed4212_5',
            name: 'Tirets 4212_5',
            style: [{
                'k': 'stroke',
                'v': 'black'
            }, {
                'k': 'stroke-width',
                'v': '5'
            }, {
                'k': 'fill',
                'v': 'none'
            }, {
                'k': 'stroke-dasharray',
                'v': '20, 10, 5, 10'
            }],
            styleInner: [{
                'k': 'stroke-width',
                'v': '0'
            }, {
                'k': 'fill',
                'v': 'none'
            }]
        }],
        'polygon': [{
            id: 'bighash',
            name: 'Hachures',
            style: [{
                'k': 'fill-pattern',
                'v': 'bighash'
            }]
        },{
            id: 'bighash-45',
            name: 'Hachures -45',
            style: [{
                'k': 'fill-pattern',
                'v': 'bighashm45'
            }]
        },{
            id: 'bighash45',
            name: 'Hachures 45',
            style: [{
                'k': 'fill-pattern',
                'v': 'bighash45'
            }]
        },{
            id: 'smallhash',
            name: 'Petites hachures',
            style: [{
                'k': 'fill-pattern',
                'v': 'smallhash'
            }]
        },{
            id: 'smallhashm45',
            name: 'Petites hachures -45',
            style: [{
                'k': 'fill-pattern',
                'v': 'smallhashm45'
            }]
        },{
            id: 'smallhash45',
            name: 'Petites hachures 45',
            style: [{
                'k': 'fill-pattern',
                'v': 'smallhash45'
            }]
        },{
            id: 'waves',
            name: 'Vagues',
            style: [{
                'k': 'fill-pattern',
                'v': 'waves'
            }]
        },{
            id: 'bigdots',
            name: 'Points',
            style: [{
                'k': 'fill-pattern',
                'v': 'bigdots'
            }]
        },{
            id: 'smalldots',
            name: 'Petits points',
            style: [{
                'k': 'fill-pattern',
                'v': 'smalldots'
            }]
        },{
            id: 'smalldotsthicker',
            name: 'Petits points rapprochés',
            style: [{
                'k': 'fill-pattern',
                'v': 'smalldotsthicker'
            }]
        },{
            id: 'squares45',
            name: 'Quadrillage 45',
            style: [{
                'k': 'fill-pattern',
                'v': 'squares45'
            }]
        },{
            id: 'caps',
            name: 'caps',
            style: [{
                'k': 'fill-pattern',
                'v': 'caps'
            }]
        },{
            id: 'woven',
            name: 'woven',
            style: [{
                'k': 'fill-pattern',
                'v': 'woven'
            }]
        },{
            id: 'solid',
            name: 'Fond uni',
            style: [{
                'k': 'fill-pattern',
                'v': 'solid'
            }]
        }],
        'point': [{
            id: 'smallcircleempty',
            name: 'Petit cercle vide',
            path: editSvg.circlePath,
            radius: 10,
            style: [{
                'k': 'stroke',
                'v': 'black'
            }, {
                'k': 'stroke-width',
                'v': '2'
            },{
                'k': 'fill',
                'v': 'white'
            }]
        },{
            id: 'bigcircleempty',
            name: 'Grand cercle vide',
            path: editSvg.circlePath,
            radius: 18,
            style: [{
                'k': 'stroke',
                'v': 'black'
            }, {
                'k': 'stroke-width',
                'v': '2'
            },{
                'k': 'fill',
                'v': 'white'
            }]
        },{
            id: 'smallcircle',
            name: 'Petit cercle plein',
            path: editSvg.circlePath,
            radius: 10,
            style: [{
                'k': 'stroke',
                'v': 'grey'
            }, {
                'k': 'stroke-width',
                'v': '2'
            },{
                'k': 'fill',
                'v': 'grey'
            }]
        },{
            id: 'bigcircle',
            name: 'Grand cercle',
            path: editSvg.circlePath,
            radius: 18,
            style: [{
                'k': 'stroke',
                'v': 'grey'
            }, {
                'k': 'stroke-width',
                'v': '2'
            },{
                'k': 'fill',
                'v': 'grey'
            }]
        },{
            id: 'circleCross',
            name: 'Cercle croix',
            path: editSvg.circleCrossPath,
            radius: 18,
            style: [{
                'k': 'stroke',
                'v': 'black'
            }, {
                'k': 'stroke-width',
                'v': '2'
            },{
                'k': 'fill',
                'v': 'white'
            }]
        },{
            id: 'ovalempty',
            name: 'Ovale vide',
            path: editSvg.ovalPath,
            radius: 18,
            style: [{
                'k': 'stroke',
                'v': 'black'
            }, {
                'k': 'stroke-width',
                'v': '2'
            },{
                'k': 'fill',
                'v': 'white'
            }]
        },{
            id: 'oval',
            name: 'Ovale',
            path: editSvg.ovalPath,
            radius: 18,
            style: [{
                'k': 'stroke',
                'v': 'grey'
            }, {
                'k': 'stroke-width',
                'v': '2'
            },{
                'k': 'fill',
                'v': 'grey'
            }]
        },{
            id: 'triangleempty',
            name: 'Triangle vide',
            path: editSvg.trianglePath,
            radius: 22,
            style: [{
                'k': 'stroke',
                'v': 'black'
            }, {
                'k': 'stroke-width',
                'v': '2'
            },{
                'k': 'fill',
                'v': 'white'
            }]
        },{
            id: 'triangle',
            name: 'Triangle',
            path: editSvg.trianglePath,
            radius: 22,
            style: [{
                'k': 'stroke',
                'v': 'grey'
            }, {
                'k': 'stroke-width',
                'v': '2'
            },{
                'k': 'fill',
                'v': 'grey'
            }]
        },{
            id: 'squareempty',
            name: 'Carré vide',
            path: editSvg.squarePath,
            radius: 20,
            style: [{
                'k': 'stroke',
                'v': 'black'
            }, {
                'k': 'stroke-width',
                'v': '3'
            },{
                'k': 'fill',
                'v': 'white'
            }]
        },{
            id: 'square',
            name: 'Carré',
            path: editSvg.squarePath,
            radius: 20,
            style: [{
                'k': 'stroke',
                'v': 'grey'
            }, {
                'k': 'stroke-width',
                'v': '2'
            },{
                'k': 'fill',
                'v': 'grey'
            }]
        },{
            id: 'squareDiag',
            name: 'Carré Diag',
            path: editSvg.squareDiagPath,
            radius: 25,
            style: [{
                'k': 'stroke',
                'v': 'black'
            }, {
                'k': 'stroke-width',
                'v': '2'
            },{
                'k': 'fill',
                'v': 'white'
            }]
        },{
            id: 'squareCross',
            name: 'Carré croix',
            path: editSvg.squareCrossPath,
            radius: 25,
            style: [{
                'k': 'stroke',
                'v': 'black'
            }, {
                'k': 'stroke-width',
                'v': '2'
            },{
                'k': 'fill',
                'v': 'white'
            }]
        },{
            id: 'cross',
            name: 'Croix',
            path: editSvg.crossPath,
            radius: 25,
            style: [{
                'k': 'stroke',
                'v': 'black'
            }, {
                'k': 'stroke-width',
                'v': '3'
            },{
                'k': 'fill',
                'v': 'black'
            }]
        },{
            id: 'cross2',
            name: 'Croix2',
            path: editSvg.crossPath,
            radius: 25,
            style: [{
                'k': 'stroke',
                'v': 'black'
            }, {
                'k': 'stroke-width',
                'v': '5'
            },{
                'k': 'fill',
                'v': 'black'
            }]
        },{
            id: 'cross3',
            name: 'Croix3',
            path: editSvg.crossPath,
            radius: 30,
            style: [{
                'k': 'stroke',
                'v': 'black'
            }, {
                'k': 'stroke-width',
                'v': '5'
            },{
                'k': 'fill',
                'v': 'black'
            }]
        },{
            id: 'horizontalRect',
            name: 'horizontalRect',
            path: editSvg.horizontalRectPath,
            radius: 20,
            style: [{
                'k': 'stroke',
                'v': 'black'
            }, {
                'k': 'stroke-width',
                'v': '10'
            },{
                'k': 'fill',
                'v': 'black'
            }]
        },{
            id: 'horizontalArrow',
            name: 'horizontalArrow',
            path: editSvg.horizontalArrowPath,
            radius: 100,
            style: [{
                'k': 'stroke',
                'v': 'grey'
            }, {
                'k': 'stroke-width',
                'v': '4'
            },{
                'k': 'fill',
                'v': 'grey'
            }]
        },{
            id: 'horizontalArrowHash',
            name: 'horizontalArrowHash',
            path: editSvg.horizontalArrowPath,
            radius: 100,
            style: [{
                'k': 'stroke-width',
                'v': '0'
            },{
                'k': 'fill',
                'v': POLYGON_STYLES.smallhashm45.url()
            }]
        },{
            id: 'horizontalArrowDots',
            name: 'horizontalArrowDots',
            path: editSvg.horizontalArrowPath,
            radius: 100,
            style: [{
                'k': 'stroke',
                'v': '#343434'
            }, {
                'k': 'stroke-width',
                'v': '2'
            },{
                'k': 'fill',
                'v': POLYGON_STYLES.smalldotsthicker2.url()
            }]
        },{
            id: 'horizontalArrowMedium',
            name: 'horizontalArrowMedium',
            path: editSvg.horizontalArrowPath,
            radius: 60,
            style: [{
                'k': 'stroke',
                'v': 'grey'
            }, {
                'k': 'stroke-width',
                'v': '4'
            },{
                'k': 'fill',
                'v': 'grey'
            }]
        },{
            id: 'horizontalArrowSmall',
            name: 'horizontalArrowSmall',
            path: editSvg.horizontalSmallArrowPath,
            radius: 30,
            style: [{
                'k': 'stroke',
                'v': 'grey'
            }, {
                'k': 'stroke-width',
                'v': '4'
            },{
                'k': 'fill',
                'v': 'grey'
            }]
        },{
            id: 'northOrientation',
            name: 'Flèche du Nord',
            path: editSvg.northOrientation,
            radius: 30,
            style: [{
                'k': 'stroke',
                'v': 'black'
            }, {
                'k': 'stroke-width',
                'v': '4'
            },{
                'k': 'fill',
                'v': 'none'
            }]
        }]},

        markerStart = [{
            id: 'null',
            name: 'Aucun'
        }, {
            id: 'arrowStartMarker',
            name: 'Flèche'
        }, {
            id: 'straightMarker',
            name: 'Trait'
        }],

        markerStop = [{
            id: 'null',
            name: 'Aucun'
        }, {
            id: 'arrowStopMarker',
            name: 'Flèche'
        }, {
            id: 'straightMarker',
            name: 'Trait'
        }],

        // XAPI_URL = 'http://overpass-api.de/api/interpreter?data=',
        XAPI_URL = 'http://api.openstreetmap.fr/oapi/interpreter/?data=',
        NOMINATIM_URL = 'http://nominatim.openstreetmap.org/search/',

        ACTIONS = {
            'point': [
                { icon: 'assets/icons/delete.svg', 
                    action: FeatureService.removeObject},
                { icon: 'assets/icons/open_with.svg', 
                    action: FeatureService.movePath },
                { icon: 'assets/icons/autorenew.svg', 
                    action: FeatureService.rotatePath },
                //{ icon: 'assets/icons/palette.svg', action: 'fill' },
                { icon: 'assets/icons/radio_button_checked.svg', 
                    action: FeatureService.emptyNearFeature },
                { icon: 'assets/icons/hearing.svg', 
                    action: InteractionService.addInteraction }
            ],
            'line': [
                { icon: 'assets/icons/delete.svg', 
                    action: FeatureService.removeObject },
                { icon: 'assets/icons/linear_scale.svg', 
                    action: FeatureService.movePoint },
                { icon: 'assets/icons/trending_flat.svg', 
                    action: FeatureService.toggleArrow },
                { icon: 'assets/icons/radio_button_checked.svg', 
                    action: FeatureService.emptyNearFeature },
                { icon: 'assets/icons/rounded_corner.svg', 
                    action: FeatureService.lineToCardinal }
            ],
            'polygon': [
                { icon: 'assets/icons/delete.svg', 
                    action: FeatureService.removeObject },
                { icon: 'assets/icons/linear_scale.svg', 
                    action: FeatureService.movePoint },
                { icon: 'assets/icons/texture.svg', 
                    action: FeatureService.changePattern },
                { icon: 'assets/icons/palette.svg', 
                    action: FeatureService.changeColor },
                { icon: 'assets/icons/radio_button_checked.svg', 
                    action: FeatureService.emptyNearFeature },
                { icon: 'assets/icons/crop_din.svg', 
                    action: FeatureService.toggleStroke }
            ],
            'circle': [
                { icon: 'assets/icons/delete.svg', 
                    action: FeatureService.removeObject },
                { icon: 'assets/icons/texture.svg', 
                    action: FeatureService.changePattern },
                { icon: 'assets/icons/palette.svg', 
                    action: FeatureService.changeColor },
                { icon: 'assets/icons/radio_button_checked.svg', 
                    action: FeatureService.emptyNearFeature },
                { icon: 'assets/icons/crop_din.svg', 
                    action: FeatureService.toggleStroke }
            ],
            'text': [
                { icon: 'assets/icons/delete.svg', 
                    action: FeatureService.removeObject },
                { icon: 'assets/icons/radio_button_checked.svg', 
                    action: FeatureService.textEmptyNearFeature }
            ],
            'default': [
                { icon: 'assets/icons/delete.svg', 
                    action: FeatureService.removeObject },
                { icon: 'assets/icons/crop_din.svg', 
                    action: FeatureService.toggleStroke },
                { icon: 'assets/icons/hearing.svg', 
                    action: InteractionService.addInteraction }
            ]
        };

        // Public API here
        return {
            XAPI_URL: XAPI_URL,
            NOMINATIM_URL: NOMINATIM_URL,
            FONTS: FONTS,
            COLORS: COLORS,
            FORMATS: FORMATS,
            DEFAULT_DRAWING_FORMAT: 'landscapeA4',
            DEFAULT_LEGEND_FORMAT: 'landscapeA4',
            QUERY_LIST: QUERY_LIST,
            QUERY_DEFAULT: QUERY_LIST[4],
            QUERY_POI: QUERY_LIST[0],
            POLYGON_STYLES: POLYGON_STYLES,
            STYLES: STYLES,
            ACTIONS: ACTIONS,
            markerStart: markerStart,
            markerStop: markerStop,
            leaflet: leafletConf,
            ratioPixelPoint: ratioPixelPoint,
            margin: margin,
            mapCategories: mapCategories
        };
    }

    angular.module(moduleApp)
        .factory('settings', settings);

    settings.$inject = ['editSvg', 'FeatureService', 'InteractionService'];

})();

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
/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.MapService
 * 
 * @requires accessimapEditeurDerApp.settings
 * @requires accessimapEditeurDerApp.SearchService
 * 
 * @description
 * Service used for initializing leaflet maps
 */
(function() {
    'use strict';

    function MapService($q, settings, SearchService) {

        var selectorDOM = '',
            map = {}, 
            overlay = null,
            layer,
            layerGroup,
            minHeight,
            minWidth;

        this.getMap                 = getMap;
        this.getTileLayer           = getTileLayer;
        this.getBounds              = getBounds;
        this.initMap                = initMap;
        this.resizeFunction         = resizeFunction;
        
        this.addClickListener       = addClickListener;
        this.addMouseMoveListener   = addMouseMoveListener;
        this.addDoubleClickListener = addDoubleClickListener;
        this.removeEventListeners   = removeEventListeners;
        
        this.addMoveHandler         = addMoveHandler;
        this.removeMoveHandler      = removeMoveHandler;
        this.addViewResetHandler    = addViewResetHandler;
        this.removeViewResetHandler = removeViewResetHandler;
        
        this.changeCursor           = changeCursor;
        this.resetCursor            = resetCursor;
        this.projectPoint           = projectPoint;
        this.latLngToLayerPoint     = latLngToLayerPoint;
        
        this.showMapLayer           = showMapLayer;
        this.hideMapLayer           = hideMapLayer;
        
        this.freezeMap              = freezeMap;
        this.unFreezeMap            = unFreezeMap;
        
        this.searchAddress          = SearchService.searchAddress
        this.resetZoom              = resetZoom;
        this.setMinimumSize         = setMinimumSize;

        /**
         * @ngdoc method
         * @name  retrieveData
         * @methodOf accessimapEditeurDerApp.MapService
         *
         * @description 
         * alias of accessimapEditeurDerApp.SearchService:retrieveData
         */
        this.retrieveData = SearchService.retrieveData;

        /**
         * @ngdoc method
         * @name  initMap
         * @methodOf accessimapEditeurDerApp.MapService
         * 
         * @description 
         * Init a map with leaflet library
         * 
         * @param  {string} selector 
         * Id of the leaflet's map container
         */
        function initMap(_selectorDOM, _minWidthMM, _minHeightMM, _ratioPixelPoint, _resizeFunction) {

            selectorDOM = _selectorDOM;
            setMinimumSize(_minWidthMM / _ratioPixelPoint, _minHeightMM / _ratioPixelPoint)

            map = L.map(selectorDOM).setView(settings.leaflet.GLOBAL_MAP_CENTER, settings.leaflet.GLOBAL_MAP_DEFAULT_ZOOM);
            var access_token = "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw";
            
            layer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + access_token, {
                maxZoom: 18,
                attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                    'Imagery © <a href="http://mapbox.com">Mapbox</a>',
                id: 'mapbox.streets'
            })

            L.control.coordinates({
                position:"topright", //optional default "bootomright"
                enableUserInput:true, //optional default true
                useLatLngOrder: true, //ordering of labels, default false-> lng-lat
            }).addTo(map);
            
            // , layer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            //     attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            // }).addTo(map);
            // 

            // Use Leaflet to implement a D3 geometric transformation.
            $(window).on("resize", _resizeFunction).trigger("resize");
        }

        function setMinimumSize(width, height) {
            minWidth = width;
            minHeight = height;
            $('#' + selectorDOM).css('min-height', minHeight)
            $('#' + selectorDOM).css('min-width', minWidth)

        }

        /**
         * @ngdoc method
         * @name  projectPoint
         * @methodOf accessimapEditeurDerApp.MapService
         * 
         * @description 
         * Project a geographical point to a layer map point
         * Useful for d3 projections
         * 
         * @param  {integer} x 
         * Latitude
         * 
         * @param  {integer} y 
         * Longitude
         * 
         * @return {Array}    
         * Point with projected coordinates
         */
        function projectPoint(x, y) {
            var point = map.latLngToLayerPoint(new L.LatLng(y, x));

            if (this && this.stream) {
                this.stream.point(point.x, point.y);
            } else {
                return point;
            }
        }

        function latLngToLayerPoint(point) {
            return map.latLngToLayerPoint(point);
        }

        /**
         * @ngdoc method
         * @name  resizeFunction
         * @methodOf accessimapEditeurDerApp.MapService
         * 
         * @description 
         * Get the current size of the container
         * 
         * Calc the available space for the map by substracting siblings height
         * 
         * Change the height of the leaflet map and apply for changes
         * 
         * @param  {string} selector 
         * Id of the leaflet's map container
         */
        function resizeFunction() {
            var parentHeight = $('#' + selectorDOM).parent().height(),
                parentWidth = $('#' + selectorDOM).parent().width(),
                siblingHeight = $($('#' + selectorDOM).siblings()[0]).outerHeight(true),
                mapHeight = ( ( parentHeight - siblingHeight ) > minHeight ) ? ( parentHeight - siblingHeight ) : minHeight,
                mapWidth = ( parentWidth > minWidth ) ? 'auto' : minWidth;

            // $("#" + selectorDOM).height('calc(100vh - 80px)');
            // $("#" + selectorDOM).width(mapWidth);
            map.invalidateSize();

        }

        var listeners = [];

        /**
         * @ngdoc method
         * @name  addClickListener
         * @methodOf accessimapEditeurDerApp.MapService
         * 
         * @description 
         * Add a listener to the click event
         * 
         * @param {function} listener 
         * function executed when click event is fired
         */
        function addClickListener(listener) {
            listeners.push({event: 'click', function: listener})
            map.addEventListener('click', listener);
        }

        /**
         * @ngdoc method
         * @name  addMouseMoveListener
         * @methodOf accessimapEditeurDerApp.MapService
         * 
         * @description 
         * Add a listener to the mousemove event
         * 
         * @param {function} listener 
         * function executed when mousemove event is fired
         */
        function addMouseMoveListener(listener) {
            listeners.push({event: 'mousemove', function: listener})
            map.addEventListener('mousemove', listener);
        }

        /**
         * @ngdoc method
         * @name  addDoubleClickListener
         * @methodOf accessimapEditeurDerApp.MapService
         * 
         * @description 
         * Add a listener to the doubleclick event
         * 
         * @param {function} listener 
         * function executed when doubleclick event is fired
         */
        function addDoubleClickListener(listener) {
            listeners.push({event: 'contextmenu', function: listener})
            map.addEventListener('contextmenu', listener);
        }

        /**
         * @ngdoc method
         * @name  removeEventListener
         * @methodOf accessimapEditeurDerApp.MapService
         * 
         * @description 
         * Remove all the listener to the map
         */
        function removeEventListeners() {
            listeners.forEach(function(currentValue) {
                map.removeEventListener(currentValue.event, currentValue.function)
            })
        }

        /**
         * @ngdoc method
         * @name  changeCursor
         * @methodOf accessimapEditeurDerApp.MapService
         * 
         * @description 
         * Change the CSS appearance of the cursor on the map
         * 
         * @param  {string} style 
         * CSS style for cursor property : 'crosshair', '...' 
         * 
         * https://developer.mozilla.org/fr/docs/Web/CSS/cursor
         */
        function changeCursor(style) {
            $('#' + selectorDOM).css('cursor', style);
        }

        /**
         * @ngdoc method
         * @name  resetCursor
         * @methodOf accessimapEditeurDerApp.MapService
         * 
         * @description 
         * Reset to 'default' the cursor on the map
         */
        function resetCursor() {
            changeCursor('default');
        }

        /**
         * @ngdoc method
         * @name  getBounds
         * @methodOf accessimapEditeurDerApp.MapService
         * 
         * @description 
         * Returns the LatLngBounds of the current map view
         * 
         * http://leafletjs.com/reference.html#map-getbounds
         *
         * @return {LatLngBounds} 
         * LatLngBounds of the current map view
         */
        function getBounds() {
            return map.getBounds();
        }

        /**
         * @ngdoc method
         * @name  getMap
         * @methodOf accessimapEditeurDerApp.MapService
         * 
         * @description Getter for the map property
         * 
         * @return {Object} Leaflet map
         */
        function getMap() {
            return map;
        }

        function getTileLayer() {
            return layer;
        }

        function showMapLayer() {
            map.addLayer(layer);
        }

        function hideMapLayer() {
            map.removeLayer(layer);
        }

        function freezeMap() {
            map.setMaxBounds(map.getBounds());
        }

        function unFreezeMap() {
            map.setMaxBounds(null);
        }

        function addMoveHandler(callback) {
            map.on('move', function(event) {
                callback(map.getSize(), map.getPixelOrigin(), map.getPixelBounds().min);
            })
            map.fire('move');
        }

        function removeMoveHandler() {
            map.off('move');
        }

        function addViewResetHandler(callback) {
            map.on('viewreset', function(event) {
                callback(event, map.getPixelOrigin(), map.getZoom());
            })
            map.fire('viewreset');
        }

        function removeViewResetHandler() {
            map.off('viewreset');
        }

        function resetZoom() {
            map.setZoom(settings.leaflet.GLOBAL_MAP_DEFAULT_ZOOM);
        }

    }

    angular.module(moduleApp).service('MapService', MapService);

    MapService.$inject = ['$q', 'settings', 'SearchService'];

})();
/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.DefsService
 * 
 * @description
 * Service provinding a method to add 'definitions' patterns to a svg
 */
(function() {
    'use strict';

    function DefsService(settings) {

        this.createDefs = createDefs;

        console.log('settings')
        console.log(settings)

        /**
         * @ngdoc method
         * @name  accessimapEditeurDerApp.DefsService.createDefs
         * @methodOf accessimapEditeurDerApp.DefsService
         *
         */
        function createDefs(node) {

            var _defs = node.append('svg')
                            .attr("data-name", "defs")
                            .append("defs");

            _defs.append('marker')
                    .attr('id', 'arrowStartMarker')
                    .attr('refX', 5)
                    .attr('refY', 5)
                    .attr('markerWidth', 10)
                    .attr('markerHeight', 10)
                    .attr('orient', 'auto')
                .append('path')
                    .attr('d', 'M9,1 L5,5 9,9')
                    .attr('style', 'fill:none;stroke:#000000;stroke-opacity:1');

            _defs.append('marker')
                    .attr('id', 'arrowStopMarker')
                    .attr('refX', 5)
                    .attr('refY', 5)
                    .attr('markerWidth', 10)
                    .attr('markerHeight', 10)
                    .attr('orient', 'auto')
                .append('path')
                    .attr('d', 'M1,1 L5,5 1,9')
                    .attr('style', 'fill:none;stroke:#000000;stroke-opacity:1');

            _defs.append('marker')
                    .attr('id', 'straightMarker')
                    .attr('refX', 1)
                    .attr('refY', 5)
                    .attr('markerWidth', 2)
                    .attr('markerHeight', 10)
                    .attr('orient', 'auto')
                .append('path')
                    .attr('d', 'M1,1 L1,9')
                    .attr('style', 'fill:none;stroke:#000000;stroke-opacity:1');

            Object.keys(settings.POLYGON_STYLES).forEach(function(value, index, array) {
                _defs.call(settings.POLYGON_STYLES[value]);
            });

        };

    }

    angular.module(moduleApp).service('DefsService', DefsService);

    DefsService.$inject = ['settings'];

})();

/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.LegendService
 * @description
 * Service providing drawing functions
 * Provide functions to 
 * - init a map/draw area
 * - draw features
 * - export data
 */
(function() {
    'use strict';

    function LegendService(settings) {

        this.initLegend        = initLegend;
        this.showFontBraille   = showFontBraille;
        this.hideFontBraille   = hideFontBraille;
        this.addToLegend       = addToLegend;
        this.draw              = draw;
        this.getNode           = function() { return _svg.node();}

        var _width,
            _height,
            _margin,
            _ratioPixelPoint,
            _fontBraille,
            _svg,
            frameGroup;

        /**
         * @ngdoc method
         * @name  initLegend
         * @methodOf accessimapEditeurDerApp.LegendService
         *
         * @description
         * Create the legend svg in a dom element with specific size
         *
         * @param  {string} id     
         * id of element in which will be appended svg
         * 
         * @param  {integer} width  
         * width in millimeters of the svg created
         * 
         * @param  {integer} height 
         * height in millimeters of the svg created
         * 
         * @param  {integer} margin 
         * margin of border in millimeters of the svg created
         * 
         * @param  {integer} ratioPixelPoint 
         * ratioPixelPoint ? TODO please explain it...
         */
        function initLegend(id, width, height, margin, ratioPixelPoint) {
            
            _width = width / ratioPixelPoint;
            _height = height / ratioPixelPoint;
            _margin = margin;
            _ratioPixelPoint = ratioPixelPoint;
            
            _svg = d3.select(id).append('svg');

            frameGroup  = _svg.append('g');

            draw(_width, _height);

            _svg.append('text')
                    .attr('x', function() {
                        return _margin;
                    })
                    .attr('y', function() {
                        return _margin * 2;
                    })
                    .attr('font-size', '35px')
                    .text(function() {
                        return 'Légende';
                    })

            showFontBraille();

            return _svg;
        }

        /**
         * @ngdoc method
         * @name  showFontBraille
         * @methodOf accessimapEditeurDerApp.LegendService
         *
         * @description 
         * Show the 'braille' font on the legend's svg.
         */
        function showFontBraille() {

            _svg.classed('braille', true)
                .attr('font-family', 'Braille_2007');

        }

        /**
         * @ngdoc method
         * @name  hideFontBraille
         * @methodOf accessimapEditeurDerApp.LegendService
         *
         * @description 
         * Hide the 'braille' font on the legend's svg and display it in Arial
         */
        function hideFontBraille() {

            _svg.classed('braille', false)
                .attr('font-family', 'Arial');

        }

        /**
         * @ngdoc method
         * @name  draw
         * @methodOf accessimapEditeurDerApp.LegendService
         *
         * @description 
         * Draw a frame linked to the width & height arguments
         * 
         * @param  {integer} width  
         * Width in pixel of the printing format
         * 
         * @param  {integer} height 
         * Height in pixel of the printing format
         */
        function draw(width, height) {

            _width = width;
            _height = height;

            _svg.attr('width', _width)
                .attr('height', _height)
                .attr('viewBox', '0 0 ' + _width + ' ' + _height);

            createFramePath();

        }



        /**
         * @ngdoc method
         * @name  createFramePath
         * @methodOf accessimapEditeurDerApp.LegendService
         *
         * @description 
         * Create a frame of the legend, telling user about the print format
         */
        function createFramePath() {
            var w40 = _width - _margin,
                h40 = _height - _margin;

            frameGroup.selectAll("*").remove();

            frameGroup.append('path')
                .attr('d', function() {
                    return 'M ' + _margin + ' ' + _margin + ' L ' 
                                    + w40 
                                    + ' ' + _margin + ' L ' 
                                    + w40 
                                    + ' ' 
                                    + h40 
                                    + ' L ' + _margin + ' ' 
                                    + h40 
                                    + ' L ' + _margin + ' ' + _margin + ' z';
                })
                .attr('fill', 'none')
                .attr('opacity', '.75')
                .attr('stroke', '#000000')
                .attr('stroke-width', '2px')
                .attr('stroke-opacity', '1')
                .attr('id', 'svgContainer')
                .classed('notDeletable', true);
        };

        /**
         * @ngdoc method
         * @name  addToLegend
         * @methodOf accessimapEditeurDerApp.LegendService
         * 
         * @description 
         * Add a text in the legend
         * 
         * @param {Object} query    
         * [description]
         * 
         * @param {Object} style    
         * [description]
         * 
         * @param {Object} position 
         * [description]
         */
        function addToLegend(query, style, position, colorChosen, checkboxModel) {
            var legendGroup = _svg.append('g')
                    .attr('class', 'legend')
                    .attr('id', query.id),
                symbol;

            switch(query.type) {
                case 'line':
                    symbol = legendGroup.append('line')
                        .attr('x1', function() {
                            return _margin * 2;
                        })
                        .attr('y1', function() {
                            return ( position + 1 ) * 40 +_margin * 2;
                        })
                        .attr('x2', function() {
                            return _margin * 2 + 40;
                        })
                        .attr('y2', function() {
                            return ( position + 1 ) * 40 +_margin * 2;
                        })
                        .attr('class', 'symbol')
                        .attr('fill', 'red');

                    var symbolInner = legendGroup.append('line')
                        .attr('x1', function() {
                            return _margin * 2;
                        })
                        .attr('y1', function() {
                            return ( position + 1 ) * 40 +_margin * 2;
                        })
                        .attr('x2', function() {
                            return _margin * 2 + 40;
                        })
                        .attr('y2', function() {
                            return ( position + 1 ) * 40 +_margin * 2;
                        })
                        .attr('class', 'symbol')
                        .attr('class', 'inner')
                        .attr('fill', 'red');

                    angular.forEach(style.style, function(attribute) {
                        var k = attribute.k,
                            v = attribute.v;

                        if (typeof(v) === 'function') {
                            v = v.url();
                        }
                        symbol.attr(k, v);
                    });

                    if (style.styleInner) {
                        angular.forEach(style.styleInner, function(attribute) {
                            var k = attribute.k,
                                v = attribute.v;

                            if (typeof(v) === 'function') {
                                v = v.url();
                            }
                            symbolInner.attr(k, v);
                        });
                    }
                    break;

                case 'point':
                    symbol = legendGroup.append('path')
                        .attr('cx',_margin * 2 + 20)
                        .attr('cy', ( position + 1 ) * 40 +_margin * 2 + style.radius / 2)
                        .attr('d', function() {
                            var x = parseFloat(d3.select(this).attr('cx')),
                                    y = parseFloat(d3.select(this).attr('cy'));

                            return style.path(x, y, style.radius);
                        })
                        .attr('class', 'symbol')
                        .attr('fill', 'red');
                    break;

                case 'polygon':
                    symbol = legendGroup.append('rect')
                        .attr('x', function() {
                            return _margin * 2;
                        })
                        .attr('y', function() {
                            return ( position + 1 ) * 40 +_margin * 2 - 15;
                        })
                        .attr('width', function() {
                            return 40;
                        })
                        .attr('height', function() {
                            return 15;
                        })
                        .attr('class', 'symbol')
                        .attr('fill', 'red');
                    break;
            }

            angular.forEach(style.style, function(attribute) {
                var k = attribute.k,
                    v = attribute.v;

                if (k === 'fill-pattern') {
                    if (colorChosen && colorChosen.color !== 'none') {
                        v += '_' + colorChosen.color;
                    }
                    symbol.attr('fill', settings.POLYGON_STYLES[v].url());
                } else {
                    symbol.attr(k, v);
                }
            });

            if (checkboxModel && checkboxModel.contour && !symbol.attr('stroke')) {
                symbol
                    .attr('stroke', 'black')
                    .attr('stroke-width', '2');
            }

            legendGroup
                .append('text')
                .attr('x', function() {
                    return _margin * 2 + 50;
                })
                .attr('y', function() {
                    return ( position + 1 )* 40 +_margin * 2 ;
                })
                .attr('font-size', '35px')
                .text(function() {
                    return query.name;
                });
        }

    }

    angular.module(moduleApp).service('LegendService', LegendService);

    LegendService.$inject = ['settings'];

})();
/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.LayerBackgroundService
 * 
 * @description
 * Service providing the management of background layer
 */
(function() {
    'use strict';

    function LayerBackgroundService() {

        this.createLayer = createLayer;
        this.append      = append;
        this.appendImage = appendImage;

        var _width,
            _height,
            _margin,
            _target, 
            _projection,
            _g;


        function createLayer(target, width, height, margin, projection) {
            _width      = width;
            _height     = height;
            _margin     = margin;
            _target     = target;
            _projection = projection;
            
            _g = _target.attr("data-name", "background-layer")
                    .attr('id', 'background-layer')

        }

        function append(element) {
            _g.append(d3.select(element).node());
        }

        function appendImage(dataUrl, size, pixelOrigin, pixelBoundMin) {

            var ratioSvg = _height / _width,
                img = new Image();

            img.src = dataUrl;
            img.onload = function() { // need to load the image to obtain width & height
                var width = this.width,
                    height = this.height,
                    ratio = height / width,
                    w, 
                    h;

                if (ratio > ratioSvg) {
                    h = _height;
                    w = h / ratio;
                } else {
                    w = _width;
                    h = w * ratio;
                }

                // calculate coordinates
                var x = 
                    // to get x, we calc the space between left and the overlay
                    ( ( size.x - w) / 2 ) 
                    // and we substract the difference between the original point of the map 
                    // and the actual bounding topleft point
                    - (pixelOrigin.x - pixelBoundMin.x),

                y = 
                    // to get y, we calc the space between the middle axe and the top of the overlay
                    h / -2 
                    // and we substract the difference between the original point of the map
                    // and the actual bounding topleft point
                    - (pixelOrigin.y - pixelBoundMin.y - size.y / 2);

                _g.selectAll('*').remove();

                _g.append('image')
                    .attr('x', x)
                    .attr('y', y)
                    .attr('width', w)
                    .attr('height', h)
                    .attr('xlink:href', dataUrl);

            };

        }

    }

    angular.module(moduleApp).service('LayerBackgroundService', LayerBackgroundService);

    LayerBackgroundService.$inject = [];

})();
/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.LayerDrawingService
 * @requires accessimapEditeurDerApp.LayerService
 * 
 * @description
 * Service providing drawing functions
 * Provide functions to 
 * - init a map/draw area
 * - draw features
 */
(function() {
    'use strict';

    function LayerDrawingService() {

        var _target,
            _g;

        this.createLayer = createLayer;

        function createLayer(target) {
            
            _target = target;

            _g = _target
                    // .append("_g")
                    .attr("data-name", "drawing-layer")
                    .attr("id", "drawing-layer");

            createDrawing();
        }

        /**
         * @ngdoc method
         * @name  accessimapEditeurDerApp.LayersService.createDrawing
         * @methodOf accessimapEditeurDerApp.LayersService
         *
         * @param  {Object} target  [description]
         */
        function createDrawing() {
            _g.append('g').attr('data-name', 'polygons-layer');
            _g.append('g').attr('data-name', 'lines-layer');
            _g.append('g').attr('data-name', 'points-layer');
            _g.append('g').attr('data-name', 'text-layer');
        };

    }

    angular.module(moduleApp).service('LayerDrawingService', LayerDrawingService);

    LayerDrawingService.$inject = [];

})();
/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.LayerGeoJSONService
 * @requires accessimapEditeurDerApp.LayerService
 * @description
 * Service providing drawing functions
 * Provide functions to 
 * - init a map/draw area
 * - draw features
 */
(function() {
    'use strict';

    function LayerGeoJSONService(settings, LegendService) {

        var _geojson = [],
            _projection,
            _g,
            _lastTranslationX,
            _lastTranslationY;

        this.createLayer   = createLayer;
        
        this.geojsonToSvg  = geojsonToSvg;
        this.removeFeature = removeFeature;
        this.updateFeature = updateFeature;
        this.rotateFeature = rotateFeature;
        this.drawAddress   = drawAddress;
        this.transform     = transform;
        
        this.getFeatures   = function() { 
            return _geojson.slice(0)
        }
        this.setFeatures   = function(features) { 
            _geojson = features ;
        }

        this.refresh     = refresh;
        this.translate     = translate;

        function createLayer(target, width, height, margin, projectPoint) {
            _projection = projectPoint;

            _g = target
                    .attr("data-name", "geojson-layer")
                    .attr("id", "geojson-layer");

            createDrawing();
        }

        /**
         * @ngdoc method
         * @name  accessimapEditeurDerApp.LayerGeoJSONService.createDrawing
         * @methodOf accessimapEditeurDerApp.LayerGeoJSONService
         */
        function createDrawing() {
            _g.append('g').attr('data-name', 'polygons-layer');
            _g.append('g').attr('data-name', 'lines-layer');
            _g.append('g').attr('data-name', 'points-layer');
            _g.append('g').attr('data-name', 'text-layer');
        };

        function transform(transform) {
            _g.attr('transform', transform)
        }

        /**
         * @ngdoc method
         * @name refresh
         * @methodOf accessimapEditeurDerApp.LayerGeoJSONService
         * 
         * @description 
         * Project all paths from _geojson
         */
        function refresh(_projection) {
            
            _geojson.forEach(function (geojson) {

                d3.selectAll('path.' + geojson.id)
                        .filter(function(d) {
                            return d.geometry.type !== 'Point'; })
                        .attr('d', _projection.pathFromGeojson)
                        .attr('stroke-width', 2 / _projection.scale)

                d3.selectAll('path.inner.' + geojson.id)
                        .filter(function(d) {
                            return d.geometry.type !== 'Point'; })
                        .attr('d', _projection.pathFromGeojson)
                        .attr('stroke-width', 2 / _projection.scale)

                d3.selectAll('path.' + geojson.id)
                        .filter(function(d) {
                            return d.geometry.type === 'Point'; })
                        .attr('stroke-width', 2 / _projection.scale)
                        .attr('cx', function(d) {
                            return _projection.latLngToLayerPoint(L.latLng(d.geometry.coordinates[1], d.geometry.coordinates[0])).x;
                        })
                        .attr('cy', function(d) {
                            return _projection.latLngToLayerPoint(L.latLng(d.geometry.coordinates[1], d.geometry.coordinates[0])).y;
                        })
                        .attr('d', function(d) {
                            var coords = _projection.latLngToLayerPoint(L.latLng(d.geometry.coordinates[1], d.geometry.coordinates[0]));

                            return geojson.style.path(coords.x, coords.y, geojson.style.radius / _projection.scale);
                        })
                        .attr('transform', function(d) {
                            var result = '';

                            if (this.transform.baseVal.length > 0) {
                                var coords = _projection.latLngToLayerPoint(L.latLng(d.geometry.coordinates[1], d.geometry.coordinates[0]));
                                // var coords = _projection(d.geometry.coordinates);

                                // result += 'rotate(' + geojson.rotation + ' ' + coords[0] + ' ' + coords[1] + ');';
                                result += 'rotate(' + geojson.rotation + ')';//' ' + coords.x + ' ' + coords.y + ');';
                            }

                            return result;
                        });
            });
            
        }

        /**
         * Function moving the overlay svg, thanks to map movements...
         *
         * This function has to be used only if we want the overlay be 'fixed'
         * 
         * TODO: clear the dependencies to map... maybe, give the responsability to the map
         * and so, thanks to a 'class', we could 'freeze' the overlay thanks to this calc
         */
        function translate(size, pixelOrigin, pixelBoundMin) {

            // x,y are coordinates to position overlay
            // coordinates 0,0 are not the top left, but the point at the middle left
            _lastTranslationX = 
                // to get x, we calc the space between left and the overlay
                ( ( size.x ) / 2 ) 
                // and we substract the difference between the original point of the map 
                // and the actual bounding topleft point
                - (pixelOrigin.x - pixelBoundMin.x),

            _lastTranslationY = 
                // to get y, we calc the space between the middle axe and the top of the overlay
                // and we substract the difference between the original point of the map
                // and the actual bounding topleft point
                -1 * (pixelOrigin.y - pixelBoundMin.y - size.y / 2);

            _g.attr("transform", "translate(" + (_lastTranslationX ) +"," + (_lastTranslationY) + ")")
        }
        /**
         * @ngdoc method
         * @name  geojsonToSvg
         * @methodOf accessimapEditeurDerApp.LayerGeoJSONService
         * 
         * @description 
         * simplify... ?
         * 
         * @param  {Object} data       
         * [description]
         * 
         * @param  {Object} feature       
         * [description]
         * 
         * @param  {Object} optionalClass 
         * [description]
         */
        function geojsonToSvg(data, simplification, id, poi, queryChosen, styleChosen, 
            styleChoices, colorChosen, checkboxModel, rotationAngle) {
            if (data) {
                // data.features.forEach(function(feature, index) {
                //     if (simplification) {
                //         data.features[index] = turf.simplify(feature, simplification, false);
                //     }
                // });

                var featureExists, obj;

                if (id) {
                    featureExists = _geojson.filter(function(obj) {
                        return obj.id === id;
                    });
                } else {
                    featureExists = _geojson.filter(function(obj) {
                        return obj.id === queryChosen.id;
                    });
                }

                if (featureExists.length === 0) {

                    if (poi) {
                        var tags = data.features[0].properties.tags,
                            name = tags.name || tags.amenity || tags.shop || 'POI';
                        obj = {
                            id: id,
                            name: name,
                            type: queryChosen.type,
                            layer: $.extend(true, {}, data), //deep copy,
                            originallayer: $.extend(true, {}, data), //deep copy
                            style: styleChosen,
                            styleChoices: styleChoices,
                            rotation: 0
                        };
                        LegendService.addToLegend({'type': 'point', 'name': name, 'id': id}, 
                                    styleChosen, 
                                    _geojson.length, 
                                    colorChosen, 
                                    checkboxModel);
                    } else {
                        obj = {
                            id: queryChosen.id,
                            name: queryChosen.name,
                            type: queryChosen.type,
                            layer: $.extend(true, {}, data), //deep copy,
                            originallayer: $.extend(true, {}, data), //deep copy
                            style: styleChosen,
                            styleChoices: styleChoices,
                            contour: checkboxModel.contour,
                            color: colorChosen
                        };
                        LegendService.addToLegend(queryChosen, styleChosen, _geojson.length, colorChosen, checkboxModel);
                    }
                    _geojson.push(obj);
                    drawFeature(data, [obj], null, styleChosen, colorChosen, checkboxModel, rotationAngle);

                    if (styleChosen.styleInner) {
                        drawFeature(data, [obj], 'inner', styleChosen, colorChosen, checkboxModel, rotationAngle);
                    }

                } else {
                    drawFeature(data, featureExists, null, styleChosen, colorChosen, checkboxModel, rotationAngle);

                    if (styleChosen.styleInner) {
                        drawFeature(data, 
                            featureExists, 
                            'inner', 
                            styleChosen, 
                            colorChosen, 
                            checkboxModel, 
                            rotationAngle);
                    }
                }
            }
        }

        /**
         * @ngdoc method
         * @name  drawAddress
         * @methodOf accessimapEditeurDerApp.LayerGeoJSONService
         *
         * @description 
         * draw a circle for an address
         * 
         * @param  {Object} data
         * data returned by a nominatim server, containing geometry & other stuff
         * to display the poi
         * 
         * @param  {string} id
         * specific string identifying this address
         * useful to erase the d3 node
         * 
         * @param  {settings.STYLES} style
         * style of the point ... ?
         * 
         * @param  {settings.COLORS} color 
         * Color of the POI
         * 
         */
        function drawAddress(data, id, style, color) {
            var lon = data.lon,
                lat = data.lat,
                point = turf.point([lon, lat]);

            // Draw a point
            if (d3.select(id).node()) {
                d3.select(id).remove();
            }

            var obj = {
                id: id,
                name: id,
                type: 'point',
                layer: $.extend(true, {}, point), //deep copy,
                originallayer: $.extend(true, {}, point), //deep copy
                style: settings.STYLES.point[0],
                styleChoices: settings.STYLES.point,
                rotation: 0
            };

            _geojson.push(obj);

            var features = turf.featurecollection([point]);
            drawFeature(features, [obj], null, style, color, null, 0);

        }

        /**
         * @ngdoc method
         * @name  drawFeature
         * @methodOf accessimapEditeurDerApp.LayerGeoJSONService
         * 
         * @description 
         * Draw the features
         * 
         * @param  {Object} data       
         * [description]
         * 
         * @param  {Object} feature       
         * [description]
         * 
         * @param  {Object} optionalClass 
         * [description]
         * 
         * @param  {Object} styleChosen 
         * [description]
         * 
         * @param  {Object} colorChosen 
         * [description]
         * 
         * @param  {Object} checkboxModel 
         * [description]
         * 
         * @param  {Object} rotationAngle 
         * [description]
         */
        function drawFeature(data, feature, optionalClass, styleChosen, 
            colorChosen, checkboxModel, rotationAngle) {
            var featureGroup,
                type = feature[0].type,
                drawingLayer = d3.select(_g).node().select('[data-name="' + type + 's-layer"]') ; /* d3.select('#' + type + 's-layer') ;*/
            
            if (optionalClass) {
                if (d3.select('.vector.' + optionalClass + '#' + feature[0].id).empty()) {
                    featureGroup = drawingLayer.append('g')
                    .classed('vector', true)
                    .classed(optionalClass, true)
                    .classed('rotable', true)
                    .attr('id', feature[0].id);
                } else {
                    featureGroup = d3.select('.vector.' + optionalClass + '#' + feature[0].id);
                }
            } else {
                if (d3.select('.vector#' + feature[0].id).empty()) {
                    featureGroup = drawingLayer.append('g')
                    .classed('vector', true)
                    .classed('rotable', true)
                    .attr('id', feature[0].id);
                } else {
                    featureGroup = d3.select('.vector#' + feature[0].id);
                }
            }

            featureGroup
                .selectAll('path')
                // specific for every features except points
                .data(data.features.filter(function(d) {
                    return d.geometry.type !== 'Point';
                }))
                .enter().append('path')
                .attr('class', function(d) {
                    if (optionalClass) {
                        return feature[0].id + ' ' + optionalClass + ' link_' + d.properties.id;
                    } else {
                        return feature[0].id + ' link_' + d.properties.id;
                    }
                })
                .attr('data-link', function(d) {
                    return d.properties.id;
                })
                .attr('name', function(d) {
                    if (d.properties.tags) {
                        return d.properties.tags.name;
                    }
                })
                .attr('e-style', styleChosen.id)
                .attr('e-color', colorChosen.color)
                // .attr('stroke-width', 2 / _projection.scale)
                .attr('d', function(d) {
                    return _projection.pathFromGeojson(d);
                })
                .append('svg:title')
                .text(function(d) { 
                    return d.properties.tags.name; 
                })

                // specific for point's features
                .data(data.features.filter(function(d) {
                    return d.geometry.type === 'Point';
                }))
                .enter().append('path')
                .attr('class', feature[0].id)
                .attr('name', function(d) {
                    if (d.properties.tags) {
                        return d.properties.tags.name;
                    }
                })
                // .attr('stroke-width', 2 / _projection.scale)
                .attr('cx', function(d) {
                    return _projection.latLngToLayerPoint(L.latLng(d.geometry.coordinates[1], d.geometry.coordinates[0])).x;
                    // return _projection(d.geometry.coordinates[0], d.geometry.coordinates[1]).x;
                })
                .attr('cy', function(d) {
                    return _projection.latLngToLayerPoint(L.latLng(d.geometry.coordinates[1], d.geometry.coordinates[0])).y;
                    // return _projection(d.geometry.coordinates[0], d.geometry.coordinates[1]).y;
                })
                .attr('d', function(d) {
                    var coords = _projection.latLngToLayerPoint(L.latLng(d.geometry.coordinates[1], d.geometry.coordinates[0]));
                    // var coords = _projection(d.geometry.coordinates[0], d.geometry.coordinates[1]);

                    return feature[0].style.path(coords.x, coords.y, feature[0].style.radius /* / _projection.scale */);
                });

            // settings style attributes
            angular.forEach(feature[0].style.style, function(attribute) {
                var k = attribute.k,
                    v = attribute.v;

                if (k === 'fill-pattern') {
                    if (colorChosen && colorChosen.color !== 'none') {
                        v += '_' + colorChosen.color;
                    }
                    d3.select('#' + feature[0].id).attr('fill', settings.POLYGON_STYLES[v].url());
                } else {
                    d3.select('#' + feature[0].id).attr(k, v);
                }
            });

            if (optionalClass) {
                angular.forEach(feature[0].style.styleInner, function(attribute) {
                    var k = attribute.k,
                        v = attribute.v;

                    if (k === 'fill-pattern') {
                        if (colorChosen && colorChosen.color !== 'none') {
                            v += '_' + colorChosen.color;
                        }
                        d3.select('.' + optionalClass + '#' + feature[0].id)
                            .attr('fill', settings.POLYGON_STYLES[v].url());
                    } else {
                        d3.select('.' + optionalClass + '#' + feature[0].id)
                            .attr(k, v);
                    }
                });
            }

            if (checkboxModel 
                && checkboxModel.contour 
                && !d3.select('#' + feature[0].id).attr('stroke')) {
                d3.select('#' + feature[0].id)
                    .attr('stroke', 'black')
                    .attr('stroke-width', '2');
            }

            if (optionalClass) {
                angular.forEach(feature[0].style['style_' + optionalClass], function(attribute) {
                    d3.select('.' + optionalClass + '#' + feature[0].id)
                        .attr(attribute.k, attribute.v);
                });
            }

            // // Update the uid so to ensure this will be unique
            // angular.forEach(data.features, function(f) {
            //     if ($rootScope.uid < f.properties.id) {
            //         $rootScope.uid = f.properties.id;
            //     }
            // });

            // rotate(rotationAngle);
        }
        
        /**
         * @ngdoc method
         * @name  updateFeature
         * @methodOf accessimapEditeurDerApp.LayerGeoJSONService
         * 
         * @description  
         * update the style of a 'feature' = item of '_geojson' collection.
         *
         * @param  {Object} id 
         * id of the feature
         */
        function updateFeature(id, style) {

            var result = _geojson.filter(function(obj) {
                    return obj.id === id;
                }),
                objectId = _geojson.indexOf(result[0]);

            if (_geojson[objectId].contour) {
                d3.select('#' + id)
                    .attr('stroke', 'black')
                    .attr('stroke-width', '2');
            } else {
                d3.select('#' + id)
                    .attr('stroke', null)
                    .attr('stroke-width', null);
            }

            angular.forEach(style.style, function(attribute) {
                var k = attribute.k,
                    v = attribute.v;

                if (k === 'fill-pattern') {
                    if (_geojson[objectId].color && _geojson[objectId].color.color !== 'none') {
                        v += '_' + _geojson[objectId].color.color;
                    }
                    d3.select('#' + id)
                        .attr('fill', settings.POLYGON_STYLES[v].url());
                } else {
                    d3.select('#' + id)
                        .attr(k, v);
                }
            });

            if (style.styleInner) {
                angular.forEach(style.styleInner, function(attribute) {
                    var k = attribute.k,
                        v = attribute.v;

                    if (k === 'fill-pattern') {
                        d3.select('.inner#' + id).attr('fill', settings.POLYGON_STYLES[v].url());
                    } else {
                        d3.select('.inner#' + id).attr(k, v);
                    }
                });
            }

            if (style.path) {
                _geojson[objectId].style.path = style.path;
                zoomed();
            }

            var symbol = d3.select('.legend#' + id).select('.symbol');

            if (_geojson[objectId].contour) {
                symbol
                    .attr('stroke', 'black')
                    .attr('stroke-width', '2');
            } else {
                symbol
                    .attr('stroke', null)
                    .attr('stroke-width', null);
            }
            angular.forEach(style.style, function(attribute) {
                var k = attribute.k,
                    v = attribute.v;

                if (k === 'fill-pattern') {
                    if (_geojson[objectId].color && _geojson[objectId].color.color !== 'none') {
                        v += '_' + _geojson[objectId].color.color;
                    }
                    symbol.attr('fill', settings.POLYGON_STYLES[v].url());
                } else {
                    symbol.attr(k, v);
                }
            });

            if (style.styleInner) {
                var symbolInner = d3.select('.legend#' + id).select('.inner');
                angular.forEach(style.styleInner, function(attribute) {
                    var k = attribute.k,
                        v = attribute.v;

                    if (k === 'fill-pattern') {
                        symbol.attr('fill', settings.POLYGON_STYLES[v].url());
                    } else {
                        symbolInner.attr(k, v);
                    }
                });
            }

            if (style.path) {
                symbol.attr('d', function() {
                    return style.path(symbol.attr('cx'), symbol.attr('cy'), style.radius);
                });
            }
        }
 
        /**
         * @ngdoc method
         * @name  removeFeature
         * @methodOf accessimapEditeurDerApp.LayerGeoJSONService
         * 
         * @description  
         * remove a 'feature' = item of '_geojson' collection.
         *
         * Remove it from the array and from the map / legend
         * 
         * @param  {Object} id 
         * id of the feature
         */
        function removeFeature(id) {
            // Remove object from _geojson
            var result = _geojson.filter(function(obj) {
                    return obj.id === id;
                }),
                index = _geojson.indexOf(result[0]);
            _geojson.splice(index, 1);

            // Remove object from map
            d3.select('.vector#' + id).remove();

            if (d3.select('.vector.inner#' + id)) {
                d3.select('.vector.inner#' + id).remove();
            }

            // Remove object from legend
            d3.select('.legend#' + id).remove();
        }

        /**
         * @ngdoc method
         * @name  rotateFeature
         * @methodOf accessimapEditeurDerApp.LayerGeoJSONService
         * 
         * @description 
         * rotate a feature element (feature.id) of a feature.rotation
         * 
         * @param  {Object} feature       
         * Object with id & rotation properties
         */
        function rotateFeature(feature) {
            var features = d3.selectAll('.' + feature.id);
            angular.forEach(features[0], function(featurei) {
                var cx = d3.select(featurei).attr('cx'),
                    cy = d3.select(featurei).attr('cy');
                d3.select(featurei).attr('transform', 'rotate(' + feature.rotation + ' ' + cx + ' ' + cy + ')');
            });
        };

    }

    angular.module(moduleApp).service('LayerGeoJSONService', LayerGeoJSONService);

    LayerGeoJSONService.$inject = ['settings', 'LegendService'];

})();
/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.LayerOverlayService
 * 
 * @description
 * Service providing the management of overlay layer
 */
(function() {
    'use strict';

    function LayerOverlayService() {

        this.createLayer = createLayer;
        this.refresh     = refresh;
        this.draw        = draw;
        this.getCenter   = getCenter;

        this.getTranslationX = function() { return _lastTranslationX }
        this.getTranslationY = function() { return _lastTranslationY }

        var marginGroup,
            frameGroup,
            _width,
            _height,
            _margin,
            _target, 
            _projection,
            _lastTranslationX,
            _lastTranslationY;


        function createLayer(target, width, height, margin, projection) {
            _width      = width;
            _height     = height;
            _margin     = margin;
            _target     = target;
            _projection = projection;
            
            marginGroup = _target.append('g').attr('id', 'margin-layer')
            frameGroup  = _target.append('g').attr('id', 'frame-layer');

            draw(_width, _height)

        }

        /**
         * @ngdoc method
         * @name  accessimapEditeurDerApp.LayerOverlayService.createMarginPath
         * @methodOf accessimapEditeurDerApp.LayerOverlayService
         *
         * @param  {Object} target  
         * d3 area
         * 
         * @param  {integer} width  
         * Width of the d3 area
         * 
         * @param  {integer} height  
         * Height of the d3 area
         * 
         * @param  {integer} margin  
         * Margin wished
         */
        function createMarginPath() {
            var w40 = _width - _margin,
                h40 = _height - _margin;

            marginGroup.selectAll("*").remove();

            marginGroup.append('path')
                .attr('d', function() {
                    var outer = 'M 0 0 L 0 ' 
                                    + _height 
                                    + ' L ' 
                                    + _width 
                                    + ' ' 
                                    + _height 
                                    + ' L ' 
                                    + _width 
                                    + ' 0 L 0 0 z ',
                        inner = 'M ' + _margin + ' ' + _margin + ' L ' 
                                    + w40 
                                    + ' ' + _margin + ' L ' 
                                    + w40 
                                    + ' ' 
                                    + h40 
                                    + ' L ' + _margin + ' ' 
                                    + h40 
                                    + ' L ' + _margin + ' ' + _margin + ' z';

                    return outer + inner;
                })
                .attr('style', 'fill:#ffffff;')
                .attr('id', 'svgWhiteBorder')
                .classed('notDeletable', true);

            marginGroup.append('path')
                .attr('d', function() {
                    var outer = 'M -10000 -10000 L -10000 ' 
                                    + ( _height + 10000 )
                                    + ' L ' 
                                    + ( _width + 10000 )
                                    + ' ' 
                                    + ( _height + 10000 )
                                    + ' L ' 
                                    + ( _width + 10000 )
                                    + ' -10000 L -10000 -10000 z ',
                        inner = 'M 0 0 L ' 
                                    + _width 
                                    + ' 0 L ' 
                                    + _width
                                    + ' ' 
                                    + _height
                                    + ' L ' + 0 + ' ' 
                                    + _height + ' z';

                    return outer + inner;
                })
                .attr('style', 'fill:#bbb;fill-opacity:.5;')
                .classed('notDeletable', true);

        };

        function getCenter() {
            return _projection.layerPointToLatLng([( _width / 2 ) + _lastTranslationX, ( _height / 2 ) + _lastTranslationY]);
        }

        /**
         * @ngdoc method
         * @name  accessimapEditeurDerApp.LayerOverlayService.createFramePath
         * @methodOf accessimapEditeurDerApp.LayerOverlayService
         *
         * @param  {Object} target  
         * [description]
         * 
         * @param  {integer} width  
         * [description]
         * 
         * @param  {integer} height  
         * [description]
         */
        function createFramePath() {
            var w40 = _width - _margin,
                h40 = _height - _margin;

            frameGroup.selectAll("*").remove();

            frameGroup.append('path')
                .attr('d', function() {
                    return 'M ' + _margin + ' ' + _margin + ' L ' 
                                    + w40 
                                    + ' ' + _margin + ' L ' 
                                    + w40 
                                    + ' ' 
                                    + h40 
                                    + ' L ' + _margin + ' ' 
                                    + h40 
                                    + ' L ' + _margin + ' ' + _margin + ' z';
                })
                .attr('fill', 'none')
                .attr('opacity', '.75')
                .attr('stroke', '#000000')
                .attr('stroke-width', '2px')
                .attr('stroke-opacity', '1')
                .attr('id', 'svgContainer')
                .classed('notDeletable', true);
        };

        function draw(width, height) {

            _width = width;
            _height = height;

            createMarginPath();
            createFramePath();

        }

        /**
         * re draw the overlay with translate & scale
         *
         * do not use simultaneously with refresh...
         * 
         * @param  {[type]} event      [description]
         * @param  {[type]} projection [description]
         * @return {[type]}            [description]
         */
        function onZoom(event, projection, transform) {

            marginGroup.attr("transform", transform)
            frameGroup.attr("transform", transform)

        }

        /**
         * Function moving the overlay svg, thanks to map movements...
         *
         * This function has to be used only if we want the overlay be 'fixed'
         * 
         * TODO: clear the dependencies to map... maybe, give the responsability to the map
         * and so, thanks to a 'class', we could 'freeze' the overlay thanks to this calc
         */
        function refresh(size, pixelOrigin, pixelBoundMin) {

            // x,y are coordinates to position overlay
            // coordinates 0,0 are not the top left, but the point at the middle left
            _lastTranslationX = 
                // to get x, we calc the space between left and the overlay
                ( ( size.x - _width) / 2 ) 
                // and we substract the difference between the original point of the map 
                // and the actual bounding topleft point
                - (pixelOrigin.x - pixelBoundMin.x),

            _lastTranslationY = 
                // to get y, we calc the space between the middle axe and the top of the overlay
                _height / -2 
                // and we substract the difference between the original point of the map
                // and the actual bounding topleft point
                - (pixelOrigin.y - pixelBoundMin.y - size.y / 2);

            console.log(_height)
            console.log(pixelOrigin.y)
            console.log(pixelBoundMin.y)
            console.log(size.y)
            console.log((pixelOrigin.y - pixelBoundMin.y - size.y / 2))
            marginGroup.attr("transform", "translate(" + (_lastTranslationX ) +"," + (_lastTranslationY) + ")")
            frameGroup.attr("transform", "translate(" + (_lastTranslationX ) +"," + (_lastTranslationY) + ")")
        }

    }

    angular.module(moduleApp).service('LayerOverlayService', LayerOverlayService);

    LayerOverlayService.$inject = [];

})();
/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.LayersService
 * @description
 * Service providing layer functions to add
 * - defs
 * - 
 * Provide functions to 
 * - init a map/draw area
 * - draw features
 * - export data
 */
(function() {
    'use strict';

    function LayersService(LayerBackgroundService, LayerOverlayService, LayerGeoJSONService, LayerDrawingService) {

        // layers functions
        this.createLayers        = createLayers;

        this.geojson = LayerGeoJSONService;
        this.geojson.getLayer = getGeoJSONLayer;
        this.geojson.getZoom = getGeoJSONZoom;

        this.overlay = LayerOverlayService;
        this.overlay.getLayer = getOverlayLayer;
        this.overlay.getZoom = getOverlayZoom;

        this.drawing = {
            getLayer : getDrawingLayer,
            getZoom  : getDrawingZoom,
        }

        this.background = LayerBackgroundService;
        this.background.getLayer = getBackgroundLayer;


        var _elements = { geojson: {}, drawing: {}, overlay: {}, background: {}};
        this._elements = _elements;

        /**
         * @ngdoc method
         * @name  createLayers
         * @methodOf accessimapEditeurDerApp.LayersService
         *
         * @description
         * Add all the required layers to the svg
         *
         * @param {Object} svg
         * SVG node on which will be added layers
         * 
         * @param {Object} g
         * G node on which will be added layers of polygon, points, etc.
         * 
         * @param {integer} width
         * Width in pixel of the drawing zone
         * 
         * @param {integer} height
         * Height in pixel of the drawing zone
         * 
         * @param {integer} margin
         * Margin in pixel of the drawing zone, useful for printing purpose
         */
        function createLayers(elements, width, height, margin) {

            _elements = elements;

            LayerBackgroundService.createLayer(elements.background.sel, width, height, margin, elements.background.proj);
            LayerGeoJSONService.createLayer(elements.geojson.sel, width, height, margin, elements.geojson.proj);
            LayerDrawingService.createLayer(elements.drawing.sel, width, height, margin);
            LayerOverlayService.createLayer(elements.overlay.sel, width, height, margin, elements.overlay.proj);

        }

        function getOverlayLayer() {
            return _elements.overlay.sel;
        }

        function getDrawingLayer() {
            return _elements.drawing.sel;
        }

        function getGeoJSONLayer() {
            return _elements.geojson.sel;
        }

        function getBackgroundLayer() {
            return _elements.background.sel;
        }

        function getOverlayZoom() {
            return _elements.overlay.proj.scale;
        }

        function getDrawingZoom() {
            return _elements.drawing.proj.scale;
        }

        function getGeoJSONZoom() {
            return _elements.geojson.proj.scale;
        }



    }

    angular.module(moduleApp).service('LayersService', LayersService);

    LayersService.$inject = ['LayerBackgroundService', 'LayerOverlayService', 'LayerGeoJSONService', 'LayerDrawingService'];

})();

/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.RadialMenuService
 * 
 * @description
 * Service providing functions to draw a radial menu on a specific feature
 */
(function() {
    'use strict';

    function RadialMenuService(settings, FeatureService, MapService) {

        this.drawMenu       = drawMenu;
        this.addRadialMenu  = addRadialMenu;
        this.hideRadialMenu = hideRadialMenu;

        this.init = init;

        var menu = null,
            svg, getCurrentZoom;

        function init(_svg, _getCurrentZoom) {
            svg = _svg;
            getCurrentZoom = _getCurrentZoom;
        }

        /**
         * @ngdoc method
         * @name  drawMenu
         * @methodOf accessimapEditeurDerApp.RadialMenuService
         *
         * @description 
         * Draw the menu for the specific target, at a specific point
         * 
         * @param  {[type]} target
         * Target on which will be attached the menu
         * 
         * @param  {Array} mousePosition
         * Point [x,y] where the menu will be displayed
         * 
         * @return {Object}
         * The menu drawned
         */
        function drawMenu(target, mousePosition) {
            
            target.classed('blink', true);
            var type = target.attr('data-type') ? target.attr('data-type') : 'default' ; //FeatureService.getType(target);

            if (type) {
                var data = settings.ACTIONS[type],

                    m = new d3.radialMenu()
                    .radius(50)
                    .thickness(60)
                    .animationDuration(100)
                    .iconSize(40)
                    .translation(mousePosition[0] + ' ' + mousePosition[1])
                    .scale(1/getCurrentZoom() + "," + 1/getCurrentZoom())
                    .onClick(function(d) {

                        d3.event.preventDefault();
                        d3.event.stopPropagation();
                
                        var action = d.data.action;
                        action(target);
                        menu.hide();
                        menu = null;
                    })
                    .appendTo(svg.node())
                    .show(data);

                MapService.addClickListener(function(e) {
                    e.originalEvent.preventDefault();
                    e.originalEvent.stopPropagation();
                    hideRadialMenu();
                })

                var clickOutsideMenu = svg.on('click', function(e) {
                    hideRadialMenu();
                });

                return m;
            }
        }

        /**
         * @ngdoc method
         * @name  addRadialMenu
         * @methodOf accessimapEditeurDerApp.RadialMenuService
         *
         * @description 
         * Attach a radial menu to a specific element
         * 
         * @param {Object} elements 
         * DOM Element(s) on which the event 'contextmenu' will be attached
         * 
         */
        function addRadialMenu(elements) {
            var that = this;
            elements.on('contextmenu', function(event) {

                // TODO: Block others click...
                d3.event.preventDefault();
                d3.event.stopPropagation();

                if (menu) menu.hide();

                menu = that.drawMenu(
                            d3.select(this), 
                            d3.mouse(svg.node()),
                            1);
            });

            // useful if we want to add a visual helper to the user
            // for seeing which feature he's going to edit
            // elements.on('mouseover', function(event) {
            //     console.log('mouseover')
            // })

            // useful if we want to display properties of this element
            // elements.on('click', function(event) {
            //     console.log('click')
            // })
        }

        /**
         * @ngdoc method
         * @name  hideRadialMenu
         * @methodOf accessimapEditeurDerApp.RadialMenuService
         * 
         * @description
         * Remove the menu if exists (TODO: destroyed the DOM element ?)
         */
        function hideRadialMenu() {
            if (menu) {
                menu.hide();
                menu = null
            }
        }

    }

    angular.module(moduleApp).service('RadialMenuService', RadialMenuService);

    RadialMenuService.$inject = ['settings', 'FeatureService', 'MapService'];

})();
/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.ToolboxService
 * @description
 * Expose different methods to draw on the d3 svg area
 */
(function() {
    'use strict';

    function ToolboxService(generators, RadialMenuService, settings, UtilService) {

        this.init                          = init;
        
        this.addRadialMenus                = addRadialMenus;
        this.hideRadialMenu                = RadialMenuService.hideRadialMenu;
        
        this.drawPoint                     = drawPoint;
        
        this.writeText                     = writeText;
        
        this.beginLineOrPolygon            = beginLineOrPolygon;
        this.drawHelpLineOrPolygon         = drawHelpLineOrPolygon;
        this.finishLineOrPolygon           = finishLineOrPolygon;
        
        this.drawCircle                    = drawCircle;
        this.updateCircleRadius            = updateCircleRadius;
        
        this.changeTextColor               = changeTextColor;
        this.updateBackgroundStyleAndColor = updateBackgroundStyleAndColor;
        this.updateFeatureStyleAndColor    = updateFeatureStyleAndColor;
        this.updateMarker                  = updateMarker;

        this.featureIcon                   = featureIcon;

        this.drawing = {
            drawPoint                     : drawPoint,
            writeText                     : writeText,
            beginLineOrPolygon            : beginLineOrPolygon,
            drawHelpLineOrPolygon         : drawHelpLineOrPolygon,
            finishLineOrPolygon           : finishLineOrPolygon,
            
            drawCircle                    : drawCircle,
            updateCircleRadius            : updateCircleRadius,
            
            changeTextColor               : changeTextColor,
            updateBackgroundStyleAndColor : updateBackgroundStyleAndColor,
            updateFeatureStyleAndColor    : updateFeatureStyleAndColor,
            updateMarker                  : updateMarker,
        }
        
        var pointsLayer,
            polygonsLayer,
            linesLayer,
            textLayer;

        function init(svgDrawing, svgMenu, getCurrentZoom) {
            RadialMenuService.init(svgMenu, getCurrentZoom);

            pointsLayer   = d3.select(svgDrawing).node().select('g[data-name="points-layer"]');
            polygonsLayer = d3.select(svgDrawing).node().select('g[data-name="polygons-layer"]');
            linesLayer    = d3.select(svgDrawing).node().select('g[data-name="lines-layer"]');
            textLayer     = d3.select(svgDrawing).node().select('g[data-name="text-layer"]');
        }

        /**
         * @ngdoc method
         * @name  addRadialMenus
         * @methodOf accessimapEditeurDerApp.ToolboxService
         * @description
         *
         * Add radial menus to d3 for differents elements :
         * - path
         * - circle
         * - text
         *
         * Then users can edit these shapes by right-clicking on it
         *
         * @param {Object} model [description]
         */
        function addRadialMenus() {
            RadialMenuService.addRadialMenu(d3.selectAll('path:not(.notDeletable)'));
            RadialMenuService.addRadialMenu(d3.selectAll('circle:not(.notDeletable)'));
            RadialMenuService.addRadialMenu(d3.selectAll('text:not(.notDeletable)'));
            RadialMenuService.addRadialMenu(d3.selectAll('image:not(.notDeletable)'));
        }
        
        /**
         * @ngdoc method
         * @name  drawPoint
         * @methodOf accessimapEditeurDerApp.ToolboxService
         *
         * @description
         * Draw a point (circle, arrow,...) at specific coordinates
         * 
         * @param  {integer} x     
         * X coordinate of the point
         * 
         * @param  {integer} y     
         * Y coordinate of the point
         * 
         * @param  {Object} style 
         * settings.STYLE of the point
         * 
         * @param  {Object} color 
         * settings.COLOR of the point
         * 
         */
        function drawPoint(x, y, style, color) {

            var iid = UtilService.getiid(),

                feature = pointsLayer
                    .append('path')
                    .classed('link_' + iid, true)
                    .attr('d', style.path(x,y,style.radius))
                    .attr('data-link', iid)
                    .attr('data-type', 'point');
            
            applyStyle(feature, style.style, color);

            RadialMenuService.addRadialMenu(feature);
        }

        /**
         * @ngdoc method
         * @name  drawCircle
         * @methodOf accessimapEditeurDerApp.ToolboxService
         *
         * @description
         * Draw a circle at specific coordinates 
         * 
         * @param  {integer} x     
         * X coordinate of the point
         * 
         * @param  {integer} y     
         * Y coordinate of the point
         * 
         * @param  {Object} style 
         * settings.STYLE of the point
         * 
         * @param  {Object} color 
         * settings.COLOR of the point
         * 
         * @param  {boolean} contour
         * If true add a shape to the circle
         * 
         */
        function drawCircle(x, y, style, color, contour) {
            var feature;

            if (d3.select('.edition')[0][0]) { // second click
                feature = d3.select('.edition');
                var xOffset = x - feature.attr('cx'),
                    yOffset = y - feature.attr('cy'),
                    r = Math.sqrt(Math.pow(xOffset, 2) 
                                + Math.pow(yOffset, 2));
                feature.attr('r', r)
                    .attr('e-style', style.id)
                    .attr('e-color', color.color);
                feature.classed('edition', false);
            } else { // first click
                var iid = UtilService.getiid();
                feature = polygonsLayer 
                    .append('circle')
                    .attr('cx', x)
                    .attr('cy', y)
                    .classed('link_' + iid, true)
                    .attr('data-link', iid)
                    .attr('data-type', 'circle')
                    .classed('edition', true);

                applyStyle(feature, style.style, color);

                if (contour && !feature.attr('stroke')) {
                    feature
                        .attr('stroke', 'black')
                        .attr('stroke-width', '2');
                }
            }
            RadialMenuService.addRadialMenu(feature);
        }

        /**
         * @ngdoc method
         * @name  updateCircleRadius
         * @methodOf accessimapEditeurDerApp.ToolboxService
         *
         * @description
         * Update the radius of a feature circle
         * 
         * @param  {integer} x     
         * X coordinate of the point
         * 
         * @param  {integer} y     
         * Y coordinate of the point
         * 
         */
        function updateCircleRadius(x, y) {
            var feature = d3.select('.edition');

            if (feature[0][0]) {
                var xOffset = x - feature.attr('cx'),
                    yOffset = y - feature.attr('cy'),
                    r = Math.sqrt(Math.pow(xOffset, 2) 
                                + Math.pow(yOffset, 2));
                feature.attr('r', r);
            }
        }

        function beginLineOrPolygon(x, y, style, color, contour, mode, lastPoint, lineEdit) {
            var drawingLayer = ( mode === 'line' ? linesLayer /* d3.select('#lines-layer') */ : polygonsLayer /* d3.select('#polygons-layer') */),
                path,
                pathInner;

            // follow the line / polygon
            if (d3.select('.edition')[0][0]) {
                path = d3.select('.edition');

                if (mode === 'line') {
                    pathInner = d3.select('.edition.inner');
                }
            } else {
                // first click
                // lineEdit = [];
                path = drawingLayer
                        .append('path')
                        .attr({'class': 'edition'});
                applyStyle(path, style.style, color);

                if (contour && !path.attr('stroke')) {
                    path.attr('stroke', 'black')
                        .attr('stroke-width', '2');
                }

                if (mode === 'line') {
                    pathInner = drawingLayer
                                .append('path')
                                .attr({'class': 'edition inner'});
                    applyStyle(pathInner, style.styleInner, color);
                }
            }

            if (lastPoint) {
                var tanAngle = Math.abs((y - lastPoint.y) / (x - lastPoint.x)),
                    tan5     = Math.tan((5 * 2 * Math.PI) / 360),
                    tan85    = Math.tan((85 * 2 * Math.PI) / 360);

                // If the ctrlKey is pressed
                // draw horizontal or vertical lines 
                // with a tolerance of 5°
                if (d3.event && d3.event.ctrlKey 
                    && (tanAngle < tan5 || tanAngle > tan85)) {
                    if (tanAngle < tan5) {
                        y = lastPoint.y;
                    } else {
                        x = lastPoint.x;
                    }
                }
            }

            lineEdit.push([x, y]);
            path.attr({
                d: generators.pathFunction[mode](lineEdit)
            });

            if (mode === 'line') {
                pathInner.attr({
                    d: generators.pathFunction[mode](lineEdit)
                });
            }
            applyStyle(path, style.style, color);

            if (contour && !path.attr('stroke')) {
                path.attr('stroke', 'black')
                    .attr('stroke-width', '2');
            }

            if (mode === 'line') {
                applyStyle(pathInner, style.styleInner, color);
            }
        }

        function drawHelpLineOrPolygon(x, y, style, color, contour, mode, lastPoint) {
            if (lastPoint) {
                var drawingLayer = ( mode === 'line' ? linesLayer /* d3.select('#lines-layer') */ : polygonsLayer /* d3.select('#polygons-layer') */),
                    line;

                if (d3.select('.ongoing')[0][0]) {
                    line = d3.select('.ongoing');
                } else {
                    line = drawingLayer
                        .append('line')
                        .attr({'class': 'ongoing'});
                    applyStyle(line, style.style, color);

                    if (contour && !line.attr('stroke')) {
                        line.attr('stroke', 'black')
                            .attr('stroke-width', '2');
                    }
                }
                var tanAngle = Math.abs((y - lastPoint.y) / (x - lastPoint.x)),
                    tan5     = Math.tan((5 * 2 * Math.PI) / 360),
                    tan85    = Math.tan((85 * 2 * Math.PI) / 360);

                // If the ctrlKey is pressed
                // draw horizontal or vertical lines 
                // with a tolerance of 5°
                if (d3.event && d3.event.ctrlKey 
                    && (tanAngle < tan5 || tanAngle > tan85)) {
                    if (tanAngle < tan5) {
                        y = lastPoint.y;
                    } else {
                        x = lastPoint.x;
                    }
                }

                line.attr('x1', lastPoint.x)
                    .attr('y1', lastPoint.y)
                    .attr('x2', x)
                    .attr('y2', y);
            }
        }

        function finishLineOrPolygon(x, y, style, color, mode) {
            var iid = UtilService.getiid();
            
            RadialMenuService.addRadialMenu(d3.select('.edition'));

            if (mode === 'line') {
                d3.select('.edition.inner')
                    .classed('edition', false)
                    .classed('link_' + iid, true)
                    .attr('data-link', iid);
            }

            d3.select('.edition').attr('e-style', style.id)
                .attr('e-color', color.color);

            d3.select('.edition')
                .classed('edition', false)
                .classed('link_' + iid, true)
                .attr('data-type', mode)
                .attr('data-link', iid);

            d3.select('.ongoing').remove();
            
        }

        // TODO: Fréd, ça sert à quoi ?
        function selectElementContents(el) {
            var range = document.createRange();
            range.selectNodeContents(el);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }

        function writeText(x, y, font, color) {
            // the previously edited text should not be edited anymore
            d3.select('.edition').classed('edition', false);

            var d = 'Texte',
                iid = UtilService.getiid();

            textLayer // d3.select('#text-layer')
                .append('text')
                .attr('x', x)
                .attr('y', y - 35)
                .attr('font-family', font.family)
                .attr('font-size', font.size)
                .attr('font-weight', function() {
                    return font.weight;
                })
                .attr('fill', color.color)
                .attr('id', 'finalText')
                .classed('edition', true)
                .classed('link_' + iid, true)
                .attr('data-type', 'text')
                .attr('data-link', iid)
                .text('');

            textLayer // d3.select('#text-layer')
                .selectAll('foreignObject#textEdition')
                .data([d])
                .enter()
                .append('foreignObject')
                .attr('id', 'textEdition')
                .attr('x', x)
                .attr('y', y - 35)
                .attr('height', 500)
                .attr('width', 500)
                .attr('font-family', font.family)
                .attr('font-size', font.size)
                .attr('font-weight', function() {
                    return font.weight;
                })
                .attr('fill', color.color)
                .classed('edition', true)
                .append('xhtml:p')
                .attr('contentEditable', 'true')
                .text(d)
                .on('mousedown', function() {
                    d3.event.stopPropagation();
                })
                .on('keydown', function() {
                    d3.event.stopPropagation();

                    if (d3.event.keyCode === 13 && !d3.event.shiftKey) {
                        this.blur();
                    }
                })
                .on('blur', function() {
                    angular.forEach(this.childNodes, function(node) {
                        var data = node.data;

                        if (data) {
                            data = data.replace(/(\d+)/g, '¤$1');
                            d3.select('#finalText')
                                .attr('text-anchor', 'start')
                                .append('tspan')
                                .attr('text-anchor', 'start')
                                .attr('x', function() {
                                    return d3.select(this.parentNode)
                                            .attr('x');
                                })
                                .attr('dy', 35)
                                .text(data);
                        }
                    });
                    d3.select(this.parentElement).remove();

                    RadialMenuService.addRadialMenu(d3.select('.edition'));

                    d3.select('.edition').classed('edition', false);
                    d3.select('#finalText').attr('id', null);
                });

            selectElementContents(
                d3.selectAll('foreignObject#textEdition')
                    .selectAll('p')
                    .node());

        }

        function changeTextColor(model) {
            model.fontColorChosen = model.fontColors[model.fontChosen.color][0];
        };

        function updateBackgroundStyleAndColor(style, color) {
            updateStyleAndColor(d3.select('#svgContainer'), style, color)
        }

        function updateFeatureStyleAndColor(style, color) {
            updateStyleAndColor(d3.select('.styleEdition'), style, color)
        }

        function updateStyleAndColor(path, style, color) {
            var currentStyleId = path.attr('e-style'),
                currentColorName = path.attr('e-color');

            if (style) {
                path.attr('e-style', style.id);
            } else {
                // no style, we just find the current style of the feature
                settings.STYLES.polygon.forEach(function (item, index, array) {
                    if (item.id === currentStyleId) {
                        style = item;
                    }
                })
            }

            if (color) {
                path.attr('e-color', color.color);
            } else {
                // no color, we just find the current color of the feature
                var arrayColors = settings.COLORS.black.concat(settings.COLORS.transparent.concat(settings.COLORS.other));

                arrayColors.forEach(function (item, index, array) {
                    if (item.color === currentColorName) {
                        color = item;
                    }
                })
                
            }

            applyStyle(path, style.style, color);
        };

        function updateMarker(markerStart, markerStop) {
            var path = d3.select('.styleEdition');

            if (markerStart) {
                path.attr('marker-start', 'url(#' + markerStart.id + ')');
            }

            if (markerStop) {
                path.attr('marker-end', 'url(#' + markerStop.id + ')');
            }
        };

        function applyStyle(path, style, colorChosen) {
            angular.forEach(style, function(attribute) {
                var k = attribute.k,
                    v = attribute.v;

                if (k === 'fill-pattern') {
                    if (colorChosen && colorChosen.color !== 'none') {
                        v += '_' + colorChosen.color;
                    }
                    path.style('fill', settings.POLYGON_STYLES[v].url());
                } else {
                    path.style(k, v);
                }
            });
        };

        /**
         * @ngdoc method
         * @name  featureIcon
         * @methodOf accessimapEditeurDerApp.ToolboxService
         *
         * @param  {Object} item [description]
         * @param  {Object} type [description]
         * @return {string}      [description]
         */
        function featureIcon(item, type) {
            var iconSvg = document.createElement('svg'),
                iconContainer = d3.select(iconSvg)
                                .attr('height', 40).append('g'),
                symbol;

            switch(type) {
                case 'line':
                    symbol = iconContainer.append('line')
                        .attr('x1', 0)
                        .attr('y1', 15)
                        .attr('x2', 250)
                        .attr('y2', 15)
                        .attr('fill', 'red');

                    var symbolInner = iconContainer.append('line')
                        .attr('x1', 0)
                        .attr('y1', 15)
                        .attr('x2', 250)
                        .attr('y2', 15)
                        .attr('fill', 'red');
                        
                    angular.forEach(item.styleInner, function(attribute) {
                        var k = attribute.k,
                            v = attribute.v;

                        if (typeof(v) === 'function') {
                            v = v.url();
                        }
                        symbolInner.attr(k, v);
                    });
                    break;

                case 'point':
                    symbol = iconContainer.append('path')
                            .attr('d', function() {
                                return item.path(20, 20, item.radius);
                            });
                    break;

                case 'polygon':
                case 'editpolygon':
                case 'circle':
                    symbol = iconContainer.append('rect')
                                .attr('x', 0)
                                .attr('y', 0)
                                .attr('width', 250)
                                .attr('height', 30)
                                .attr('fill', 'red');
                    break;
            }

            angular.forEach(item.style, function(attribute) {
                var k = attribute.k,
                    v = attribute.v;

                if (k === 'fill-pattern') {
                    symbol.attr('fill', settings.POLYGON_STYLES[v].url());
                } else {
                    symbol.attr(k, v);
                }
            });

            return (new XMLSerializer()).serializeToString(iconSvg);
        };

    }
    
    angular.module(moduleApp).service('ToolboxService', ToolboxService);

    ToolboxService.$inject = ['generators', 'RadialMenuService', 'settings', 'UtilService'];

})();
/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.DrawingService
 * @requires accessimapEditeurDerApp.LayersService
 * @requires accessimapEditeurDerApp.ToolboxService
 * @requires accessimapEditeurDerApp.settings
 * @requires accessimapEditeurDerApp.FeatureService
 * @requires accessimapEditeurDerApp.ToolboxService
 * @description
 * Service providing drawing functions
 * Provide functions to 
 * - init a map/draw area
 * - draw features
 */
(function() {
    'use strict';

    function DrawingService(LayersService, ToolboxService, settings, FeatureService) {

        this.initDrawing     = initDrawing;
        
        this.isUndoAvailable = FeatureService.isUndoAvailable;
        this.undo            = FeatureService.undo;

       /* this.exportData      = function(filename) {
            // shareSvg.getInteractions()
                // .then(function(interactionData) {
                    ExportService.exportData(filename, 
                            d3.select('svg.leaflet-zoom-animated').node(), 
                            d3.select('.leaflet-tile-container.leaflet-zoom-animated').node(),
                            d3.select('#der-legend').selectAll('svg').node(),
                            $('#comment').val(),
                            InteractionService.getInteractions());
                // })
        }
        */
        this.toolbox = ToolboxService;
        
        this.layers  = LayersService;

        /**
         * @ngdoc method
         * @name  accessimapEditeurDerApp.DrawingService.initDrawing
         * @methodOf accessimapEditeurDerApp.DrawingService
         *
         * @description
         * Create the drawing svg in a dom element with specific size
         *
         * @param  {Object} elements
         * Object containing each layer (overlay, drawing, geojson) with a sel & proj property
         * 
         * These properties are given by D3SvgOverlay and help us to display at the right place features & drawings
         * 
         * @param  {integer} width
         * width in pixels of the svg created
         * 
         * @param  {integer} height
         * height in pixels of the svg created
         * 
         * @param  {integer} margin 
         * margin of border in millimeters of the svg created
         * 
         */
        function initDrawing(elements, width, height, margin) {
            
            LayersService.createLayers(elements, width, height, margin)

            ToolboxService.init(LayersService.drawing.getLayer(), 
                                LayersService.overlay.getLayer(), 
                                LayersService.overlay.getZoom );

            FeatureService.init(LayersService.drawing.getLayer())

        }

    }

    angular.module(moduleApp).service('DrawingService', DrawingService);

    DrawingService.$inject = ['LayersService', 'ToolboxService', 'settings', 'FeatureService'];

})();
/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.EventService
 * 
 * @description
 * Service providing events manager
 *
 * TODO: see if this service is useful ?
 */
(function() {
    'use strict';

    function EventService() {

        this.addClickListener       = addClickListener;
        this.addMoveListener        = addMoveListener;
        this.addDoubleClickListener = addDoubleClickListener;
        this.removeEventListener    = removeEventListener;

        var listeners = [];

        /**
         * @ngdoc method
         * @name  addClickListener
         * @methodOf accessimapEditeurDerApp.EventService
         * 
         * @description 
         * Add a listener to the click event
         * 
         * @param {function} listener 
         * function executed when click event is fired
         */
        function addClickListener(listener) {
            listeners.push({event: 'click', function: listener})
            d3.select('#d3drawing')
                .on('click', listener)
        }

        /**
         * @ngdoc method
         * @name  addMoveListener
         * @methodOf accessimapEditeurDerApp.EventService
         * 
         * @description 
         * Add a listener to the mousemove event
         * 
         * @param {function} listener 
         * function executed when mousemove event is fired
         */
        function addMoveListener(listener) {
            listeners.push({event: 'mousemove', function: listener})
            d3.select('#d3drawing')
                .on('mousemove', listener)
        }

        /**
         * @ngdoc method
         * @name  addDoubleClickListener
         * @methodOf accessimapEditeurDerApp.EventService
         * 
         * @description 
         * Add a listener to the doubleclick event
         * 
         * @param {function} listener 
         * function executed when doubleclick event is fired
         */
        function addDoubleClickListener(listener) {
            listeners.push({event: 'contextmenu', function: listener})
            d3.select('#d3drawing')
                .on('dblclick', listener)
        }

        /**
         * @ngdoc method
         * @name  removeEventListener
         * @methodOf accessimapEditeurDerApp.EventService
         * 
         * @description 
         * Remove all the listener to the map
         */
        function removeEventListener() {
            for (var listener in listeners) {
                map.removeEventListener(listener.event, listener.function)
            }
        }

    }

    angular.module(moduleApp).service('EventService', EventService);

    EventService.$inject = [];

})();
(function() {
    'use strict';

    /*global JSZip, saveAs */
    /**
     * @ngdoc service
     * @name accessimapEditeurDerApp.ExportService
     * @memberOf accessimapEditeurDerApp
     * @module 
     * @description
     * Service in the accessimapEditeurDerApp.
     */
    function ExportService(shareSvg, InteractionService, LegendService, DrawingService, DefsService, MapService) {

        this.exportData = exportData;

        var exportVersion = '0.1';

        // TODO: add parameters to not have to use DOM selectors.
        // this function have to be independant from the DOM
        // To be added : drawingNode, legendNode, interactions
        function exportData(model) {

            if (! model.title)
                model.title = 'Dessin en relief fait avec Accessimap';

            var node = MapService.getMap().getPanes().mapPane,
                // center = DrawingService.layers.overlay.getCenter(),
                transformStyle = $(node).css('transform'),
                drawingNode = MapService.getMap().getContainer(), // d3.select('svg.leaflet-zoom-animated').node(),
                tilesNode = null,
                legendNode = LegendService.getNode(),
                comments = $('#comment').val(),
                interactionsContentXML = InteractionService.getXMLExport(),
                titleDrawing = document.createElementNS("http://www.w3.org/2000/svg", "title"),

            zip    = new JSZip(),
            exportNode = drawingNode ? drawingNode.cloneNode(true) : null,
            width = 1049 , // d3.select(drawingNode).attr('width'),
            height = 742 , // d3.select(drawingNode).attr('height'),
            format = 'landscapeA4' ,
            svgDrawing = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            d3.select(svgDrawing)
                .attr('data-format', format)
                .attr('data-version', exportVersion)
                .attr('width', width)
                .attr('height', height)
                .attr('viewBox', '0 0 ' + width + ' ' + height)

            // patterns
            DefsService.createDefs(d3.select(svgDrawing))

            // get transform attribute of margin / frame layers
            var translateScaleOverlayGroup = DrawingService.layers.overlay.getLayer().attr('transform'),
                translateOverlayGroup = ( translateScaleOverlayGroup === null ) 
                                            ? null 
                                            : translateScaleOverlayGroup.substring(translateScaleOverlayGroup.indexOf('(') + 1, translateScaleOverlayGroup.indexOf(')')),
                translateOverlayGroupArray = ( translateOverlayGroup === null ) 
                                                ? [0, 0] 
                                                : translateOverlayGroup.slice(0, translateOverlayGroup.length).split(','),
                
                translateOverlay = d3.select(exportNode).select('#margin-layer').attr('transform'),
                translateOverlayArray = translateOverlay.slice(translateOverlay.indexOf('(') + 1, translateOverlay.length - 1).split(','),

                translateGeoJSON = d3.select(exportNode).select('#geojson-layer').attr('transform'),
                translateGeoJSONArray = translateGeoJSON.slice(translateGeoJSON.indexOf('(') + 1, translateGeoJSON.length - 1).split(','),

                translateReverseOverlay = "translate(" + ( ( translateOverlayArray[0] ) * -1 ) + ',' + ( ( translateOverlayArray[1] ) * -1 ) + ')',
                translateReverseGeoJSON = "translate(" + ( ( translateOverlayArray[0] + translateGeoJSONArray[0]  ) * -1 ) + ',' + ( ( translateOverlayArray[1] + translateGeoJSONArray[1] ) * -1 ) + ')',
                translateReverseOverlayPx = "translate(" + ( ( parseInt(translateOverlayArray[0]) + parseInt(translateOverlayGroupArray[0]) ) * -1 ) + 'px,' + ( ( parseInt(translateOverlayArray[1]) + parseInt(translateOverlayGroupArray[1]) ) * -1 ) + 'px)';

            d3.select(exportNode).select("svg[data-name='overlay'] > g").attr('transform', ''); 
                      
            d3.select(exportNode).select('#margin-layer').attr('transform', '');           
            d3.select(exportNode).select('#frame-layer').attr('transform', '');            
            d3.select(exportNode).select('#geojson-layer').attr('transform', translateReverseOverlay);            
            d3.select(exportNode).select('#drawing-layer').attr('transform', translateReverseOverlay);            
            d3.select(exportNode).select('#background-layer').attr('transform', translateReverseOverlay);            
            
            // we apply a transformation to facilitate the export 
            // TODO: see if it's necessary with a special viewbox
            $(node).css('transform', translateReverseOverlayPx);

            function filterDOM(node) {
                return (node.tagName !== 'svg')
            }

            domtoimage.toPng(node, {width: width, height: height, filter: filterDOM})
                .then(function(dataUrl) { 
                    $(node).css('transform', transformStyle);

                    // save the image in a file & add it to the current zip
                    var imgBase64 = dataUrl.split('base64,')
                    zip.file('carte.png', imgBase64[1], {base64: true});

                    // add the current image to a svg:image element
                    var image = document.createElementNS("http://www.w3.org/2000/svg", "image");
                    d3.select(image)
                        .attr('width', width)
                        .attr('height', height)
                        .attr('x', 0)
                        .attr('y', 0)
                        .attr('xlink:href', dataUrl)

                    // create some metadata object 
                    var metadataGeoJSON = document.createElementNS("http://www.w3.org/2000/svg", "metadata"),
                        metadataInteractions = document.createElementNS("http://www.w3.org/2000/svg", "metadata"),
                        metadataModel = document.createElementNS("http://www.w3.org/2000/svg", "metadata");

                    metadataGeoJSON.setAttribute('data-name', 'data-geojson')
                    metadataGeoJSON.setAttribute('data-value', JSON.stringify(DrawingService.layers.geojson.getFeatures()))

                    metadataInteractions.setAttribute('data-name', 'data-interactions')
                    metadataInteractions.setAttribute('data-value', interactionsContentXML)

                    metadataModel.setAttribute('data-name', 'data-model')
                    metadataModel.setAttribute('data-value', JSON.stringify(model))

                    // Assembly of 'carte_avec_source.svg'
                    svgDrawing.appendChild(metadataGeoJSON);
                    svgDrawing.appendChild(metadataInteractions);
                    svgDrawing.appendChild(metadataModel);
                    
                    svgDrawing.appendChild(image);

                    svgDrawing.appendChild(d3.select(exportNode).select("svg[data-name='background']").node());
                    svgDrawing.appendChild(d3.select(exportNode).select("svg[data-name='geojson']").node());
                    svgDrawing.appendChild(d3.select(exportNode).select("svg[data-name='drawing']").node());
                    svgDrawing.appendChild(d3.select(exportNode).select("svg[data-name='overlay']").node());

                    zip.file('carte_avec_source.svg', (new XMLSerializer()).serializeToString(svgDrawing));

                    // Assembly of 'carte_sans_source.svg' => remove tiles
                    svgDrawing.removeChild(image);

                    zip.file('carte_sans_source.svg', (new XMLSerializer()).serializeToString(svgDrawing));

                    // Assembly of legend
                    if (legendNode) {

                        var svgLegend = document.createElementNS("http://www.w3.org/2000/svg", "svg"),
                            legendNodeClone = legendNode.cloneNode(true);

                        DefsService.createDefs(d3.select(svgLegend))

                        svgLegend.appendChild(legendNodeClone);

                        zip.file('legende.svg', (new XMLSerializer()).serializeToString(svgLegend));
                    }

                    // Adding the comments
                    zip.file('commentaires.txt', comments);

                    // Adding the interactions
                    zip.file('interactions.xml', interactionsContentXML);

                    // Build the zip & send the file to the user
                    zip.generateAsync({type: 'blob'})
                        .then(function(content) {
                            saveAs(content, model.title + '.zip');
                        })

                })

        }

    }

    angular.module(moduleApp).service('ExportService', ExportService);

    ExportService.$inject = ['shareSvg', 'InteractionService', 'LegendService', 'DrawingService', 'DefsService', 'MapService'];
})();

/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.GeneratorService
 * 
 * @description
 * Service providing function to draw lines, cardinal & polygon
 */
(function() {
    'use strict';

    function GeneratorService() {

        this.lineFunction = d3.svg.line()
                                        .x(function(d) { return d[0]; })
                                        .y(function(d) { return d[1]; })
                                        .interpolate('linear');

        this.cardinalLineFunction = d3.svg.line()
                                        .x(function(d) { return d[0]; })
                                        .y(function(d) { return d[1]; })
                                        .interpolate('cardinal');

        this.polygonFunction = d3.svg.line()
                                        .x(function(d) { return d[0]; })
                                        .y(function(d) { return d[1]; })
                                        .interpolate('linear-closed');
                                     
        this.pathFunction = {
            'line': this.lineFunction,
            'polygon': this.polygonFunction
        };

    }

    angular.module(moduleApp)
          .service('GeneratorService', GeneratorService);

})();
(function() {
    'use strict';

    /**
     * @ngdoc service
     * @name accessimapEditeurDerApp.ImportService
     * @memberOf accessimapEditeurDerApp
     * 
     * @description
     * Provide service to import a drawing :
     * - background layer
     * - geojson layer
     * - drawing layer
     * - interactions
     * - legend
     */
    function ImportService(LayersService, InteractionService, LegendService) {

        this.importDrawing     = importDrawing;
        this.importInteraction = importInteraction;
        this.getModelFromSVG   = getModelFromSVG;

        function isVersionOfSVGAcceptable(svgElement) {
            
            return svgElement.querySelector('svg').getAttribute('data-version') >= '0.1';

        }

        function getModelFromSVG(svgElement) {

            if (isVersionOfSVGAcceptable(svgElement)) {
                var metadataModel = svgElement.querySelector('metadata[data-name="data-model"]');
                if (metadataModel) {
                    return JSON.parse(metadataModel.getAttribute('data-value'));
                }
            }
            
            return null;
        }

        /**
         * @ngdoc method
         * @name  importDrawing
         * @methodOf accessimapEditeurDerApp.ImportService
         *
         * @description 
         * Import data from the svgElement by trying to find the layers
         * 
         * @param  {DOM Element} svgElement
         * the element to import for drawing purpose
         */
        function importDrawing(svgElement) {

            if (isVersionOfSVGAcceptable(svgElement)) {

                var geojsonLayer = svgElement.querySelector('g[data-name="geojson-layer"]'),
                    drawingLayer = svgElement.querySelector('g[data-name="drawing-layer"]'),
                    backgroundLayer = svgElement.querySelector('g[data-name="background-layer"]'),
                    metadataGeoJSON = svgElement.querySelector('metadata[data-name="data-geojson"]'),
                    metadataInteractions = svgElement.querySelector('metadata[data-name="data-interactions"]'),
                    format = svgElement.querySelector('svg').getAttribute('data-format'),
                    center = svgElement.querySelector('svg').getAttribute('data-center');

                // get the format, and adapt the overlay
                // LayersService.changeFormat(format);

                // if map displayed, display it and center on the right place
                
                function removeChildren(node) {
                    var children = node.children;

                    for (var i = 0; i < children.length; i++) {
                        node.removeChild(children[0]); // children list is live, removing a child change the list... 
                    }
                }

                function cloneChildrenFromNodeToAnotherNode(nodeFrom, nodeTo) {
                    var children = nodeFrom.children;

                    for (var i = 0; i < children.length; i++) {
                        nodeTo.appendChild(children[i]);
                    }
                }

                // if exists, inserts data of the geojson layers
                if (geojsonLayer) {
                    var currentGeoJSONLayer = LayersService.geojson.getLayer().node();
                    removeChildren(currentGeoJSONLayer);
                    cloneChildrenFromNodeToAnotherNode(geojsonLayer, currentGeoJSONLayer);
                }

                // if exists, inserts data of the drawing layers
                if (drawingLayer) {
                    var currentDrawingLayer = LayersService.drawing.getLayer().node();
                    removeChildren(currentDrawingLayer);
                    cloneChildrenFromNodeToAnotherNode(drawingLayer, currentDrawingLayer);
                }
                
                // if exists, inserts data of the drawing layers
                if (backgroundLayer) {
                    var currentBackgroundLayer = LayersService.background.getLayer().node();
                    removeChildren(currentBackgroundLayer);
                    cloneChildrenFromNodeToAnotherNode(backgroundLayer, currentBackgroundLayer);
                }

                if (metadataGeoJSON && metadataGeoJSON.getAttribute('data-value') !== '') {
                    var dataGeoJSON = JSON.parse(metadataGeoJSON.getAttribute('data-value'));
                    LayersService.geojson.setFeatures(dataGeoJSON);
                    generateLegend(dataGeoJSON);
                }

                if (metadataInteractions && metadataInteractions.getAttribute('data-value') !== '') {
                    var parser = new DOMParser();
                    importInteraction(parser.parseFromString(metadataInteractions.getAttribute('data-value'), "text/xml"))
                }

            } else {
                // it's not a draw from the der, but we will append each element in the 'drawing section'
                LayersService.drawing.getLayer().node().appendChild(svgElement.childNodes[0])
            }

        }

        function generateLegend(dataGeoJSON) {
            dataGeoJSON.forEach(function(element, index, array) {
                LegendService.addToLegend(element, element.style, index, element.color, {contour: element.contour})
            })
        }

        function importInteraction(interactionData) {

            // insertion of filters
            var filters = interactionData.querySelectorAll('filter');

            // we don't take the first filter, because it's the OSM Value by default in a DER
            for (var i = 1; i < filters.length; i++) {
                InteractionService.addFilter(filters[i].name, filters[i].gesture, filters[i].protocol )
            }

            // insertion of interactions
            var pois = interactionData.querySelectorAll('poi');

            for (var i = 0; i < pois.length; i++) {
                var actions = pois[i].querySelectorAll('action');

                for (var j = 0; j < actions.length; j++) {
                    InteractionService.setInteraction(pois[i].getAttribute('id'), 
                                                        actions[j].getAttribute('filter'), 
                                                        actions[j].getAttribute('value'));
                }
            }

        }

    }

    angular.module(moduleApp).service('ImportService', ImportService);

    ImportService.$inject = ['LayersService', 'InteractionService', 'LegendService'];
})();
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
(function() {
    'use strict';

    /**
     * @ngdoc service
     * @name accessimapEditeurDerApp.geometry
     * @description
     * # geometry
     * Service in the accessimapEditeurDerApp.
     */
    function geometry(generators) {

        this.lineToCardinal = function(feature, scope) {
            var arr = feature.attr('d').split('L'),
                featuresToUpdate = feature;

            if (feature.attr('data-link')) {
                featuresToUpdate = 
                    d3.selectAll('.link_' + feature.attr('data-link'));
            }
            var coords = undefined;

            if (arr.length > 1) { // line's type is linear
                coords = arr.map(function(c) {
                    c = c.replace(/M(\s?)+/, '');
                    c = c.replace('Z', '');
                    c = c.replace(/(\s?)+/, ''); //remove first space
                    c = c.replace(/\s+$/, ''); //remove last space
                    var coordsArray = c.split(',');

                    if (coordsArray.length < 2) {
                        coordsArray = c.split(' ');
                    }

                    return coordsArray.map(function(ca) {
                        return parseFloat(ca);
                    });
                });
                featuresToUpdate.attr('d', 
                                generators.cardinalLineFunction(coords));
            }

            else { // line's type is cardinal
                arr = feature.attr('d').split(/[CQS]+/);
                coords = arr.map(function(c) {
                    c = c.replace(/M(\s?)+/, '');
                    c = c.replace('Z', '');
                    c = c.replace(/(\s?)+/, ''); //remove first space
                    c = c.replace(/\s+$/, ''); //remove last space
                    var coordsArray = c.split(',');

                    if (coordsArray.length < 2) {
                        coordsArray = c.split(' ');
                    }

                    if (coordsArray.length > 2) {
                        var l = coordsArray.length;
                        coordsArray = [coordsArray[l - 2], coordsArray[l - 1]];
                    }

                    return coordsArray.map(function(ca) {
                        return parseFloat(ca);
                    });
                });
                featuresToUpdate.attr('d', generators.lineFunction(coords));
            }
        };
    }
    angular.module(moduleApp)
        .service('geometry', geometry);

    geometry.$inject = ['generators'];
    
})();

/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.move
 * @description
 * # move
 * Service in the accessimapEditeurDerApp.
 */
(function() {
    'use strict';

    function move(geometryutils) {

        this.movePath = function(feature, scope) {
            var el = feature.node(),
                temporaryPath = el.cloneNode(true),
                bbox = el.getBBox();

            d3.select(temporaryPath)
                .attr('id', 'temporaryPath')
                .attr('opacity', 0.5);
            d3.select('#points-layer').node().appendChild(temporaryPath);

            d3.select('svg')
                .on('click', function() {
                    if (d3.select(temporaryPath).classed('moved')) {
                        var coordinates = d3.mouse(this),
                            transform = d3.transform(d3.select('#map-layer')
                                            .attr('transform')),
                            realCoordinates = 
                                geometryutils.realCoordinates(transform, coordinates),
                            transX = realCoordinates[0] - bbox.x,
                            transY = realCoordinates[1] - bbox.y,
                            emptyCircle = 
                                d3.select('.c' + feature.attr('data-link')),
                            emptyCircleExists = emptyCircle.node(),

                            transformString = '',
                            hasRotate = 
                                /rotate\((.*?)(?: |,)(.*?)(?: |,)(.*?)\)/
                                .exec(feature.attr('transform'));

                        if (hasRotate) {
                            transformString += 
                                'rotate(' + [hasRotate[1], 
                                    (parseFloat(hasRotate[2]) + transX), 
                                    (parseFloat(hasRotate[3]) + transY)] + ')';
                        }
                        transformString += 
                            'translate(' + [transX, transY] + ')';

                        feature.attr('transform', transformString);

                        if (emptyCircleExists) {
                            emptyCircle.attr('transform', transformString);
                        }

                        d3.select('svg').on('click', null);
                        d3.select('svg').on('mousemove', null);

                        d3.select(temporaryPath).remove();
                    }
                })
                .on('mousemove', function() {
                    var coordinates = d3.mouse(this),
                            transform = d3.transform(d3.select('#map-layer')
                                            .attr('transform')),
                        realCoordinates = 
                            geometryutils.realCoordinates(transform, coordinates),
                        transX = realCoordinates[0] - bbox.x,
                        transY = realCoordinates[1] - bbox.y,
                        transformString = '',
                        hasRotate = /rotate\((.*?)(?: |,)(.*?)(?: |,)(.*?)\)/
                            .exec(feature.attr('transform'));

                    if (hasRotate) {
                        transformString += 'rotate(' 
                            + [hasRotate[1], 
                            (parseFloat(hasRotate[2]) + transX), 
                            (parseFloat(hasRotate[3]) + transY)] + ')';
                    }
                    transformString += 'translate(' + [transX, transY] + ')';

                    d3.select(temporaryPath)
                        .classed('moved', true)
                        .attr('transform', transformString);
                });
        };

        this.movePoint = function(feature, scope) {
            var el = feature.node(),
                pathData = el.getPathData(),
                featuresToUpdate = feature;

            if (feature.attr('data-link')) {
                featuresToUpdate = 
                    d3.selectAll('.link_' + feature.attr('data-link'));
            }

            // draw temporary node at all path breaks
            var features = [],
                drag = d3.behavior.drag();

            angular.forEach(pathData, function(point, index) {
                var pointValues = point.values;

                if (pointValues && pointValues.length === 2) {
                    var px = pointValues[0],
                        py = pointValues[1];
                    features.push([px, py, index]);
                    d3.select('#points-layer')
                        .append('circle')
                        .classed('ongoing', true)
                        .attr('id', 'n' + index)
                        .attr('cx', px)
                        .attr('cy', py)
                        .attr('r', 10)
                        .attr('fill', 'red')
                        .call(drag);
                }
            });

            var nearest = null;

            drag.on('dragstart', function(e) {
                // silence other listeners
                d3.event.sourceEvent.stopPropagation();
                nearest = geometryutils.nearest(d3.mouse(this), features);
            });

            drag.on('drag', function() {
                var mousePosition = d3.mouse(this);
                d3.select(this)
                    .attr('cx', mousePosition[0])
                    .attr('cy', mousePosition[1]);

                var vertexNumber = 
                    parseInt(d3.select(this).attr('id').replace('n', ''));
                featuresToUpdate.each(function(d, i) {
                    var pathDataToUpdate = this.getPathData();
                    pathDataToUpdate[vertexNumber].values[0] = mousePosition[0];
                    pathDataToUpdate[vertexNumber].values[1] = mousePosition[1];
                    this.setPathData(pathDataToUpdate);
                });
            });

        };

        this.rotatePath = function(feature, scope) {
            var el = feature.node(),
                bbox = el.getBBox(),
                pathCenter = [bbox.x + bbox.width / 2, 
                                bbox.y + bbox.height / 2],
                pathCenterTranslate = [],
                emptyCircle = d3.select('.c' + feature.attr('data-link')),
                emptyCircleExists = emptyCircle.node();
            pathCenterTranslate[0] = pathCenter[0];
            pathCenterTranslate[1] = pathCenter[1];

            if (feature.attr('transform')) {
                var pathHasTranslate = /translate\((.*?)(?: |,)(.*?)\)/
                                    .exec(feature.attr('transform'));

                if (pathHasTranslate) {
                    pathCenterTranslate[0] = pathCenter[0] 
                                        + parseFloat(pathHasTranslate[1]);
                    pathCenterTranslate[1] = pathCenter[1] 
                                        + parseFloat(pathHasTranslate[2]);
                }
            }

            var drag = d3.behavior.drag(),

            rotationMarker = d3.select('#points-layer')
                .append('g')
                .classed('ongoing', true)
                .attr('transform', 'translate(' 
                                    + pathCenterTranslate[0] 
                                    + ',' 
                                    + (pathCenterTranslate[1] 
                                    + bbox.height * 2) 
                                    + ')')
                .attr('pathCenter', pathCenter)
                .attr('pathCenterTranslate', pathCenterTranslate)
                .call(drag);

            rotationMarker.append('circle')
                .attr('cx', 0)
                .attr('cy', 0)
                .attr('r', 10)
                .attr('fill', 'red')
                .attr('stroke', 'none');

            rotationMarker.append('svg:image')
                .attr('xlink:href', 'assets/icons/autorenew.svg')
                .attr('width', 20)
                .attr('height', 20)
                .attr('x', -10)
                .attr('y', -10);

            var initialAngle = 0;

            drag.on('dragstart', function() {
                // silence other listeners
                d3.event.sourceEvent.stopPropagation(); 
                var mouse = d3.mouse(d3.select('#points-layer').node());
                initialAngle = geometryutils.angle(pathCenterTranslate[0], 
                                        pathCenterTranslate[1], 
                                        mouse[0], 
                                        mouse[1]);
            }).on('drag', function() {
                var mouse = d3.mouse(d3.select('#points-layer').node()),
                    currentAngle = geometryutils.angle(pathCenterTranslate[0], 
                                        pathCenterTranslate[1], 
                                        mouse[0], 
                                        mouse[1]),
                    diffAngle = currentAngle - initialAngle,

                    transformString = '',
                    hasTranslate = /translate\((.*?)\)/
                                    .exec(feature.attr('transform'));

                if (hasTranslate) {
                    transformString += hasTranslate[0];
                }

                transformString += 'rotate(' 
                                + diffAngle 
                                + ' ' 
                                + pathCenter[0] 
                                + ' ' 
                                + pathCenter[1] 
                                + ')';

                feature.attr('transform', transformString);

                if (emptyCircleExists) {
                    emptyCircle.attr('transform', transformString);
                }

                rotationMarker.attr('transform', 'translate(' 
                                                    + mouse[0] 
                                                    + ',' 
                                                    + mouse[1] 
                                                    + ')');
            }).on('dragend', function() {
                d3.select('#points-layer').on('mousedown.drag', null);
                $('#der').css('cursor', 'auto');
            });
        };

    }

    angular.module(moduleApp)
        .service('move', move);

    move.$inject = ['geometryutils'];

})();

/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.remove
 * @description
 * # remove
 * Service in the accessimapEditeurDerApp.
 */
(function() {
    'use strict';

    function remove() {

        this.removeObject = removeObject;
        
        function removeFeature(feature, scope) {
            var featuresToUpdate = feature;

            if (feature.attr('data-link')) {
                featuresToUpdate = d3.selectAll('.link_' + feature.attr('data-link'));
            }
            var el = featuresToUpdate.node();
            scope.deletedFeature = new XMLSerializer().serializeToString(el);
            scope.updateView();
            
            var t = document.createElement('foreignObject');
            d3.select(t).attr('id', 'deletedElement');
            el.parentNode.insertBefore(t, el);
            featuresToUpdate.remove();
        }

        function removeObject(feature, scope) {
            // Remove previous deleted Element placeholder if it exists
            d3.select('#deletedElement').remove();

            // Some objects should not be deletable
            if (!d3.select(feature).node().classed('notDeletable')) {
                var iid = d3.select(feature).node().attr('data-link'),
                    featurePosition = scope.interactiveFilters.data.filter(function(row) {
                        return row.id === 'poi-' + iid;
                    }),
                    featureInFilters = scope.interactiveFilters.data.indexOf(featurePosition[0]);

                if (featureInFilters > -1) {
                    if (window.confirm('Ce point est interactif. Voules-vous vraiment le supprimer ?')) {
                        scope.removeRow(scope.interactiveFilters.data[featureInFilters]);
                        removeFeature(feature, scope);
                    }
                }

                else {
                    removeFeature(feature, scope);
                }
            }
        }
    }

    angular.module(moduleApp)
        .service('remove', remove);

})();

/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.reset
 * @description
 * # reset
 * Service in the accessimapEditeurDerApp.
 */
(function() {
    'use strict';

    function reset() {

        this.resetActions = function() {
            d3.selectAll('path:not(.menu-segment)')
                .on('click', function() {
                });
            d3.selectAll('svg')
                .on('click', function() {
                });
            d3.select('body')
                .on('keydown', function() {
                });
            d3.selectAll('path')
                .attr('marker-mid', null);
            //$('#der').css('cursor', 'auto');

            d3.selectAll('.ongoing').remove();

            d3.selectAll('.blink').classed('blink', false);
            d3.selectAll('.edition').classed('edition', false);
            d3.selectAll('.styleEdition').classed('styleEdition', false);
            d3.selectAll('.highlight').classed('highlight', false);
        };

    }

    angular.module(moduleApp)
        .service('reset', reset);
        
})();
/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.EditService
 * 
 * @requires accessimapEditeurDerApp.settings
 * @requires accessimapEditeurDerApp.MapService
 * @requires accessimapEditeurDerApp.DrawingService
 * @requires accessimapEditeurDerApp.LegendService
 * 
 * @description
 * Service used for the 'EditController', and the 'edit' view
 * 
 * Provide functions to 
 * - init a map/draw area
 * - draw features
 * - export data
 */
(function() {
    'use strict';

    function EditService($q, settings, MapService, DrawingService, LegendService, DefsService, InteractionService, ExportService, UtilService, ImportService) {

        this.init          = init;
        this.settings      = settings;
        this.featureIcon   = DrawingService.toolbox.featureIcon;
        this.enableAddPOI  = enableAddPOI;
        this.insertOSMData = insertOSMData;
        this.disableAddPOI = disableAddPOI;

        this.settings      = settings;

        // Drawing services
        // TODO : reset action has to work correctly for event...
        // we have to use map event or d3 event... not both (mea culpa)
        this.resetActions = function() {
            d3.selectAll('path:not(.menu-segment)').on('click', function() {});
            d3.selectAll('svg').on('click', function() {});
            d3.select('body').on('keydown', function() {});
            d3.selectAll('path').attr('marker-mid', null);

            //$('#der').css('cursor', 'auto');

            d3.selectAll('.ongoing').remove();

            d3.selectAll('.blink').classed('blink', false);
            d3.selectAll('.edition').classed('edition', false);
            d3.selectAll('.styleEdition').classed('styleEdition', false);
            d3.selectAll('.highlight').classed('highlight', false);

            MapService.removeEventListeners();
        }

        // Toolbox
        this.changeTextColor               = DrawingService.toolbox.changeTextColor;
        this.updateBackgroundStyleAndColor = DrawingService.toolbox.updateBackgroundStyleAndColor;
        this.updateFeatureStyleAndColor    = DrawingService.toolbox.updateFeatureStyleAndColor;
        this.updateMarker                  = DrawingService.toolbox.updateMarker;
        this.addRadialMenus                = DrawingService.toolbox.addRadialMenus;
        this.isUndoAvailable               = DrawingService.isUndoAvailable;
        this.undo                          = DrawingService.undo;
        this.enablePointMode               = enablePointMode;
        this.drawPoint                     = DrawingService.toolbox.drawPoint;
        this.enableCircleMode              = enableCircleMode;
        this.drawCircle                    = DrawingService.toolbox.drawCircle;
        this.enableLineOrPolygonMode       = enableLineOrPolygonMode;
        this.enableTextMode                = enableTextMode;

        this.exportData                    = function(model) {
            model.center = center ? center : MapService.getMap().getCenter();
            model.zoom   = zoom   ? zoom   : MapService.getMap().getZoom();
            resetZoom(function() { ExportService.exportData(model)});
        }

        // Map services
        this.showMapLayer                  = MapService.showMapLayer;
        this.hideMapLayer                  = MapService.hideMapLayer;

        this.geojsonToSvg                  = DrawingService.layers.geojson.geojsonToSvg;
        this.getFeatures                   = DrawingService.layers.geojson.getFeatures;
        
        this.removeFeature                 = DrawingService.layers.geojson.removeFeature;
        this.updateFeature                 = DrawingService.layers.geojson.updateFeature;
        this.rotateFeature                 = DrawingService.layers.geojson.rotateFeature;
        
        this.searchAndDisplayAddress       = searchAndDisplayAddress;
        this.fitBounds                     = fitBounds;
        this.panTo                         = panTo;

        this.freezeMap                     = freezeMap;

        this.resetZoom                     = resetZoom;

        this.rotateMap                     = rotateMap;

        this.interactions                  = InteractionService;

        this.changeDrawingFormat = changeDrawingFormat;
        this.changeLegendFormat  = changeLegendFormat;
        this.showFontBraille     = LegendService.showFontBraille;
        this.hideFontBraille     = LegendService.hideFontBraille;

        this.uploadFile          = uploadFile;
        this.appendSvg           = appendSvg;
        this.importDER           = importDER;

        var d3Element = null, 
            overlayDrawing, 
            overlayGeoJSON, 
            overlayBackground, 
            overlay, 
            center = null,
            zoom = null,
            referenceBounds, // useful to remember where to center view
            // useful to know if the map is 'freezed', 
            // that is to say it's not moving anymore inside the 'format overlay'
            mapFreezed, 
            // indicates if the initial scaled have been defined
            // to be used in d3svgoverlay
            // if true, we don't need to init overlay anymore
            scaleDefined = false;

        function freezeMap() {
            mapFreezed = true;
            MapService.removeMoveHandler();
            // MapService.removeViewResetHandler();
            if (scaleDefined!==true) {
                scaleDefined = true;
            }

            overlay.unFreezeScaling();
            overlayGeoJSON.unFreezeScaling();
            overlayDrawing.unFreezeScaling();
            overlayBackground.unFreezeScaling();

            center = ( center === null ) ? MapService.getMap().getCenter() : center ;
            zoom = ( zoom === null ) ? MapService.getMap().getZoom() : zoom;

        }
        
        function initMode() {
            MapService.changeCursor('crosshair');
            MapService.removeEventListeners();
        }
        

        function enablePointMode(getDrawingParameter) {

            initMode();

            MapService.addClickListener(function(e) {
                var p = projDrawing.latLngToLayerPoint(e.latlng),
                    drawingParameters = getDrawingParameter();
                DrawingService.toolbox.drawPoint(p.x, p.y, drawingParameters.style, drawingParameters.color);
            })

        }

        function enableCircleMode(getDrawingParameter) {

            initMode();

            MapService.addClickListener(function(e) {
                var p = projDrawing.latLngToLayerPoint(e.latlng),
                    // p = MapService.projectPoint(e.latlng.lng,  e.latlng.lat),
                    drawingParameters = getDrawingParameter();
                DrawingService.toolbox.drawCircle(p.x, 
                                        p.y, 
                                        drawingParameters.style, 
                                        drawingParameters.color, 
                                        drawingParameters.contour)
            })

            MapService.addMouseMoveListener(function(e) {
                var p = projDrawing.latLngToLayerPoint(e.latlng),
                    // p = MapService.projectPoint(e.latlng.lng,  e.latlng.lat),
                    drawingParameters = getDrawingParameter();
                DrawingService.toolbox.updateCircleRadius(p.x, p.y);
            })

        }

        function enableLineOrPolygonMode(getDrawingParameter) {

            initMode();

            var lastPoint = null,
                lineEdit = [];

            MapService.addClickListener(function(e) {
                var p = projDrawing.latLngToLayerPoint(e.latlng),
                    // p = MapService.projectPoint(e.latlng.lng,  e.latlng.lat),
                    drawingParameters = getDrawingParameter();
                DrawingService.toolbox.beginLineOrPolygon(p.x, 
                                                p.y, 
                                                drawingParameters.style, 
                                                drawingParameters.color, 
                                                drawingParameters.contour, 
                                                drawingParameters.mode, 
                                                lastPoint, 
                                                lineEdit);
                lastPoint = p;
            })

            MapService.addMouseMoveListener(function(e) {
                var p = projDrawing.latLngToLayerPoint(e.latlng),
                    // p = MapService.projectPoint(e.latlng.lng,  e.latlng.lat),
                    drawingParameters = getDrawingParameter();
                DrawingService.toolbox.drawHelpLineOrPolygon(p.x, 
                                                    p.y, 
                                                    drawingParameters.style, 
                                                    drawingParameters.color, 
                                                    drawingParameters.contour, 
                                                    drawingParameters.mode, 
                                                    lastPoint);
            })

            MapService.addDoubleClickListener(function(e) {
                var p = projDrawing.latLngToLayerPoint(e.latlng),
                    // p = MapService.projectPoint(e.latlng.lng,  e.latlng.lat),
                    drawingParameters = getDrawingParameter();
                DrawingService.toolbox.finishLineOrPolygon(p.x, 
                                                    p.y, 
                                                    drawingParameters.style, 
                                                    drawingParameters.color, 
                                                    drawingParameters.mode);
                lastPoint = null;
                lineEdit = [];
            })

        }

        function enableTextMode(getDrawingParameter) {

            initMode();

            MapService.addClickListener(function(e) {
                var p = projDrawing.latLngToLayerPoint(e.latlng),
                    // p = MapService.projectPoint(e.latlng.lng,  e.latlng.lat),
                    drawingParameters = getDrawingParameter();
                DrawingService.toolbox.writeText(p.x, p.y, drawingParameters.font, drawingParameters.fontColor);
            })

        }

        /**
         * @ngdoc method
         * @name  init
         * @methodOf accessimapEditeurDerApp.EditService
         *
         * @description
         * Initialize the different services :
         * - MapLeaflet to init the map container
         * - Drawing to init the d3 container
         * - Legend to init the legend container
         *
         * Link the map & the d3 container on 'move' and 'viewreset' events
         * 
         * @param  {[type]} drawingFormat
         * Printing format of the d3 container and the map container
         * 
         * @param  {[type]} legendFormat
         * Printing format of the legend container
         */
        var selBackground, selOverlay, selDrawing, selGeoJSON, 
                projBackground, projOverlay, projDrawing, projGeoJSON,
                currentDrawingFormat, currentLegendFormat ;

        function init(drawingFormat, legendFormat) {

            currentDrawingFormat = (drawingFormat === undefined) 
                                    ? settings.FORMATS[settings.DEFAULT_DRAWING_FORMAT]
                                    : drawingFormat;
            currentLegendFormat = (legendFormat === undefined) 
                                    ? settings.FORMATS[settings.DEFAULT_LEGEND_FORMAT]
                                    : legendFormat;
            
            MapService.initMap('workspace', 
                            drawingFormat.width, 
                            drawingFormat.height, 
                            settings.ratioPixelPoint,
                            MapService.resizeFunction);

            // Background used to import images, svg or pdf to display a background helper
            overlayBackground = L.d3SvgOverlay(function(sel, proj) {
                selBackground = sel;
                projBackground = proj;
            }, { zoomDraw: true, zoomHide: false, name: 'background'});
            overlayBackground.addTo(MapService.getMap())
            overlayBackground.freezeScaling();

            // Overlay used to import GeoJSON features from OSM
            overlayGeoJSON = L.d3SvgOverlay(function(sel, proj) {
                selGeoJSON = sel;
                projGeoJSON = proj;

                DrawingService.layers._elements.geojson.sel = sel;
                DrawingService.layers._elements.geojson.sel = proj;

                // if map is freezed, we just use the translate / zoom from d3svgoverlay
                // if not, we re draw the geojson features with reverse scaling
                if (mapFreezed !== true){
                    DrawingService.layers.geojson.refresh(proj);
                }

            }, { zoomDraw: true, zoomHide: false, name: 'geojson'});
            overlayGeoJSON.addTo(MapService.getMap())
            overlayGeoJSON.freezeScaling();

            // Overlay used to draw shapes
            overlayDrawing = L.d3SvgOverlay(function(sel, proj) {
                selDrawing = sel;
                projDrawing = proj;
                DrawingService.layers._elements.drawing.sel = sel;
                DrawingService.layers._elements.drawing.sel = proj;
            }, { zoomDraw: true, zoomHide: false, name: 'drawing'});
            overlayDrawing.addTo(MapService.getMap())
            overlayDrawing.freezeScaling();

            // Overlay used to display the printing format
            overlay = L.d3SvgOverlay(function(sel, proj) {
                selOverlay = sel;
                projOverlay = proj;
            }, { zoomDraw: false, zoomHide: false, name: 'overlay'});
            overlay.addTo(MapService.getMap())
            overlay.freezeScaling();

            DrawingService.initDrawing({
                            background: {sel: selBackground, proj: projBackground },
                            overlay: {sel: selOverlay, proj: projOverlay },
                            drawing: {sel: selDrawing, proj: projDrawing },
                            geojson: {sel: selGeoJSON, proj: projGeoJSON }
                        }, 
                        drawingFormat.width / settings.ratioPixelPoint, 
                        drawingFormat.height / settings.ratioPixelPoint, 
                        settings.margin)

            mapFreezed = false;
            MapService.addMoveHandler(function(size, pixelOrigin, pixelBoundMin) {
                // if scale is not defined, 
                // we have to re draw the overlay to keep the initial format / position
                if (scaleDefined!==true) {
                    DrawingService.layers.overlay.refresh(size, pixelOrigin, pixelBoundMin);
                }
            })
            MapService.getMap().setView(MapService.getMap().getCenter(), MapService.getMap().getZoom(), {reset:true});

            // we create defs svg in a different svg of workspace & legend
            // it's useful to let #legend & #workspace svg access to patterns
            // created inside #pattern svg
            DefsService.createDefs(d3.select('#pattern'));

            LegendService.initLegend('#legend', 
                                    legendFormat.width, 
                                    legendFormat.height, 
                                    settings.margin, 
                                    settings.ratioPixelPoint);

            // MapService.resizeFunction();

        }

        function changeDrawingFormat(format) {
            resetZoom()
            DrawingService.layers.overlay.draw(settings.FORMATS[format].width / settings.ratioPixelPoint, 
                                                settings.FORMATS[format].height / settings.ratioPixelPoint);
            MapService.setMinimumSize(settings.FORMATS[format].width / settings.ratioPixelPoint,
                                        settings.FORMATS[format].height / settings.ratioPixelPoint);
            MapService.resizeFunction();
            center = DrawingService.layers.overlay.getCenter();
            resetZoom();
            // MapService.getMap().invalidateSize()
        }

        function changeLegendFormat(format) {
            LegendService.draw(settings.FORMATS[format].width / settings.ratioPixelPoint, 
                                                settings.FORMATS[format].height / settings.ratioPixelPoint);
        }

        /**
         * @ngdoc method
         * @name  enableAddPOI
         * @methodOf accessimapEditeurDerApp.EditService
         * 
         * @description 
         * Enable the 'Add POI' mode, 
         * allowing user to click on the map and retrieve data from OSM
         * 
         * @param {function} _successCallback 
         * Callback function called when data has been retrieved, data is passed in first argument
         * 
         * @param {function} _errorCallback 
         * Callback function called when an error occured, error is passed in first argument
         */
        function enableAddPOI(_successCallback, _errorCallback) {

            initMode();

            MapService.addClickListener(function(e) {
                // TODO: prevent any future click 
                // user has to wait before click again
                MapService.changeCursor('progress');
                
                MapService
                    .retrieveData([e.latlng.lng,  e.latlng.lat], settings.QUERY_LIST[0])
                    .then(_successCallback)
                    .catch(_errorCallback)
                    .finally(function finallyCallback() {
                        MapService.changeCursor('crosshair');
                    })
            })
        }

        /**
         * @ngdoc method
         * @name  disableAddPOI
         * @methodOf accessimapEditeurDerApp.EditService
         * 
         * @description 
         * Disable the 'Add POI' mode by resetting CSS cursor.
         * 
         */
        function disableAddPOI() {
            MapService.resetCursor();
        }

        /**
         * @ngdoc method
         * @name  insertOSMData
         * @methodOf accessimapEditeurDerApp.EditService
         * 
         * @description 
         * Retrieve data from nominatim (via MapService) for a specific 'query'
         * 
         * @param {function} query 
         * Query settings from settings.QUERY_LIST
         * 
         * @param {function} _successCallback 
         * Callback function called when data has been retrieved, data is passed in first argument
         * 
         * @param {function} _errorCallback 
         * Callback function called when an error occured, error is passed in first argument
         */
        function insertOSMData(query, _successCallback, _errorCallback) {

            MapService.changeCursor('progress');
            
            MapService
                .retrieveData(MapService.getBounds(), query)
                .then(_successCallback)
                .catch(_errorCallback)
                .finally(function finallyCallback() {
                    MapService.resetCursor();
                })
        }

        /**
         * @ngdoc method
         * @name  rotateMap
         * @methodOf accessimapEditeurDerApp.EditService
         * 
         * @description 
         * Rotate all '.rotable' elements 
         * 
         * @param  {Object} angle 
         * Angle in degree of the rotation
         */
        function rotateMap(angle) {
            var size = MapService.getMap().getSize();

            $('.leaflet-layer').css('transform', 'rotate(' + angle + 'deg)'); 
            //' ' + size.x / 2 + ' ' + size.y / 2 + ')');
            d3.selectAll('.rotable').attr('transform', 'rotate(' + angle + ')');
            //' ' + _width / 2 + ' ' + _height / 2 + ')');
        }

        /**
         * @ngdoc method
         * @name  searchAndDisplayAddress
         * @methodOf accessimapEditeurDerApp.EditService
         *
         * @description 
         * Search via nominatim & display the first result in d3 drawing
         *
         * Could be more clever by displaying all the results 
         * and allow the user to choose the right one...
         *
         * In a future version maybe !
         * 
         * @param  {String} address
         * Address to search & display
         *
         * @return {Promise}
         * The promise of the search... could be successful, or not !
         */
        function searchAndDisplayAddress(address, id, style, color) {
            var deferred = $q.defer();
            MapService.searchAddress(address)
                .then(function(results) {
                    // if (results.length >= 1) {
                    // display something to allow user choose an option ?
                    // } else {
                    if (results.length > 0)
                        DrawingService.layers.geojson.drawAddress(results[0], id, style, color);
                    // }
                    deferred.resolve(results[0]);
                })
            return deferred.promise;
        }

        function fitBounds(points) {
            MapService.getMap().fitBounds(points);
        }

        function panTo(point) {
            MapService.getMap().panTo(point);
        }

        /**
         * @ngdoc method
         * @name  resetZoom
         * @methodOf accessimapEditeurDerApp.EditService
         *
         * @description 
         * If a center of the drawing is defined, 
         * we pan / zoom to the initial state of the drawing.
         *
         * @param {function} callback
         * Optional, function to be called when the setView is finished
         */
        function resetZoom(callback) {

            if (center !== null && zoom !== null) {
                // if the tile layer don't zoom, we're not going to load tiles
                // we have to detect if we are going to change the zoom level or not
                var zoomWillChange = ( MapService.getMap().getZoom() !== zoom );

                if (zoomWillChange) {
                    MapService.getTileLayer().once('load', function() { 
                        console.log('load')
                        if (callback) callback(); 
                    })
                }

                MapService.getMap().setView(center, zoom, {animate:false})

                if (! zoomWillChange && callback) {
                    console.log('zoomWillNotChange... so callback')
                    callback();
                }

            } else {
                if (callback) callback();
            }

        }

        function uploadFile(element) {

            UtilService.uploadFile(element)
                .then(function(data) {
                    switch (data.type) {
                        case 'image/svg+xml':
                        case 'image/png':
                        case 'image/jpeg':
                            DrawingService.layers.background.appendImage(data.dataUrl, MapService.getMap().getSize(), MapService.getMap().getPixelOrigin(), MapService.getMap().getPixelBounds().min);
                            break;

                        case 'application/pdf':
                            appendPdf(data.dataUrl);
                            break;

                        default:
                            console.log('Mauvais format');
                    }
                })

        };

        /**
         * @ngdoc method
         * @name  appendPdf
         * @methodOf accessimapEditeurDerApp.EditService
         *
         * @description 
         * Append the first page of a pdf in the background layer
         * 
         * @param  {dataUrl} image
         * dataUrl (could be png, jpg, ...) to insert in the background
         * 
         */
        function appendPdf(dataURI) {
            var BASE64_MARKER = ';base64,',
                base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length,
                base64 = dataURI.substring(base64Index),
                raw = window.atob(base64),
                rawLength = raw.length,
                array = new Uint8Array(new ArrayBuffer(rawLength));

            for (var i = 0; i < rawLength; i++) {
                array[i] = raw.charCodeAt(i);
            }
            PDFJS.getDocument(array)
            .then(function(pdf) {
                pdf.getPage(1).then(function(page) {
                    var scale = 1.5,
                        viewport = page.getViewport(scale),
                        canvas = document.createElement('canvas'), //document.getElementById('pdf-canvas'),
                        context = canvas.getContext('2d');

                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    var renderContext = {
                        canvasContext: context,
                        viewport: viewport
                    };
                    page.render(renderContext).then(function() {
                        // appendImage(canvas.toDataURL());
                        DrawingService.layers.background.appendImage(canvas.toDataURL(), MapService.getMap().getSize(), MapService.getMap().getPixelOrigin(), MapService.getMap().getPixelBounds().min);
                            
                    });
                });
            });
        }

        function appendSvg(path) {
            
            d3.xml(path, function(xml) {
                // adapt the format of the drawing
                $(xml.documentElement).data('format')
                
                
                // Load polygon fill styles taht will be used on common map
                var originalSvg = d3.select(xml.documentElement),
                    children = originalSvg[0][0].children,
                    returnChildren = function() {
                        return children[i];
                    };

                for (var i = 0; i < children.length; i++) {
                    var id = d3.select(children[i]).attr('id'),
                        element = d3.select(children[i]);

                    if (id !== 'margin-layer'
                        && id !== 'frame-layer'
                        && id !== 'background-layer') {
                        d3.select(children[i]).classed('sourceDocument', true);
                        DrawingService.layers.background.append(returnChildren);
                    }
                }

            });
        }

        function importDER(element) {

            var deferred = $q.defer();

            UtilService.uploadFile(element)
                .then(function(data) {

                    switch (data.type) {
                        case 'image/svg+xml':
                            d3.xml(data.dataUrl, function(svgElement) {
                                ImportService.importDrawing(svgElement);
                                freezeMap();
                                deferred.resolve();
                            })
                            break;

                        case 'application/zip':
                            JSZip.loadAsync(element.files[0])
                                .then(function(zip) {
                                    
                                    var commentairesPath,
                                        legendPath,
                                        drawingPath,
                                        interactionPath,
                                        legendElement, svgElement, interactionData;

                                    zip.forEach(function (relativePath, zipEntry) {
                                        
                                        if (relativePath.indexOf("carte_sans_source.svg") >= 0) {
                                            drawingPath = relativePath;
                                        }

                                        if (relativePath.indexOf("interactions.xml") >= 0) {
                                            interactionPath = relativePath;
                                        }
                                    });

                                    var parser = new DOMParser();

                                    if (drawingPath) {
                                        zip.file(drawingPath).async("string")
                                        .then(function(data) {
                                            var svgElement = parser.parseFromString(data, "text/xml"),
                                                model = ImportService.getModelFromSVG(svgElement);

                                            if (model.center !== null && model.zoom !== null) {
                                                center = model.center;
                                                zoom = model.zoom;
                                                MapService.getMap().setView(model.center, model.zoom, {reset:true});
                                                freezeMap();
                                            }

                                            if (model.isMapVisible) {
                                                MapService.showMapLayer();
                                            }
                                            
                                            ImportService.importDrawing(svgElement)
                                            
                                            deferred.resolve(model);
                                        })
                                    }

                                    if (interactionPath) {
                                        zip.file(interactionPath).async("string")
                                        .then(function(data) {
                                            ImportService.importInteraction(parser.parseFromString(data, "text/xml"));
                                        })
                                    }

                                    // deferred.resolve();

                                    // TODO: make a Promise.all to manage the import time

                                });

                            break;

                        default:
                            console.log('Mauvais format');
                    }
                    
                })

            return deferred.promise;

        }

    }

    angular.module(moduleApp).service('EditService', EditService);

    EditService.$inject = ['$q',
                            'settings', 
                            'MapService', 
                            'DrawingService', 
                            'LegendService',
                            'DefsService',
                            'InteractionService',
                            'ExportService',
                            'UtilService',
                            'ImportService',
                            ];

})();
/*global turf, osmtogeojson */

/**
 * @ngdoc controller
 * @name accessimapEditeurDerApp.controller:EditController
 * @requires accessimapEditeurDerApp.EditService
 * @description
 * Controller of the '/edit' view
 *
 * The '/edit' view is a POC to leaflet's map & drawing
 *
 * This view allow the user to :
 * - display a map (thanks to leaflet)
 * - search some features (address, POI, areas)
 * - get data for POI or for a specific set (buildings, roads, ...) & display them
 * - visualize the area which will be print
 */
(function() {
    'use strict';

    function EditController(EditService, ToasterService, $location, $q) {
        
        var $ctrl = this;

        /**
         * @ngdoc property
         * @name  queryChoices
         * @propertyOf accessimapEditeurDerApp.controller:EditController
         * 
         * @description
         * Options of POI and area to add on the map
         */
        $ctrl.queryChoices = EditService.settings.QUERY_LIST;
        
        /**
         * @ngdoc property
         * @name  queryChosen
         * @propertyOf accessimapEditeurDerApp.controller:EditController
         * 
         * @description
         * POI / area selected 
         */
        $ctrl.queryChosen  = EditService.settings.QUERY_DEFAULT; // $ctrl.queryChoices[1];
        /**
         * @ngdoc property
         * @name  styleChoices
         * @propertyOf accessimapEditeurDerApp.controller:EditController
         * 
         * @description
         * Options of styling for the queryChosen' type
         */
        $ctrl.styleChoices = EditService.settings.STYLES[$ctrl.queryChosen.type];

        /**
         * @ngdoc property
         * @name  styleChosen
         * @propertyOf accessimapEditeurDerApp.controller:EditController
         * @description
         * Style selected for the queryChosen' type
         */
        $ctrl.styleChosen  = $ctrl.styleChoices[0];
        
        /**
         * @ngdoc
         * @name  changeStyle
         * @methodOf accessimapEditeurDerApp.controller:EditController
         * @description Update the styleChoices & styleChosen properties according to the queryChosen type
         */
        $ctrl.changeStyle  = function() {
            $ctrl.styleChoices = EditService.settings.STYLES[$ctrl.queryChosen.type];
            $ctrl.styleChosen  = $ctrl.styleChoices[0];
        };

        $ctrl.model = {
            title        : 'Titre du dessin',
            isMapVisible : false,
            comment      : 'Pas de commentaire',
            mapFormat    : 'landscapeA4',
            legendFormat : 'landscapeA4',
        }

        $ctrl.fonts                      = EditService.settings.FONTS;
        $ctrl.fontChosen                 = $ctrl.fonts[0];
        $ctrl.fontColors                 = EditService.settings.COLORS;
        $ctrl.fontColorChosen            = $ctrl.fontColors[$ctrl.fontChosen.color][0];
        
        $ctrl.colors                     = (EditService.settings.COLORS.transparent)
                                                .concat(EditService.settings.COLORS.other);
        $ctrl.colorChosen                = $ctrl.colors[0];
        $ctrl.featureIcon                = EditService.featureIcon;
        $ctrl.formats                    = EditService.settings.FORMATS;
        $ctrl.backgroundColor            = EditService.settings.COLORS.transparent[0]; // transparent
        $ctrl.backgroundStyle            = EditService.settings.STYLES.polygon[EditService.settings.STYLES.polygon - 1]; // solid
        $ctrl.backgroundStyleChoices     = EditService.settings.STYLES.polygon;
        $ctrl.mapFormat                  = $location.search().mapFormat ? $location.search().mapFormat : 'landscapeA4';
        $ctrl.legendFormat               = $location.search().legendFormat ? $location.search().legendFormat : 'landscapeA4';
        $ctrl.checkboxModel              = { contour: true};
        $ctrl.getFeatures                = EditService.getFeatures;
        
        // general state parameters        
        $ctrl.isParametersVisible            = true; // initial state = parameters
        $ctrl.isMapParametersVisible         = false;
        $ctrl.isDrawingParametersVisible     = false;
        $ctrl.isLegendParametersVisible      = false;
        $ctrl.isInteractionParametersVisible = false;
        $ctrl.isBackgroundParametersVisible  = false;
        
        // map state parameters
        $ctrl.isAddressVisible           = false;
        $ctrl.isPoiCreationVisible       = false;
        $ctrl.isFeatureCreationVisible   = false;
        $ctrl.isFeatureManagementVisible = true;
        
        $ctrl.isMapFreezed = false;

        // states of right side : drawing (workspace) or legend ?
        $ctrl.isWorkspaceVisible  = true;
        $ctrl.isLegendVisible     = false;
        
        $ctrl.isBrailleDisplayed  = true;
        
        $ctrl.markerStartChoices  = EditService.settings.markerStart;
        $ctrl.markerStopChoices   = EditService.settings.markerStop;
        
        $ctrl.isUndoAvailable     = EditService.isUndoAvailable;
        
        $ctrl.exportData          = function() { EditService.exportData($ctrl.model) };
        $ctrl.rotateMap           = EditService.rotateMap;
        
        $ctrl.changeDrawingFormat = EditService.changeDrawingFormat;
        $ctrl.changeLegendFormat  = EditService.changeLegendFormat;
        
        $ctrl.interactions        = EditService.interactions;
        
        $ctrl.mapCategories       = EditService.settings.mapCategories;
        
        $ctrl.uploadFile          = EditService.uploadFile;
        $ctrl.appendSvg           = EditService.appendSvg;
        
        $ctrl.importDER = function(file) {
            EditService.importDER(file)
                .then(function definedModel(model) {
                    $ctrl.model = model;
                });
        }
            
        /**
         * @ngdoc method
         * @name  showMap
         * @methodOf accessimapEditeurDerApp.controller:EditController
         * 
         * @description
         * Show the map layer
         */
        $ctrl.showMap = function() {
            $ctrl.model.isMapVisible = true;
            EditService.showMapLayer();
        }
        
        /**
         * @ngdoc method
         * @name  hideMap
         * @methodOf accessimapEditeurDerApp.controller:EditController
         * 
         * @description
         * Hide the map layer
         */
        $ctrl.hideMap = function() {
            $ctrl.model.isMapVisible = false;
            EditService.hideMapLayer()
        }

        /**
         * @ngdoc method
         * @name  showFontBraille
         * @methodOf accessimapEditeurDerApp.controller:EditController
         * 
         * @description
         * Show the map layer
         */
        $ctrl.showFontBraille = function() {
            $ctrl.isBrailleDisplayed = true;
            EditService.showFontBraille();
        }
        
        /**
         * @ngdoc method
         * @name  hideFontBraille
         * @methodOf accessimapEditeurDerApp.controller:EditController
         * 
         * @description
         * Hide the map layer
         */
        $ctrl.hideFontBraille = function() {
            $ctrl.isBrailleDisplayed = false;
            EditService.hideFontBraille()
        }

        /**
         * Map parameters
         */
        $ctrl.displayAddPOIForm = function() {
            $ctrl.isAddressVisible           = false;
            $ctrl.isPoiCreationVisible       = true;
            $ctrl.isFeatureCreationVisible   = false;
            $ctrl.isFeatureManagementVisible = false;

            $ctrl.queryChosen  = EditService.settings.QUERY_POI;
            $ctrl.styleChoices = EditService.settings.STYLES[$ctrl.queryChosen.type];
            $ctrl.styleChosen  = $ctrl.styleChoices[0];

            EditService.enableAddPOI(drawGeoJSON, ToasterService.displayError);
        }

        function drawGeoJSON(osmGeojson) {
            
            if (! osmGeojson) {
                throw new Error('Parameter osmGeojson undefined. Please provide it before calling this function.')
            }
            
            if (osmGeojson.features && osmGeojson.features.length > 0) {
                EditService.geojsonToSvg(osmGeojson, 
                        null, 
                        'node_' + osmGeojson.features[0].properties.id, 
                        false, 
                        $ctrl.queryChosen, 
                        $ctrl.styleChosen, 
                        $ctrl.styleChoices, 
                        $ctrl.colorChosen, 
                        $ctrl.checkboxModel, 
                        $ctrl.rotationAngle)
            }
            else {
                // TODO: soft error, with a toaster or something to explain to the user we haven't find anything...
                throw new Error('No feature to display... Please click again, maybe not at the same place ?')
            }
        }
        $ctrl.displaySearchAddressForm = function() {
            $ctrl.isAddressVisible           = true;
            $ctrl.isPoiCreationVisible       = false;
            $ctrl.isFeatureCreationVisible   = false;
            $ctrl.isFeatureManagementVisible = false;
        }
        $ctrl.displayGetDataFromOSMForm = function() {
            $ctrl.isAddressVisible           = false;
            $ctrl.isPoiCreationVisible       = false;
            $ctrl.isFeatureCreationVisible   = true;
            $ctrl.isFeatureManagementVisible = false;
        }
        $ctrl.insertOSMData = function()  {
            EditService.insertOSMData($ctrl.queryChosen, drawGeoJSON, ToasterService.displayError)
        }
        $ctrl.displayFeatureManagement = function() {
            $ctrl.isAddressVisible           = false;
            $ctrl.isPoiCreationVisible       = false;
            $ctrl.isFeatureCreationVisible   = false;
            $ctrl.isFeatureManagementVisible = true;
        }

        /**
         * General parameters
         */
        $ctrl.displayParameters = function() {
            $ctrl.isParametersVisible            = true;
            $ctrl.isMapParametersVisible         = false;
            $ctrl.isDrawingParametersVisible     = false;
            $ctrl.isLegendParametersVisible      = false;
            $ctrl.isInteractionParametersVisible = false;
            $ctrl.isBackgroundParametersVisible  = false;
        }
        $ctrl.displayMapParameters = function() {
            $ctrl.isWorkspaceVisible             = true;
            $ctrl.isLegendVisible                = false;
            
            $ctrl.isParametersVisible            = false;
            $ctrl.isMapParametersVisible         = true;
            $ctrl.isDrawingParametersVisible     = false;
            $ctrl.isLegendParametersVisible      = false;
            $ctrl.isInteractionParametersVisible = false;
            $ctrl.isBackgroundParametersVisible  = false;

            $ctrl.displayFeatureManagement();
        }
        $ctrl.displayDrawingParameters = function() {
            $ctrl.isWorkspaceVisible             = true;
            $ctrl.isLegendVisible                = false;
            
            $ctrl.isParametersVisible            = false;
            $ctrl.isMapParametersVisible         = false;
            $ctrl.isDrawingParametersVisible     = true;
            $ctrl.isLegendParametersVisible      = false;
            $ctrl.isInteractionParametersVisible = false;
            $ctrl.isBackgroundParametersVisible  = false;

            $ctrl.enableDrawingMode('default');
            
            $ctrl.isMapFreezed               = true;
            EditService.freezeMap();
        }
        $ctrl.displayLegendParameters = function() {
            $ctrl.isWorkspaceVisible             = false;
            $ctrl.isLegendVisible                = true;
            
            $ctrl.isParametersVisible            = false;
            $ctrl.isMapParametersVisible         = false;
            $ctrl.isDrawingParametersVisible     = false;
            $ctrl.isLegendParametersVisible      = true;
            $ctrl.isInteractionParametersVisible = false;
            $ctrl.isBackgroundParametersVisible  = false;
        }
        $ctrl.displayInteractionParameters = function() {
            $ctrl.isParametersVisible            = false;
            $ctrl.isMapParametersVisible         = false;
            $ctrl.isDrawingParametersVisible     = false;
            $ctrl.isLegendParametersVisible      = false;
            $ctrl.isInteractionParametersVisible = true;
            $ctrl.isBackgroundParametersVisible  = false;
        }
        $ctrl.displayBackgroundParameters = function() {
            $ctrl.isParametersVisible            = false;
            $ctrl.isMapParametersVisible         = false;
            $ctrl.isDrawingParametersVisible     = false;
            $ctrl.isLegendParametersVisible      = false;
            $ctrl.isInteractionParametersVisible = false;
            $ctrl.isBackgroundParametersVisible  = true;
        }

        $ctrl.removeFeature = EditService.removeFeature;
        $ctrl.updateFeature = EditService.updateFeature;
        $ctrl.rotateFeature = EditService.rotateFeature;

        $ctrl.updateMarker  = EditService.updateMarker;
        $ctrl.toggleLegendFontBraille  = EditService.toggleLegendFontBraille;

        $ctrl.updateColor = function(color) {
            EditService.updateFeatureStyleAndColor(null, color);
        }

        $ctrl.updateStyle = function(style) {
            EditService.updateFeatureStyleAndColor(style, null);
        }

        $ctrl.updateBackgroundColor = function(color) {
            EditService.updateBackgroundStyleAndColor(null, color);
        }

        $ctrl.updateBackgroundStyle = function(style) {
            EditService.updateBackgroundStyleAndColor(style, null);
        }
        
        // switch of editor's mode
        // adapt user's interactions
        $ctrl.enableDrawingMode = function(mode) {

            EditService.resetActions();

            $ctrl.mode = mode;

            function setStyles(styleSetting) {
                $ctrl.styleChoices = EditService.settings.STYLES[styleSetting];
                $ctrl.styleChosen  = $ctrl.styleChoices[0];
            }

            function getDrawingParameter() {
                return {
                    style: $ctrl.styleChosen,
                    color: $ctrl.colorChosen,
                    font: $ctrl.fontChosen,
                    fontColor: $ctrl.fontColorChosen,
                    contour: $ctrl.checkboxModel ? $ctrl.checkboxModel.contour : false,
                    mode: $ctrl.mode
                }
            }

            switch ($ctrl.mode) {

                case 'default':
                    EditService.addRadialMenus();
                    break;

                case 'undo':
                    EditService.undo();
                    break;

                case 'point':
                    setStyles($ctrl.mode);
                    EditService.enablePointMode(getDrawingParameter);
                    break;

                case 'circle':
                    setStyles('polygon');
                    EditService.enableCircleMode(getDrawingParameter);
                    break;

                case 'line':
                case 'polygon':
                    setStyles($ctrl.mode);
                    EditService.enableLineOrPolygonMode(getDrawingParameter);
                    break;

                case 'addtext':
                    EditService.enableTextMode(getDrawingParameter);
                    break;
            }

        }

        $ctrl.centerView = EditService.resetZoom;

        $ctrl.searchAddress      = function() {
            
            var promises = [];

            if($ctrl.address.start) {
                promises.push(
                    EditService.searchAndDisplayAddress($ctrl.address.start,
                                        'startPoint',
                                        $ctrl.styleChosen,
                                        $ctrl.colorChosen));
            }

            if($ctrl.address.stop) {
                promises.push(
                    EditService.searchAndDisplayAddress($ctrl.address.stop,
                                        'stopPoint',
                                        $ctrl.styleChosen,
                                        $ctrl.colorChosen));
            }

            // center the map or display both of addresses
            $q.all(promises)
                .then(function(results) {
                    if (results.length > 1) {
                        // fitBounds
                        EditService.fitBounds([
                                [results[0].lat, results[0].lon],
                                [results[1].lat, results[1].lon],
                            ])
                    } else {
                        // pan
                        EditService.panTo([results[0].lat, results[0].lon])
                    }
                })
                .catch(function(error) {
                    ToasterService.displayError(error);
                })
        };  

        // Initialisation of the view
        EditService.init(EditService.settings.FORMATS[$ctrl.mapFormat], 
                        EditService.settings.FORMATS[$ctrl.legendFormat]);
        
    }

    angular.module(moduleApp).controller('EditController', EditController);

    EditController.$inject = ['EditService', 'ToasterService', '$location', '$q']
})();
/**
 * @ngdoc controller
 * @name accessimapEditeurDerApp.controller:HomeController
 * @requires $rootScope
 * @requires $location
 * @requires accessimapEditeurDerApp.settings
 * 
 * @description
 * Controller of the Home View
 */
(function() {
    'use strict';

    function HomeController($rootScope, $location, settings) {

        var $ctrl = this;

        $rootScope.displayFooter  = true;
    
        $ctrl.mapFormat        = 'landscapeA4';
        $ctrl.legendFormat     = 'landscapeA4';
        $ctrl.formats          = settings.FORMATS;
    
        $ctrl.goToEdit         = goToEdit;

        function goToEdit() {
            $rootScope.displayFooter  = false;
            $location.path('/edit');
        }
    }

    angular.module(moduleApp).controller('HomeController', HomeController);

    HomeController.$inject = ['$rootScope', '$location', 'settings'];
})();
;(function(){

'use strict';

angular.module('accessimapEditeurDerApp').run(['$templateCache', function($templateCache) {

  $templateCache.put('scripts/views/edit/aside.html', '<div class="col-xs-12"><div ng-if="$ctrl.isParametersVisible" ng-include="\'scripts/views/edit/aside_parameters.html\'"></div><div ng-if="$ctrl.isMapParametersVisible" class="btn-group pull-left" ng-include="\'scripts/views/edit/aside_map_parameters.html\'"></div><div ng-if="$ctrl.isDrawingParametersVisible" ng-include="\'scripts/views/edit/aside_drawing_parameters.html\'"></div><div ng-if="$ctrl.isLegendParametersVisible" ng-include="\'scripts/views/edit/aside_legend_parameters.html\'"></div><div ng-if="$ctrl.isInteractionParametersVisible" ng-include="\'scripts/views/edit/aside_interaction_parameters.html\'"></div><div ng-if="$ctrl.isBackgroundParametersVisible" ng-include="\'scripts/views/edit/aside_background_parameters.html\'"></div></div>');

  $templateCache.put('scripts/views/edit/aside_background_parameters.html', '<h3><button class="btn btn-link" ng-click="$ctrl.displayParameters()"><span class="fa fa-lg fa-arrow-left" aria-hidden="true"></span></button> <span class="fa fa-lg fa-picture-o" aria-hidden="true"></span> Trame de fond</h3><form class="row"><div class="form-group col-xs-12"><label>Trame de fond</label><ui-select ng-model="$ctrl.backgroundStyle" ng-change="$ctrl.updateBackgroundStyle($ctrl.backgroundStyle)" ng-disabled="disabled" theme="bootstrap" class="form-control style-selector"><ui-select-match placeholder="Sélectionnez un style">{{$select.selected.name}}</ui-select-match><ui-select-choices repeat="item in $ctrl.backgroundStyleChoices | filter: $select.search"><span ng-bind-html="item.name | highlight: $select.search"></span> <span ng-bind-html="$ctrl.featureIcon(item, \'polygon\')"></span></ui-select-choices></ui-select></div><div class="form-group col-xs-12"><label>Couleur de fond</label><ui-select ng-model="$ctrl.backgroundColor" ng-change="$ctrl.updateBackgroundColor($ctrl.backgroundColor)" theme="bootstrap" class="form-control style-selector"><ui-select-match placeholder="Sélectionnez une couleur de fond">{{$ctrl.backgroundColor.name}}</ui-select-match><ui-select-choices repeat="item in $ctrl.colors"><div ng-bind-html="item.name | highlight: $select.search"></div></ui-select-choices></ui-select></div><div class="form-group col-xs-12"><label>Importer un fond (SVG/JPG/PNG/PDF)</label><input onchange="angular.element(this).scope().$ctrl.uploadFile(this)" type="file" accept="image/svg+xml,image/png,image/jpeg,application/pdf"></div><div class="form-group col-xs-12"><label>Choisir un fond de carte prédéfini</label><uib-accordion close-others="false"><uib-accordion-group heading="{{mapCategory.name}}" is-open="status.isFirstOpen" is-disabled="status.isFirstDisabled" ng-repeat="mapCategory in $ctrl.mapCategories"><ul class="row"><li ng-repeat="image in mapCategory.images"><img class="img-responsive" ng-src="{{image.path}}" ng-click="$ctrl.appendSvg(image.path)"></li></ul></uib-accordion-group></uib-accordion></div></form>');

  $templateCache.put('scripts/views/edit/aside_drawing_parameters.html', '<h3><button class="btn btn-link" ng-click="$ctrl.displayParameters()"><span class="fa fa-lg fa-arrow-left" aria-hidden="true"></span></button> <span class="fa fa-pencil" aria-hidden="true"></span> Dessin</h3><div class="btn-group"><a ng-click="$ctrl.enableDrawingMode(\'default\')" ng-class="{ \'active\' : $ctrl.mode == \'default\' }" class="btn btn-default active"><span class="fa fa-hand-paper-o" aria-hidden="true"></span> Consulter</a> <a ng-click="$ctrl.enableDrawingMode(\'undo\')" ng-class="{ \'active\' : $ctrl.mode == \'undo\', \'disabled\' : !$ctrl.isUndoAvailable() }" class="btn btn-default"><span class="fa fa-undo" aria-hidden="true"></span> Annuler</a></div><div class="btn-group"><a ng-click="$ctrl.enableDrawingMode(\'point\')" ng-class="{ \'active\' : $ctrl.mode == \'point\' }" class="btn btn-default"><span class="fa fa-map-marker" aria-hidden="true"></span> Point</a> <a ng-click="$ctrl.enableDrawingMode(\'line\')" ng-class="{ \'active\' : $ctrl.mode == \'line\' }" class="btn btn-default"><span class="fa fa-pencil" aria-hidden="true"></span> Ligne</a> <a ng-click="$ctrl.enableDrawingMode(\'circle\')" ng-class="{ \'active\' : $ctrl.mode == \'circle\' }" class="btn btn-default"><span class="fa fa-pencil" aria-hidden="true"></span> Cercle</a> <a ng-click="$ctrl.enableDrawingMode(\'polygon\')" ng-class="{ \'active\' : $ctrl.mode == \'polygon\' }" class="btn btn-default"><span class="fa fa-pencil" aria-hidden="true"></span> Polygone</a> <a ng-click="$ctrl.enableDrawingMode(\'addtext\')" ng-class="{ \'active\' : $ctrl.mode == \'addtext\' }" class="btn btn-default"><span class="fa fa-font" aria-hidden="true"></span> Texte</a></div><div class="btn-group"><a ng-click="$ctrl.centerView()" class="btn btn-default"><span class="fa fa-arrows-alt" aria-hidden="true"></span> Recentrer</a></div><form><p ng-if="$ctrl.mode !== \'point\' && $ctrl.mode !== \'line\' && $ctrl.mode !== \'polygon\' && $ctrl.mode !== \'circle\'">Choisissez un outil de dessin pour paramétrer le style, la couleur, ...</p><div class="form-group" ng-if="$ctrl.mode === \'point\' || $ctrl.mode === \'line\' || $ctrl.mode === \'polygon\' || $ctrl.mode === \'circle\'"><label>Style</label><ui-select ng-model="$ctrl.styleChosen" ng-change="$ctrl.updatePolygonStyle()" ng-disabled="disabled" theme="bootstrap" class="form-control style-selector"><ui-select-match placeholder="Sélectionnez un style">{{$select.selected.name}}</ui-select-match><ui-select-choices repeat="item in $ctrl.styleChoices | filter: $select.search"><div ng-bind-html="item.name | highlight: $select.search"></div><div ng-bind-html="$ctrl.featureIcon(item, $ctrl.mode)"></div></ui-select-choices></ui-select></div><div class="form-group" ng-if="$ctrl.mode === \'polygon\' || $ctrl.mode === \'circle\'"><label>Couleur de fond</label><ui-select ng-model="$ctrl.colorChosen" ng-change="$ctrl.changeColor()" ng-disabled="disabled" theme="bootstrap" class="form-control style-selector"><ui-select-match placeholder="Couleur de fond">{{$select.selected.name}}</ui-select-match><ui-select-choices repeat="item in $ctrl.colors | filter: $select.search" style="max-height: 500px;"><span style="display:inline-block;" ng-bind-html="item.name | highlight: $select.search"></span></ui-select-choices></ui-select></div><div class="form-group" ng-if="$ctrl.mode === \'polygon\' || $ctrl.mode === \'circle\'"><label>Contour de forme</label> <span class="input-group-addon"><input type="checkbox" ng-model="$ctrl.checkboxModel.contour" ng-change="$ctrl.updatePolygonStyle()"></span></div><div class="form-group" ng-if="$ctrl.mode === \'addtext\'"><label>Police</label><ui-select ng-model="$ctrl.fontChosen" ng-change="$ctrl.changeTextColor()" theme="bootstrap" class="form-control style-selector"><ui-select-match placeholder="Sélectionnez une police">{{$select.selected.name}}</ui-select-match><ui-select-choices repeat="item in $ctrl.fonts | filter: $select.search"><div ng-bind-html="item.name | highlight: $select.search"></div></ui-select-choices></ui-select></div><div class="form-group" ng-if="$ctrl.mode === \'addtext\'"><label>Couleur</label><ui-select ng-model="$ctrl.fontColorChosen" theme="bootstrap" class="form-control style-selector"><ui-select-match placeholder="Sélectionnez une couleur">{{$select.selected.name}}</ui-select-match><ui-select-choices repeat="item in $ctrl.fontColors[$ctrl.fontChosen.color] | filter: $select.search"><div ng-bind-html="item.name | highlight: $select.search"></div></ui-select-choices></ui-select></div></form>');

  $templateCache.put('scripts/views/edit/aside_interaction_parameters.html', '<h3><button class="btn btn-link" ng-click="$ctrl.displayParameters()"><span class="fa fa-lg fa-arrow-left" aria-hidden="true"></span></button> <span class="fa fa-hand-pointer-o" aria-hidden="true"></span> Interaction</h3><form class="row"><uib-tabset active="active"><uib-tab heading="Filtres"><uib-accordion close-others="false" class="col-xs-12" ng-if="$ctrl.interactions.getFilters().length > 0"><uib-accordion-group heading="{{filter.name}}" ng-repeat="filter in $ctrl.interactions.getFilters() track by filter.id"><table class="table table-hover"><tbody><tr><th>Nom</th><td><input type="text" ng-model="filter.name"></td></tr><tr><th>Type</th><td><select ng-model="filter.gesture"><option value="tap">tap</option><option value="double_tap">double_tap</option></select></td></tr><tr><th>Protocole</th><td><select ng-model="filter.protocol"><option>tts</option><option>mp3</option></select></td></tr></tbody></table><button class="btn btn-danger btn-block" ng-click="$ctrl.interactions.removeCategory(filter.id)">Supprimer filtre</button><table class="table table-hover" ng-if="$ctrl.interactions.getInteractions().length > 0"><thead><tr><th>Point</th><th>Valeur</th></tr></thead><tbody><tr ng-repeat="interaction in $ctrl.interactions.getInteractions()"><td>{{interaction.id}}</td><td><input type="text" ng-model="interaction.filters[filter.id]" ng-if="filter.protocol===\'tts\'" style="width:100%"> <input type="file" ng-model="interaction.filters[filter.id]" ng-if="filter.protocol===\'mp3\'" style="width:100%"></td></tr></tbody></table></uib-accordion-group><uib-accordion-group panel-class="panel-primary"><uib-accordion-heading>Créer un nouveau filtre</uib-accordion-heading><table class="table table-hover"><tbody><tr><th>Nom</th><td><input type="text" ng-model="name"></td></tr><tr><th>Type</th><td><select ng-model="gesture"><option value="tap">tap</option><option value="double_tap">double_tap</option></select></td></tr><tr><th>Protocole</th><td><select ng-model="protocol"><option>tts</option><option>mp3</option></select></td></tr></tbody></table><button class="btn btn-primary btn-block" ng-click="$ctrl.interactions.addFilter(name, gesture, protocol)"><span class="fa fa-plus"></span> Créer filtre</button></uib-accordion-group></uib-accordion></uib-tab><uib-tab heading="Interactions"><div ng-if="$ctrl.interactions.getInteractions().length === 0" class="col-xs-12">Pas encore d\'interaction définie !</div><uib-accordion close-others="false" class="col-xs-12" ng-if="$ctrl.interactions.getInteractions().length > 0"><uib-accordion-group heading="{{interaction.id}}" ng-repeat="interaction in $ctrl.interactions.getInteractions() track by interaction.id"><table class="table table-hover"><thead><tr><th>Filtres</th><th>Valeur</th></tr></thead><tbody><tr ng-repeat="filter in $ctrl.interactions.getFilters()"><td>{{filter.name}}</td><td><input type="text" ng-model="interaction.filters[filter.id]" ng-if="filter.protocol===\'tts\'" style="width:100%"> <input type="file" ng-model="interaction.filters[filter.id]" ng-if="filter.protocol===\'mp3\'" style="width:100%"></td></tr></tbody></table></uib-accordion-group></uib-accordion></uib-tab></uib-tabset></form><div ng-if="$ctrl.isAddressVisible" ng-include="\'scripts/views/edit/aside_map_address.html\'"></div>');

  $templateCache.put('scripts/views/edit/aside_legend_parameters.html', '<h3><button class="btn btn-link" ng-click="$ctrl.displayParameters()"><span class="fa fa-lg fa-arrow-left" aria-hidden="true"></span></button> <span class="fa fa-braille" aria-hidden="true"></span> Légende</h3><form class="row"><div class="form-group col-md-12"><label>Afficher en braille</label><br><div class="btn-group"><button class="btn btn-default" ng-class="{ \'active\' : $ctrl.isBrailleDisplayed }" ng-click="$ctrl.showFontBraille()">Oui</button><button class="btn btn-default" ng-class="{ \'active\' : ! $ctrl.isBrailleDisplayed }" ng-click="$ctrl.hideFontBraille()">Non</button></div></div><div class="form-group col-lg-6"><label>Format de la légende</label><select ng-model="$ctrl.model.legendFormat" ng-change="$ctrl.changeLegendFormat($ctrl.model.legendFormat)" class="form-control" ng-options="format as data.name for (format, data) in $ctrl.formats"></select></div></form>');

  $templateCache.put('scripts/views/edit/aside_map_address.html', '<h4><span class="fa fa-search" aria-hidden="true"></span> Chercher une adresse</h4><form><div class="input-group"><span class="input-group-addon"><span class="fa fa-lg fa-map-marker" aria-hidden="true"></span></span> <input ng-model="$ctrl.address.start" type="text" class="form-control" id="startAddress" placeholder="Adresse de départ (ex : 37 rue Monplaisir, Toulouse)"> <input ng-model="$ctrl.address.stop" type="text" class="form-control" id="stopAddress" placeholder="Adresse d\'arrivée"></div><button class="btn btn-primary btn-block" ng-click="$ctrl.searchAddress()"><span class="fa fa-map-marker" aria-hidden="true"></span> Positionner</button></form>');

  $templateCache.put('scripts/views/edit/aside_map_feature_creation.html', '<h4><span class="fa fa-cloud-download" aria-hidden="true"></span> Obtenir des données d\'OSM</h4><form><div class="form-group"><label>Type de POI</label><ui-select ng-model="$ctrl.queryChosen" ng-disabled="$ctrl.disabled" theme="bootstrap" ng-change="$ctrl.changeStyle()" class="form-control style-selector"><ui-select-match placeholder="Sélectionnez un élément">{{$select.selected.name}}</ui-select-match><ui-select-choices repeat="item in $ctrl.queryChoices | filter: $select.search | layerNotSelected:this.geojson | orderBy:[\'icon\',\'type\']"><i class="icon-15px fa fa-{{item.icon}}"></i> <i ng-if="item.type === \'point\'" class="icon-15px fa fa-map-marker"></i> <i ng-if="item.type === \'line\'" class="icon-15px fa fa-minus"></i> <i ng-if="item.type === \'polygon\'" class="icon-15px fa fa-square-o"></i> <span ng-bind-html="item.name | highlight: $select.search"></span></ui-select-choices></ui-select></div><div class="form-group"><label>Style</label><ui-select ng-model="$ctrl.styleChosen" ng-disabled="$ctrl.disabled" theme="bootstrap" class="form-control style-selector"><ui-select-match placeholder="Sélectionnez un style">{{$select.selected.name}}</ui-select-match><ui-select-choices repeat="item in $ctrl.styleChoices | filter: $select.search" style="max-height: 500px;"><span style="display:inline-block;" ng-bind-html="item.name | highlight: $select.search"></span> <span style="max-height:30px;display:inline-block;" ng-bind-html="$ctrl.featureIcon(item, $ctrl.queryChosen.type)"></span></ui-select-choices></ui-select></div><div class="form-group" ng-if="$ctrl.queryChosen.type === \'polygon\'"><label>Couleur</label><ui-select ng-model="$ctrl.colorChosen" ng-disabled="$ctrl.disabled" theme="bootstrap" class="form-control style-selector"><ui-select-match placeholder="Couleur de fond">{{$select.selected.name}}</ui-select-match><ui-select-choices repeat="item in $ctrl.colors | filter: $select.search" style="max-height: 500px;"><span style="display:inline-block;" ng-bind-html="item.name | highlight: $select.search"></span></ui-select-choices></ui-select></div><div class="form-group" ng-if="$ctrl.queryChosen.type === \'polygon\'"><span class="input-group-addon">Contour de forme <input type="checkbox" ng-model="$ctrl.checkboxModel.contour"></span></div><button ng-if="$ctrl.queryChosen.id !== \'poi\'" class="btn btn-primary btn-block" ng-click="$ctrl.insertOSMData()" type="button"><span class="fa fa-cloud-download" aria-hidden="true"></span> Insérer les données d\'OSM</button></form>');

  $templateCache.put('scripts/views/edit/aside_map_feature_management.html', '<h4><span class="fa fa-list"></span> Listing des éléments</h4><p ng-if="!$ctrl.getFeatures() || $ctrl.getFeatures().length === 0">Pas encore d\'éléments !<br>Vous verrez ici les éléments que vous allez créer via les boutons d\'ajouts de POI, d\'adresse ou de données OSM !</p><uib-accordion close-others="true" ng-if="$ctrl.getFeatures() && $ctrl.getFeatures().length > 0"><uib-accordion-group heading="{{feature.name}}" is-open="status.isFirstOpen" is-disabled="status.isFirstDisabled" ng-repeat="feature in $ctrl.getFeatures()"><div class="form-group"><label>Style</label><ui-select ng-model="feature.style" ng-disabled="$ctrl.disabled" ng-change="$ctrl.updateFeature(feature.id, feature.style)" theme="bootstrap" class="form-control style-selector"><ui-select-match placeholder="Sélectionnez un style">{{$select.selected.name}}</ui-select-match><ui-select-choices repeat="item in feature.styleChoices | filter: $select.search" style="max-height: 500px;"><span style="display:inline-block;" ng-bind-html="item.name | highlight: $select.search"></span> <span style="max-height:30px;display:inline-block;" ng-bind-html="$ctrl.featureIcon(item, feature.type)"></span></ui-select-choices></ui-select></div><div class="form-group" ng-if="feature.type === \'point\'"><label>Rotation</label><div class="input-group"><span class="input-group-addon"><span class="fa fa-repeat" aria-hidden="true"></span></span><slider class="form-control slider-container" ng-model="feature.rotation" ng-change="$ctrl.rotateFeature(feature)" min="0" max="360"></slider></div></div><div class="form-group" ng-if="feature.type === \'polygon\'"><label>Couleur</label><ui-select ng-model="feature.color" ng-change="$ctrl.updateFeature(feature.id, feature.style)" ng-disabled="$ctrl.disabled" theme="bootstrap" class="form-control style-selector"><ui-select-match placeholder="Couleur de fond">{{$select.selected.name}}</ui-select-match><ui-select-choices repeat="item in $ctrl.colors | filter: $select.search" style="max-height: 500px;"><span style="display:inline-block;" ng-bind-html="item.name | highlight: $select.search"></span></ui-select-choices></ui-select></div><div class="form-group" ng-if="feature.type === \'polygon\'"><span class="input-group-addon">Contour de forme <input type="checkbox" ng-model="feature.contour" ng-change="$ctrl.updateFeature(feature.id, feature.style)"></span></div><button class="btn btn-danger btn-block" type="button" ng-click="$ctrl.removeFeature(feature.id)"><span class="glyphicon glyphicon-remove-circle" aria-hidden="true"></span> Supprimer</button></uib-accordion-group></uib-accordion>');

  $templateCache.put('scripts/views/edit/aside_map_parameters.html', '<h3><button class="btn btn-link" ng-click="$ctrl.displayParameters()"><span class="fa fa-lg fa-arrow-left" aria-hidden="true"></span></button> <span class="fa fa-map" aria-hidden="true"></span> Carte</h3><form class="row"><div class="form-group col-md-12"><label>Afficher la carte</label><br><div class="btn-group"><button class="btn btn-default" ng-class="{ \'active\' : $ctrl.model.isMapVisible }" ng-click="$ctrl.showMap()">Oui</button><button class="btn btn-default" ng-class="{ \'active\' : ! $ctrl.model.isMapVisible }" ng-click="$ctrl.hideMap()">Non</button></div></div><div class="form-group col-xs-12"><label>Rotation</label><div class="input-group"><span class="input-group-addon"><span class="fa fa-repeat" aria-hidden="true"></span></span><slider class="form-control slider-container" ng-model="$ctrl.rotationAngle" ng-change="$ctrl.rotateMap($ctrl.rotationAngle)" ng-disabled="! $ctrl.isMapVisible" min="0" max="360"></slider></div></div><div class="form-group col-md-6 text-center"><button class="btn btn-primary btn-tile" ng-class="{ \'active\' : $ctrl.isPoiCreationVisible }" ng-click="$ctrl.displayAddPOIForm()"><span class="fa fa-plus-circle" aria-hidden="true"></span><br>POI</button></div><div class="form-group col-md-6 text-center"><button class="btn btn-primary btn-tile" ng-class="{ \'active\' : $ctrl.isAddressVisible }" ng-click="$ctrl.displaySearchAddressForm()"><span class="fa fa-search" aria-hidden="true"></span><br>Adresses</button></div><div class="form-group col-md-6 text-center"><button class="btn btn-primary btn-tile" ng-class="{ \'active\' : $ctrl.isFeatureCreationVisible }" ng-click="$ctrl.displayGetDataFromOSMForm()"><span class="fa fa-cloud-download" aria-hidden="true"></span><br>Data OSM</button></div><div class="form-group col-md-6 text-center"><button class="btn btn-default btn-tile" ng-class="{ \'active\' : $ctrl.isFeatureManagementVisible }" ng-click="$ctrl.displayFeatureManagement()"><span class="fa fa-list" aria-hidden="true"></span><br>Listing</button></div></form><div ng-if="$ctrl.isAddressVisible" ng-include="\'scripts/views/edit/aside_map_address.html\'"></div><div ng-if="$ctrl.isPoiCreationVisible" ng-include="\'scripts/views/edit/aside_map_poi_creation.html\'"></div><div ng-if="$ctrl.isFeatureCreationVisible" ng-include="\'scripts/views/edit/aside_map_feature_creation.html\'"></div><div ng-if="$ctrl.isFeatureManagementVisible" ng-include="\'scripts/views/edit/aside_map_feature_management.html\'"></div>');

  $templateCache.put('scripts/views/edit/aside_map_poi_creation.html', '<h4><span class="fa fa-plus-circle" aria-hidden="true"></span> Ajouter POI</h4><form><div class="form-group"><label>Style</label><ui-select ng-model="$ctrl.styleChosen" ng-disabled="$ctrl.disabled" theme="bootstrap" class="form-control style-selector"><ui-select-match placeholder="Sélectionnez un style">{{$select.selected.name}}</ui-select-match><ui-select-choices repeat="item in $ctrl.styleChoices | filter: $select.search" style="max-height: 500px;"><span style="display:inline-block;" ng-bind-html="item.name | highlight: $select.search"></span> <span style="max-height:30px" ng-bind-html="$ctrl.featureIcon(item, $ctrl.queryChosen.type)"></span></ui-select-choices></ui-select></div></form>');

  $templateCache.put('scripts/views/edit/aside_parameters.html', '<h3><span class="fa fa-home" aria-hidden="true"></span> Menu principal</h3><form class="row"><div class="form-group col-xs-12"><label>Titre</label> <input type="text" ng-model="$ctrl.model.title" class="form-control input-lg"></div><div class="form-group col-xs-12"><label>Trame de fond</label> <button class="btn btn-primary btn-block" ng-click="$ctrl.displayBackgroundParameters()"><span class="fa fa-lg fa-picture-o" aria-hidden="true"></span> Configurer le fond&nbsp;</button></div><div class="form-group col-xs-12"><label>Format du dessin</label><select ng-model="$ctrl.model.mapFormat" ng-change="$ctrl.changeDrawingFormat($ctrl.model.mapFormat)" class="form-control" ng-options="format as data.name for (format, data) in $ctrl.formats"></select></div><div class="form-group col-xs-12"><label>Edition</label></div><div class="form-group col-md-6 text-center"><button class="btn btn-primary btn-tile" ng-click="$ctrl.displayDrawingParameters()"><span class="fa fa-lg fa-pencil" aria-hidden="true"></span><br>Dessin</button></div><div class="form-group col-md-6 text-center"><button class="btn btn-primary btn-tile" ng-click="$ctrl.displayMapParameters()"><span class="fa fa-lg fa-map-o" aria-hidden="true"></span><br>Carte</button></div><div class="form-group col-md-6 text-center"><button class="btn btn-primary btn-tile" ng-click="$ctrl.displayLegendParameters()"><span class="fa fa-lg fa-braille" aria-hidden="true"></span><br>Légende</button></div><div class="form-group col-md-6 text-center"><button class="btn btn-primary btn-tile" ng-click="$ctrl.displayInteractionParameters()"><span class="fa fa-lg fa-hand-pointer-o" aria-hidden="true"></span><br>Interaction</button></div><div class="form-group col-md-6 text-center"><button class="btn btn-default btn-tile" ng-click="$ctrl.centerView()"><span class="fa fa-arrows-alt" aria-hidden="true"></span><br>Recentrer</button></div><div class="form-group col-xs-12"><label>Commentaires de transcription</label> <textarea class="form-control" ng-model="$ctrl.model.comment" rows="10" style="resize:none" id="comment">\n        </textarea></div><div class="form-group col-xs-12"><label>Importer un DER (svg/zip)</label> <input onchange="angular.element(this).scope().$ctrl.importDER(this)" type="file" accept="image/svg+xml,application/zip" name="Importer"></div><div class="form-group col-xs-12"><label>Exporter</label> <button class="btn btn-success btn-block text-center" ng-click="$ctrl.exportData()" type="button"><span class="fa fa-lg fa-download" aria-hidden="true"></span> Exporter</button></div></form>');

  $templateCache.put('scripts/views/edit/modalchangearrows.html', '<div class="modal fade" id="changeArrowsModal" tabindex="-1" role="dialog"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title">Choisissez les extrémités de cette ligne</h4></div><div class="modal-body">Extrémité de départ<ui-select ng-model="$ctrl.markerStart" ng-change="$ctrl.updateMarker($ctrl.markerStart, $ctrl.markerStop)" ng-disabled="disabled" theme="bootstrap" class="form-control style-selector" style="width: 300px;"><ui-select-match placeholder="Sélectionnez un style">{{$select.selected.name}}</ui-select-match><ui-select-choices repeat="item in $ctrl.markerStartChoices | filter: $select.search"><div ng-bind-html="item.name | highlight: $select.search"></div></ui-select-choices></ui-select><br>Extrémité de fin<ui-select ng-model="$ctrl.markerStop" ng-change="$ctrl.updateMarker($ctrl.markerStart, $ctrl.markerStop)" ng-disabled="disabled" theme="bootstrap" class="form-control style-selector" style="width: 300px;"><ui-select-match placeholder="Sélectionnez un style">{{$select.selected.name}}</ui-select-match><ui-select-choices repeat="item in $ctrl.markerStopChoices | filter: $select.search"><div ng-bind-html="item.name | highlight: $select.search"></div></ui-select-choices></ui-select></div><div class="modal-footer"><button type="button" class="btn btn-primary" data-dismiss="modal">Fermer</button></div></div></div></div>');

  $templateCache.put('scripts/views/edit/modalchangecolor.html', '<div class="modal fade" id="changeColorModal" tabindex="-1" role="dialog"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title">Choisissez une couleur de fond pour cet objet</h4></div><div class="modal-body"><ui-select ng-model="$ctrl.colorChosen" ng-change="$ctrl.updateColor($ctrl.colorChosen)" ng-disabled="disabled" theme="bootstrap" class="form-control style-selector" style="width: 300px;"><ui-select-match placeholder="Couleur de fond">{{$select.selected.name}}</ui-select-match><ui-select-choices repeat="item in $ctrl.colors | filter: $select.search" style="max-height: 500px;"><span style="display:inline-block;" ng-bind-html="item.name | highlight: $select.search"></span></ui-select-choices></ui-select></div><div class="modal-footer"><button type="button" class="btn btn-primary" data-dismiss="modal">Fermer</button></div></div></div></div>');

  $templateCache.put('scripts/views/edit/modalchangepattern.html', '<div class="modal fade" id="changePatternModal" tabindex="-1" role="dialog"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button><h4 class="modal-title">Choisissez un motif pour cet objet</h4></div><div class="modal-body"><ui-select ng-model="$ctrl.styleChosen" ng-change="$ctrl.updateStyle($ctrl.styleChosen)" ng-disabled="disabled" theme="bootstrap" class="form-control style-selector" style="width: 300px;"><ui-select-match placeholder="Sélectionnez un style">{{$select.selected.name}}</ui-select-match><ui-select-choices repeat="item in $ctrl.styleChoices | filter: $select.search"><div ng-bind-html="item.name | highlight: $select.search"></div><div ng-bind-html="$ctrl.featureIcon(item, \'polygon\')"></div></ui-select-choices></ui-select></div><div class="modal-footer"><button type="button" class="btn btn-primary" data-dismiss="modal">Fermer</button></div></div></div></div>');

  $templateCache.put('scripts/views/edit/template.html', '<aside class="col-lg-3 col-md-4 col-sm-4 right-side"><div class="aside-content row" ng-include="\'scripts/views/edit/aside.html\'"></div></aside><main ng-init="$ctrl.init()"><div id="workspace" ng-show="$ctrl.isWorkspaceVisible"></div><div id="legend" ng-show="$ctrl.isLegendVisible"></div><div id="pattern"></div></main><div ng-include="\'scripts/views/edit/modalchangecolor.html\'"></div><div ng-include="\'scripts/views/edit/modalchangepattern.html\'"></div><div ng-include="\'scripts/views/edit/modalchangearrows.html\'"></div>');

  $templateCache.put('scripts/views/home/template.html', '<div class="container jumbotron"><h3>Ajoutez de l\'interaction à vos dessins en reliefs (DER)</h3><h3>Configurez et personnalisez facilement vos documents avant de les imprimer !</h3><br><form class="form-inline"><div class="form-group"><button type="button" class="btn btn-primary btn-lg btn-block" ng-click="$ctrl.goToEdit()">Créer un nouveau DER</button></div></form></div>');

}]);

})();