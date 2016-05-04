(function() {
    'use strict';

    /*global JSZip, saveAs */
    /**
     * @ngdoc service
     * @name accessimapEditeurDerApp.ExportService
     * @memberOf accessimapEditeurDerApp
     * @module 
     * @description
     * Service in the accessimapEditeurDerApp.
     */
    function ExportService(shareSvg) {

        this.exportData = exportData;

        // TODO: add parameters to not have to use DOM selectors.
        // this function have to be independant from the DOM
        // To be added : drawingNode, legendNode, interactions
        function exportData(filename, drawingNode, tilesNode, legendNode, comment, interactionsData, width, height) {
            if (!filename) {
                filename = 'der';
            }

            var zip    = new JSZip(),
            exportNode = drawingNode ? drawingNode.cloneNode(true) : null,
            svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            d3.select(svg)
                .attr('width', width)
                .attr('height', height)
                .attr('viewBox', '0 0 ' + width + ' ' + height)
                // .style('left', '100')
                // .style('top', '100')

            svg.appendChild(exportNode);

            console.log(svg);
            
            zip.file('carte_avec_source.svg', (new XMLSerializer()).serializeToString(svg));

            if (tilesNode)
                zip.file('tiles.svg', (new XMLSerializer()).serializeToString(tilesNode.cloneNode(true)));

            d3.select(exportNode)
                .selectAll('.tiles')
                .selectAll('*')
                .remove();

            d3.select(exportNode)
                .selectAll('.sourceDocument')
                .remove();

            d3.select(exportNode)
                .selectAll('.sourceDocument')
                .selectAll('*')
                .remove();

            zip.file('carte_sans_source.svg', (new XMLSerializer()).serializeToString(exportNode));

            if (legendNode)
                zip.file('legende.svg', (new XMLSerializer()).serializeToString(legendNode));

            zip.file('commentaires.txt', comment);

            if (interactionsData !== undefined && interactionsData !== null) {

                var columns = [], i;

                for (i = 0; i < interactionsData.grid.columns.length; i++) {
                    columns.push({'field': interactionsData.grid.columns[i].field});
                }

                var rows = [];

                for (i = 0; i < interactionsData.grid.rows.length; i++) {
                    rows.push(interactionsData.grid.rows[i].entity);
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
                    .interactionsData(columns)
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
                    .interactionsData(rows)
                    .enter()
                    .append('poi')
                    .attr('id', function(d) {
                        return d.id;
                    })
                    .each(function(d) {
                        var bbox;
                        d3.select('#der').select('svg').selectAll('path')[0]
                            .forEach(function(shape) {
                                if ('poi-' + d3.select(shape).attr('data-link') 
                                        === d.id) {
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
                            if (key !== '$$hashKey' 
                                    && key !== 'deletable' 
                                    && key !== 'id') {
                                actions.append('action')
                                .attr('gesture', 'double_tap')
                                .attr('filter', key)
                                .attr('value', d[key])
                                .attr('protocol', function() {
                                    if (d[key]) {
                                        var split = d[key].split('.'),
                                            extension = d[key] 
                                                && split[split.length - 1];

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

                xmlToExport += (new XMLSerializer())
                                    .serializeToString(interactionsNode);
                xmlToExport = xmlToExport.replace(/<xml.*<config>/, '<config>');
                xmlToExport = xmlToExport.replace('</xml>', '');
                zip.file('interactions.xml', xmlToExport);

            }   
                    
            var content = zip.generate({type: 'blob'});
            saveAs(content, filename + '.zip');

        };

    }

    angular.module(moduleApp)
        .service('ExportService', ExportService);

    ExportService.$inject = ['shareSvg'];
})();