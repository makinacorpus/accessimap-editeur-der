'use strict';

/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.radialMenu
 * @description
 * # radialMenu
 * Service in the accessimapEditeurDerApp.
 */
angular.module('accessimapEditeurDerApp')
    .service('radialMenu', ['settings', 'getType', 'reset',
    function(settings, getType, reset) {

        var menu = null;

        this.drawMenu = function(target, mousePosition, scope) {

            target.classed('blink', true);
            var type = getType.getType(target);
            if (type) {
                scope.styleChoices = settings.STYLES;
                var data = settings.ACTIONS;
                var mapLayer = d3.select('#der').select('svg');

                var m = new d3.radialMenu().radius(50)
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
        };

        this.addRadialMenu = function(scope, el) {
            var that = this;
            el.on('contextmenu', function() {
                scope.$apply(function() {
                    scope.mode = 'default';
                });
                reset.resetActions();
                d3.event.preventDefault();
                d3.event.stopPropagation();
                if (menu) {
                    menu.hide();
                }
                var mapLayer = d3.select('#der').select('svg');
                menu = that.drawMenu(d3.select(this), d3.mouse(mapLayer.node()), scope);
            });
        };

  }]);


