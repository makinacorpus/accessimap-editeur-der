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