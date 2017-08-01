/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.HistoryService
 * 
 * @description
 * Service exposing history functions to allow user to roll back
 */
(function() {
    'use strict';

    function HistoryService() {
        this.saveState = saveState;
        this.history = [];

        function saveState() {
            console.log('save state')
            this.history.push()
        }
    }
    
    angular.module(moduleApp)
        .service('HistoryService', HistoryService);

})();