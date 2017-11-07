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
        this.openInteraction      = openInteraction;
        this.getInteraction       = getInteraction;
        this.setInteraction       = setInteraction;
        this.removeInteraction    = removeInteraction;
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
        interactions = {},

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
            name     : 'Défaut'
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
                featurePosition = interactions['poi-' + featureIid];


            return interactions.indexOf(featurePosition[0]) >= 0;
        }

        // function disableInteraction(feature) {

        //     var featureIid = feature.attr('data-link');

        //     if (isFeatureInteractive(feature)) {
        //         interactions = interactions.filter(function deleteFeature(current) {
        //             return current.id !== 'poi-' + featureIid;
        //         })
        //     }

        // }

        function removeInteraction(poiId, interactionIndex) {
            interactions[poiId].interactions.splice(interactionIndex, 1);
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
        function addInteraction(poiId, filterId) {
            // Add the highlight class to the relevant cells of the grid
            // TODO: this method DO NOT change CSS properties...
            // d3.selectAll('.poi-' + featureIid).classed('highlight', true);

            setInteraction(poiId, filterId);
        }

        function openInteraction(poiId) {
            if (!interactions['poi-' + poiId]) {
                addInteraction('poi-' + poiId, 'f1');
            }
        }

        function getInteraction(feature) {
            var featureIid = feature.attr('data-link');

            if(!featureIid) return null;

            return interactions['poi-' + featureIid];

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
        function setInteraction(id, filter) {
            if (!interactions[id]) {
                interactions[id] = {
                    'id': id,
                    'interactions': []
                };
            }

            interactions[id].interactions.push({
                filter: filter,
                value: '',
                gesture  : 'tap',
                protocol : 'tts'
            });
        }

        function addFilter(name, gesture, protocol, id) {
            filters.push({
                id       : id ? id : 'f' + generateUUID(),
                name     : name
            });
        }

        function removeFilter(id) {
            // first, delete for each interaction the corresponding filter
            // interactions.forEach(function deleteCategory(current) {
            //     delete current.filters[id]
            // })

            console.log(filters)
            // then remove the filter
            filters = filters.filter(function removeFilter(element, index) {
                return element.id !== id;
            })
        }

        function getXMLExport() {
            var translateX;
            var translateY;
            var xmlToExport = '<?xml version="1.0" encoding="UTF-8"?>\n';

            if (filters.length > 0) {

                var nodeXML = d3.select(document.createElement('exportXML')),
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
                        translateX = 0;
                        translateY = 0;

                        // get the bounding box of the current POI,
                        // no matter if it is a drawing or a geojson feature
                        // > no selection of a specific svg, we search in the entire DOM
                        var bbox, poi;
                        d3.selectAll('path')[0]
                            .forEach(function(shape) {
                                if ('poi-' + d3.select(shape).attr('data-link') === d.id) {
                                  if (d3.select(shape).attr("transform")) {
                                    translateX=parseFloat(d3.select(shape).attr("transform").replace('translate(', '').replace(')', '').split(",")[0]);
                                    translateY=parseFloat(d3.select(shape).attr("transform").replace('translate(', '').replace(')', '').split(",")[1]);
                                  }
                           
                                  bbox = d3.select(shape).node().getBBox();
                                }
                            });

                        poi = d3.select(this).attr('id', d.id);
                        if (bbox) {
                            poi.attr('x', bbox.x + translateX);
                            poi.attr('y', bbox.y + translateY);
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

                xmlToExport += (new XMLSerializer()).serializeToString(config.node());

            }

            return xmlToExport;
        }

        function generateUUID() {
            var d = new Date().getTime();

            if(window.performance && typeof window.performance.now === "function") {
                d += performance.now(); //use high-precision timer if available
            }

            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = (d + Math.random()*16)%16 | 0;
                d = Math.floor(d/16);

                return (c=='x' ? r : (r&0x3|0x8)).toString(16);
            });

            return uuid;
        }
    }

    angular.module(moduleApp).service('InteractionService', InteractionService);

    InteractionService.$inject = ['UtilService'];

})();
