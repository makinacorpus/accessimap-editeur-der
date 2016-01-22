'use strict';

/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.radialMenu
 * @description
 * # radialMenu
 * Service in the accessimapEditeurDerApp.
 */
angular.module('accessimapEditeurDerApp')
  .service('radialMenu', ['settings', 'getType', function(settings, getType) {

        this.drawMenu = function(target, mousePosition, scope) {
            var menu = scope.menu;
            var type = getType.getType(target);
            if (type) {
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

  }]);


