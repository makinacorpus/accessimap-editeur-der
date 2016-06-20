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