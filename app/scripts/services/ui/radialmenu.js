'use strict';

/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.radialMenu
 * @description
 * # radialMenu
 * Service in the accessimapEditeurDerApp.
 */
angular.module('accessimapEditeurDerApp')
  .service('radialMenu', function() {

        this.drawMenu = function(target, mousePosition) {
            var data = [
                { icon: 'https://github.com/favicon.ico', action: 'segment 1' },
                { icon: 'https://github.com/favicon.ico', action: 'segment 2' },
                { icon: 'https://github.com/favicon.ico', action: 'segment 3' },
                { icon: 'https://github.com/favicon.ico', action: 'segment 4' }
            ];

            var m = new d3.radialMenu().radius(50)
                .thickness(50)
                .translation(mousePosition[0] + ' ' + mousePosition[1])
                .onClick(function(d) {
                    console.log(d);
                })
                .appendTo(target.node().parentNode)
                .show(data);
        };

  });
