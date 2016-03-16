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

        this.drawMenu = function(target, mousePosition, scope) {
            var menu = scope.menu;
            target.classed('blink', true);
            var type = getType.getType(target);
            if (type) {
                scope.styleChoices = settings.STYLES[type];
                var data = settings.ACTIONS[type];
                var mapLayer = d3.select('#der').select('svg');

                var m = new d3.radialMenu().radius(50)
                    .thickness(50)
                    .animationDuration(100)
                    .iconSize(40)
                    .translation(mousePosition[0] + ' ' + mousePosition[1])
                    .onClick(function(d) {
                        var action = d.data.action;
                        action(target, scope);
                        scope.menu.hide();
                        scope.menu = null;
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
                if (scope.menu) {
                    scope.menu.hide();
                }
                var mapLayer = d3.select('#der').select('svg');
                scope.menu = that.drawMenu(d3.select(this), d3.mouse(mapLayer.node()), scope);
            });
        };

  }]);


