// jscs:disable maximumLineLength
/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.SettingsQuery
 * @description
 */
(function() {
    'use strict';

    function SettingsQuery () {

        var QUERY_LIST = [{
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
        }]

        this.QUERY_LIST    = QUERY_LIST;
        this.QUERY_DEFAULT = QUERY_LIST[4];
        this.QUERY_POI     = QUERY_LIST[0];


    }

    angular.module(moduleApp).service('SettingsQuery', SettingsQuery);

})();