/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.RadialMenuService
 * 
 * @description
 * Service providing functions to draw a radial menu on a specific feature
 */
(function() {
    'use strict';

    function RadialMenuService(settings, FeatureService, MapService) {

        this.drawMenu       = drawMenu;
        this.addRadialMenu  = addRadialMenu;
        this.hideRadialMenu = hideRadialMenu;

        this.init = init;

        var menu = null,
            svg, getCurrentZoom;

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
        function drawMenu(target, mousePosition) {
            
            target.classed('blink', true);
            var type = target.attr('data-type') ? target.attr('data-type') : 'default' ; //FeatureService.getType(target);

            if (type) {
                var data = settings.ACTIONS[type],

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
                
                        var action = d.data.action;
                        action(target);
                        menu.hide();
                        menu = null;
                    })
                    .appendTo(svg.node())
                    .show(data);

                MapService.addClickListener(function(e) {
                    e.originalEvent.preventDefault();
                    e.originalEvent.stopPropagation();
                    hideRadialMenu();
                })

                var clickOutsideMenu = svg.on('click', function(e) {
                    hideRadialMenu();
                });

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
        function addRadialMenu(elements) {
            var that = this;
            elements.on('contextmenu', function(event) {

                // TODO: Block others click...
                d3.event.preventDefault();
                d3.event.stopPropagation();

                if (menu) menu.hide();

                menu = that.drawMenu(
                            d3.select(this), 
                            d3.mouse(svg.node()),
                            1);
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
                menu = null
            }
        }

    }

    angular.module(moduleApp).service('RadialMenuService', RadialMenuService);

    RadialMenuService.$inject = ['settings', 'FeatureService', 'MapService'];

})();