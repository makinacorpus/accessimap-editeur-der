'use strict';

/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.exportService
 * @description
 * # exportService
 * Service in the accessimapEditeurDerApp.
 */
angular.module('accessimapEditeurDerApp')
  .service('exportService', function() {

    this.mapExport = function() {
      d3.select('.tiles').selectAll('*').remove();
      var zip = new JSZip();
      zip.file('map.svg', (new XMLSerializer).serializeToString(d3.select('#der').selectAll('svg').node()));
      zip.file('legend.svg', (new XMLSerializer).serializeToString(d3.select('#der-legend').selectAll('svg').node()));
      zip.file('comments.txt', $('#comment').val());
      var content = zip.generate({type: 'blob'});
      saveAs(content, 'map.zip');
    };

  });
