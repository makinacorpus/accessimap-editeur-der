'use strict';
/*global JSZip, saveAs */

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
      d3.select('.toBeDeleted').selectAll('*').remove();
      var zip = new JSZip();
      var mapNode = d3.select('#der').selectAll('svg').node();
      zip.file('map.svg', (new XMLSerializer()).serializeToString(mapNode));
      if (d3.select('#der-legend').selectAll('svg').node()) {
        var legendNode = d3.select('#der-legend').selectAll('svg').node();
        zip.file('legend.svg', (new XMLSerializer()).serializeToString(legendNode));
      }
      zip.file('comments.txt', $('#comment').val());
      var content = zip.generate({type: 'blob'});
      saveAs(content, 'map.zip');
    };

  });
