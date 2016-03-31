(function() {
    'use strict';

    /**
     * @ngdoc service
     * @name accessimapEditeurDerApp.exportData
     * @memberOf accessimapEditeurDerApp
     * @module 
     * @description
     * Service in the accessimapEditeurDerApp.
     */
    function exportData(shareSvg) {

        this.mapExport = function(filename) {
            if (!filename) {
                filename = 'der';
            }

            var zip = new JSZip(),
                mapNode = d3.select('#der').select('svg').node(),
                exportNode = mapNode.cloneNode(true);

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


            shareSvg.getInteractions()
            .then(function(data) {
                var columns = [], i;

                for (i = 0; i < data.grid.columns.length; i++) {
                    columns.push({'field': data.grid.columns[i].field});
                }

                var rows = [];

                for (i = 0; i < data.grid.rows.length; i++) {
                    rows.push(data.grid.rows[i].entity);
                }

                // Remove the first and last columns
                columns.shift();
                columns.pop();

                var filterName = rows[0],
                    filterExpandable = rows[1];

                for (i = 0; i < columns.length; i++) {
                    var currentField = columns[i].field;
                    columns[i].name = filterName[currentField];
                    columns[i].expandable = filterExpandable[currentField];
                }

                var interactions = d3.select('#der').append('xml'),
                    config = interactions.append('config'),
                    filters = config.append('filters');

                filters.selectAll('filter')
                    .data(columns)
                    .enter()
                    .append('filter')
                    .attr('id', function(d) {
                        return d.field;
                    })
                    .attr('name', function(d) {
                        return d.name;
                    })
                    .attr('expandable', function(d) {
                        return d.expandable;
                    });

                // Remove the first two rows
                rows.shift();
                rows.shift();
                var pois = config.append('pois');
                pois.selectAll('poi')
                    .data(rows)
                    .enter()
                    .append('poi')
                    .attr('id', function(d) {
                        return d.id;
                    })
                    .each(function(d) {
                        var bbox;
                        d3.select('#der').select('svg').selectAll('path')[0]
                            .forEach(function(shape) {
                                if ('poi-' + d3.select(shape).attr('data-link') === d.id) {
                                    bbox = d3.select(shape).node().getBBox();
                                }
                            });
                        var poi = d3.select(this);
                        poi.attr('id', d.id);

                        if (bbox) {
                            poi.attr('x', bbox.x);
                            poi.attr('y', bbox.y);
                            poi.attr('width', bbox.width);
                            poi.attr('height', bbox.height);
                        }
                        var actions = poi.append('actions');
                        // loop through the keys - this assumes no extra data
                        d3.keys(d).forEach(function(key) {
                            if (key !== '$$hashKey' && key !== 'deletable' && key !== 'id') {
                                actions.append('action')
                                .attr('gesture', 'double_tap')
                                .attr('filter', key)
                                .attr('value', d[key])
                                .attr('protocol', function() {
                                    if (d[key]) {
                                        var extension = d[key] && d[key].split('.')[d[key].split('.').length - 1];

                                        if (extension === 'mp3') {
                                            return 'mp3';
                                        } else {
                                            return 'tts';
                                        }
                                    }
                                });
                            }
                        });
                    });
                    
                var interactionsNode = d3.select('#der').select('xml').node(),
                    xmlToExport = '<?xml version="1.0" encoding="UTF-8"?>';

                xmlToExport += (new XMLSerializer()).serializeToString(interactionsNode);
                xmlToExport = xmlToExport.replace(/<xml.*<config>/, '<config>');
                xmlToExport = xmlToExport.replace('</xml>', '');
                zip.file('interactions.xml', xmlToExport);

                var content = zip.generate({type: 'blob'});
                saveAs(content, filename + '.zip');

            });
        };

    }
    /*global JSZip, saveAs */

    angular.module('accessimapEditeurDerApp')
        .service('exportData', exportData);

    exportData.$inject = ['shareSvg'];
})();