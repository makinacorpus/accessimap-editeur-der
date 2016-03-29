/**
 * @ngdoc controller
 * @name accessimapEditeurDerApp.controller:MainCtrl
 * @requires accessimapEditeurDerApp.MainService
 * @description
 * # MainCtrl
 * Controller of the accessimapEditeurDerApp
 */
function MainCtrl($scope, $rootScope, $location, MainService) {

    var $ctrl = this;
    
    $ctrl.mapFormat        = 'landscapeA4';
    $ctrl.legendFormat     = 'landscapeA4';
    $ctrl.formats          = MainService.settings.FORMATS;
    
    $ctrl.goToBlankPage    = goToBlankPage;
    $ctrl.goToLocalMap     = goToLocalMap;
    $ctrl.goToExistingFile = goToExistingFile;

    $rootScope.iid = 1;
    $rootScope.getiid = function() {
        return $rootScope.iid++;
    };

    /**
     * @ngdoc method
     * @name  go
     * @methodOf accessimapEditeurDerApp.controller:MainCtrl
     * @description
     * Go to a specific path, by adding two parameters :
     * - mapFormat
     * - legendFormat
     */
    function go(path) {
        $location
            .path(path)
            .search('mapFormat', $ctrl.mapFormat)
            .search('legendFormat', $ctrl.legendFormat);
    };

    /**
     * @ngdoc method
     * @name  goToBlankPage
     * @methodOf accessimapEditeurDerApp.controller:MainCtrl
     * @description
     * Go to '/commonmap' path,
     * by creating a blank svg & adding two parameters :
     * - mapFormat
     * - legendFormat
     */
    function goToBlankPage() {
        MainService.createBlankSvg($ctrl.mapFormat, $ctrl.legendFormat)
            .then(function() {
                go('/commonmap');
            })
    }

    /**
     * @ngdoc method
     * @name  goToLocalMap
     * @methodOf accessimapEditeurDerApp.controller:MainCtrl
     * @description
     * Go to '/localmap' path, by adding two parameters
     * - mapFormat
     * - legendFormat
     */
    function goToLocalMap() {
        go('/localmap');
    }

    /**
     * @ngdoc method
     * @name  goToExistingFile
     * @methodOf accessimapEditeurDerApp.controller:MainCtrl
     * @description
     * Go to '/globalmap' path, by adding two parameters
     * - mapFormat
     * - legendFormat
     */
    function goToExistingFile() {
        go('/globalmap');
    }
}

angular.module('accessimapEditeurDerApp')
       .controller('MainCtrl', MainCtrl);

MainCtrl.$inject = ['$scope', '$rootScope', '$location', 'MainService'];
