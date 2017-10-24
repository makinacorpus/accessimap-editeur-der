/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.EditPropertiesService
 *
 * @description
 * Provide function to edit properties of a feature
 * - coordinates
 * - transformations (translate, scale, rotation, ...)
 * - drawing properties (radius, width, height)
 *
 */
(function() {
    'use strict';

    function EditPropertiesService() {

        this.getProperties = getProperties;
        this.setProperties = setProperties;

        var properties = [
            {
                name: 'x',
                type: 'rect',
                visible: true,
                isStyle: false,
                isColor: false
            },
            {
                name: 'y',
                type: 'rect',
                visible: true,
                isStyle: false,
                isColor: false
            },
            {
                name: 'cx',
                type: 'circle',
                visible: true,
                isStyle: false,
                isColor: false
            },
            {
                name: 'cy',
                type: 'circle',
                visible: true,
                isStyle: false,
                isColor: false
            },
            {
                name: 'data-type',
                type: 'all',
                visible: false,
                isStyle: false,
                isColor: false
            },
            {
                name: 'data-link',
                type: 'all',
                visible: false,
                isStyle: false,
                isColor: false
            },
            {
                name: 'style',
                type: 'all',
                visible: false,
                isStyle: false,
                isColor: false
            },
            {
                name: 'stroke',
                type: 'all',
                visible: true,
                isStyle: false,
                isColor: false
            },
            {
                name: 'stroke-width',
                type: 'all',
                visible: true,
                isStyle: false,
                isColor: false
            },
            {
                name: 'rx',
                type: 'circle',
                visible: true,
                isStyle: false,
                isColor: false
            },
            {
                name: 'ry',
                type: 'circle',
                visible: true,
                isStyle: false,
                isColor: false
            },
            {
                name: 'r',
                type: 'circle',
                visible: false,
                isStyle: false,
                isColor: false
            },
            {
                name: 'e-style',
                type: 'all',
                visible: false,
                isStyle: true,
                isColor: false
            },
            {
                name: 'e-color',
                type: 'all',
                visible: false,
                isStyle: false,
                isColor: true
            }
        ]

        this.properties    = properties;

        function getProperties(feature) {
            var featureProperties = {};

            properties.map(function(currentProperty) {
                featureProperties[currentProperty.name] = feature.attr(currentProperty.name);
            })

            return featureProperties;

        }

        function setProperties(feature, featureProperties) {
            properties.map(function(currentProperty) {
                feature.attr(currentProperty.name, featureProperties[currentProperty.name]);
            })

            return featureProperties;

        }

    }

    angular.module(moduleApp).service('EditPropertiesService', EditPropertiesService);

})();
