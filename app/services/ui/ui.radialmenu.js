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
            currentTarget;

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

            var type = target.attr('data-type') ? target.attr('data-type') : 'default' ;

            if (type) {
                var data = SettingsActions.ACTIONS[type],

                    m = new d3.radialMenu()
                    .radius(50)
                    .thickness(60)
                    .animationDuration(100)
                    .iconSize(40)
                    .translation(mousePosition[0] + ' ' + mousePosition[1])
                    .scale(1/getCurrentZoom() + "," + 1/getCurrentZoom())
                    .onClick(function(d) {

                        d3.event.preventDefault();
                        d3.event.stopPropagation();
                        
                        hideRadialMenu();
                
                        var action = d.data.action;
                        action(target, addRadialMenu);
                    })
                    .appendTo(svg.node())
                    .show(data);

                svg.on('click', hideRadialMenu);
                $(document).on('click', hideRadialMenu);

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
            elements.on('contextmenu', function(event) {
                var elmt = d3.select(this);
                var pos = [elmt.node().getBBox().x + 10, elmt.node().getBBox().y + 10];
                // TODO: Block others click...
                d3.event.preventDefault();
                d3.event.stopPropagation();

                if (menu) menu.hide();
                menu = drawMenu(elmt, pos, svg);
                MapService.getMap().on("zoomend", function() {
                    if (menu) menu.hide();
                    menu = drawMenu(elmt, pos, svg);
                })
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
            }
            
            // if (currentTarget) {
            //     currentTarget.classed('blink', false);
            // }
                
        }

    }

    angular.module(moduleApp).service('RadialMenuService', RadialMenuService);

    RadialMenuService.$inject = ['SettingsActions', 'MapService'];

})();