/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.ToasterService
 * @description
 * Service providing functions to display messages to the user.
 *
 * Use toastr, but could be another library in the future without breaking the code.
 * 
 */
(function() {
    'use strict';

    function ToasterService() {

        this.error   = error;
        this.success = success;
        this.warning = warning;
        this.info    = info;
        this.remove  = remove;

        /**
         * @ngdoc method
         * @name  error
         * @methodOf accessimapEditeurDerApp.ToasterService
         *
         * @description
         * Display an error message to the user, alias of toastr.error
         *
         * @param  {Error} error
         * Error raised or throwned by the system.
         * 
         * @param  {Object} options
         * Options passed to toastr

         */
        function error(error, options) {
            toastr.error(error, options)
        }

        /**
         * @ngdoc method
         * @name  info
         * @methodOf accessimapEditeurDerApp.ToasterService
         *
         * @description
         * Display an info to the user, alias of toastr.info
         *
         * @param  {string} message
         * Message to be displayed
         * 
         * @param  {Object} options
         * Options passed to toastr
         * 
         */
        function info(message, options) {
            toastr.info(message, options)
        }

        /**
         * @ngdoc method
         * @name  success
         * @methodOf accessimapEditeurDerApp.ToasterService
         *
         * @description
         * Display a success to the user, alias of toastr.success
         *
         * @param  {string} message
         * Message to be displayed
         * 
         * @param  {Object} options
         * Options passed to toastr
         * 
         */
        function success(message, options) {
            toastr.success(message, options)
        }

        /**
         * @ngdoc method
         * @name  warning
         * @methodOf accessimapEditeurDerApp.ToasterService
         *
         * @description
         * Display a warning to the user, alias of toastr.warning
         *
         * @param  {string} message
         * Message to be displayed
         * 
         * @param  {Object} options
         * Options passed to toastr
         * 
         */
        function warning(message, options) {
            toastr.warning(message, options)
        }

        /**
         * @ngdoc method
         * @name  remove
         * @methodOf accessimapEditeurDerApp.ToasterService
         *
         * @description
         * Remove the current toastr without animations, alias of toastr.remove
         *
         */
        function remove() {
            toastr.remove()
        }

    }

    angular.module(moduleApp).service('ToasterService', ToasterService);

    ToasterService.$inject = [];

})();