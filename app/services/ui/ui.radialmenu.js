/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.RadialMenuService
 *
 * @description
 * Service providing functions to draw a radial menu on a specific feature
 */
(function() {
    'use strict';

    function RadialMenuService(SettingsActions, MapService) {

        this.drawMenu       = drawMenu;
        this.addRadialMenu  = addRadialMenu;
        this.hideRadialMenu = hideRadialMenu;

        this.init = init;

        var menu = null,
            svg,
            getCurrentZoom,
            currentTarget,
            draw;

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
        function drawMenu(target, mousePosition, svg) {

            currentTarget = target;

            var type = target.attr('data-type') ? target.attr('data-type') : 'default' ,
                overlay = document.querySelector('svg[data-name="overlay"]');

            if (type) {
                var data = SettingsActions.ACTIONS[type],

                    m = new d3.radialMenu()
                    .radius(50)
                    .thickness(60)
                    .animationDuration(100)
                    .iconSize(40)
                    .translation(mousePosition[0] + ' ' + mousePosition[1])
                    .onClick(function(d) {

                        d3.event.preventDefault();
                        d3.event.stopPropagation();

                        hideRadialMenu();

                        var action = d.data.action;
                        action(target, addRadialMenu);
                    })
                    .appendTo(overlay)
                    .show(data);

                svg.on('click', hideRadialMenu);
                $(document).on('mousedown', hideRadialMenu);
                MapService.getMap().on("click", hideRadialMenu)

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
        function addRadialMenu(elements, svg) {
            elements.on('contextmenu', function() {
                var elmt = d3.select(this),
                    pos = [d3.event.offsetX, d3.event.offsetY];

                d3.event.preventDefault();
                d3.event.stopPropagation();

                draw = function redrawMenu() {
                    if (menu) menu.hide();
                    menu = drawMenu(elmt, pos, svg);
                }

                draw();

                MapService.getMap().on("zoomend", draw)
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
                menu = null;
                svg.on('click', function() {});
                $(document).on('click', function() {});
                MapService.getMap().off("zoomend", draw);
                MapService.getMap().off("click", hideRadialMenu)
            }

            // if (currentTarget) {
            //     currentTarget.classed('blink', false);
            // }

        }

    }

    angular.module(moduleApp).service('RadialMenuService', RadialMenuService);

    RadialMenuService.$inject = ['SettingsActions', 'MapService'];

})();
