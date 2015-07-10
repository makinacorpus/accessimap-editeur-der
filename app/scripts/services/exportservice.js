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

    this.mapExport = function(filename) {
      var zip = new JSZip();
      var mapNode = d3.select('#der').select('svg').node();
      var exportNode = mapNode.cloneNode(true);
      zip.file('carte_avec_source.svg', (new XMLSerializer()).serializeToString(exportNode));
      d3.select(exportNode).selectAll('.tiles').selectAll('*').remove();
      d3.select(exportNode).selectAll('.sourceDocument').remove();
      d3.select(exportNode).selectAll('.sourceDocument').selectAll('*').remove();
      zip.file('carte_sans_source.svg', (new XMLSerializer()).serializeToString(exportNode));
      if (d3.select('#der-legend').selectAll('svg').node()) {
        var legendNode = d3.select('#der-legend').selectAll('svg').node();
        zip.file('legende.svg', (new XMLSerializer()).serializeToString(legendNode));
      }
      zip.file('commentaires.txt', $('#comment').val());
      var content = zip.generate({type: 'blob'});
      saveAs(content, filename + '.zip');
    };

  });
