/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.radialMenu
 * @description
 * # radialMenu
 * Service in the accessimapEditeurDerApp.
 */
(function() {
    'use strict';

    function radialMenu(settings, typeOfFeature, reset) {

        this.drawMenu = drawMenu;
        this.addRadialMenu = addRadialMenu;
        this.hideRadialMenu = hideRadialMenu;

        var menu = null;

        function drawMenu(target, mousePosition, scope) {

            target.classed('blink', true);
            var type = typeOfFeature.getType(target);

            if (type) {
                scope.styleChoices = settings.STYLES[type];
                var data = settings.ACTIONS[type],
                    mapLayer = d3.select('#der').select('svg'),

                    m = new d3.radialMenu().radius(50)
                    .thickness(50)
                    .animationDuration(100)
                    .iconSize(40)
                    .translation(mousePosition[0] + ' ' + mousePosition[1])
                    .onClick(function(d) {
                        var action = d.data.action;
                        action(target, scope);
                        menu.hide();
                        menu = null;
                    })
                    .appendTo(mapLayer.node())
                    .show(data);

                return m;
            }
        }

        /**
         * @ngdoc method
         * @name  addRadialMenu
         * @methodOf accessimapEditeurDerApp.radialMenu
         * @param {Object} ctrl Controller instance... (BAD !)
         * @param {Object} el   DOM Elements on which the event 'contextmenu'
         *                      (right click) will be attached
         */
        function addRadialMenu(ctrl, el) {
            var that = this;
            el.on('contextmenu', function() {

                // TODO: FIX, we mustn't act on the controller...
                ctrl.enableEditionMode('default'); 
                ctrl.updateView();

                d3.event.preventDefault();
                d3.event.stopPropagation();

                if (menu) {
                    menu.hide();
                }

                menu = that.drawMenu(
                            d3.select(this), 
                            d3.mouse(d3.select('#der').select('svg').node()),
                            ctrl);
            });
        }

        /**
         * @ngdoc method
         * @name  hideRadialMenu
         * @methodOf accessimapEditeurDerApp.radialMenu
         * Remove the menu if exists
         */
        function hideRadialMenu() {
            if (menu) {
                menu.hide();
                menu = null
            }
        }

    }

    angular.module('accessimapEditeurDerApp')
        .service('radialMenu', radialMenu);

    radialMenu.$inject = ['settings', 'typeOfFeature', 'reset'];

})();