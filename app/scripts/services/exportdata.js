'use strict';
/*global JSZip, saveAs */

/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.exportData
 * @description
 * # exportData
 * Service in the accessimapEditeurDerApp.
 */
angular.module('accessimapEditeurDerApp')
    .service('exportData', ['shareSvg',
    function(shareSvg) {

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


            shareSvg.getInteractions()
            .then(function(data) {
                var columns = [];
                var i;
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

                var filterName = rows[0];
                var filterExpandable = rows[1];

                for (i = 0; i < columns.length; i++) {
                    var currentField = columns[i].field;
                    columns[i].name = filterName[currentField];
                    columns[i].expandable = filterExpandable[currentField];
                }

                var interactions = d3.select('#der').append('xml');
                var config = interactions.append('config');
                var filters = config.append('filters');
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
                        var shapeD;
                        var bbox;
                        d3.select('#der').select('svg').selectAll('path')[0]
                            .forEach(function(shape) {
                                if ('poi-' + d3.select(shape).attr('iid') === d.id) {
                                    shapeD = d3.select(shape).attr('d');
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
                        poi.attr('coord', shapeD);
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
                var interactionsNode = d3.select('#der').select('xml').node();
                zip.file('interactions.xml', (new XMLSerializer()).serializeToString(interactionsNode));
                var content = zip.generate({type: 'blob'});
                saveAs(content, filename + '.zip');
            });
        };

    }]);
