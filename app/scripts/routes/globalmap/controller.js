/*global PDFJS */

/**
 * @ngdoc controller
 * @name accessimapEditeurDerApp.controller:GlobalmapController
 * @description
 * # GlobalmapController
 * Controller of the accessimapEditeurDerApp
 */
(function() {
    'use strict';

    function GlobalmapController($location, initSvg, settings, shareSvg) {

        var $ctrl = this;

        $ctrl.accordionStyle = '';
        $ctrl.mapCategories =
            [{
                id: 'world',
                name: 'Monde',
                images: [{
                    path: 'data/BlankMap-World6-Equirectangular.svg',
                }]
            }, {
                id: 'france',
                name: 'France',
                images: [{
                    path: 'data/France_all_regions_A4.svg',
                }]
            }];

        $ctrl.appendSvg = appendSvg;
        $ctrl.uploadSvg = uploadSvg;

        function uploadSvg(element) {
            var svgFile = element.files[0],
                fileType = svgFile.type,
                reader = new FileReader();
                
            reader.readAsDataURL(svgFile);
            reader.onload = function (e) {
                $ctrl.accordionStyle = { display: 'none' };

                switch (fileType) {
                    case 'image/svg+xml':
                        appendSvg(e.target.result);
                        break;

                    case 'image/png':
                        appendPng(e.target.result);
                        break;

                    case 'image/jpeg':
                        appendPng(e.target.result);
                        break;

                    case 'application/pdf':
                        appendPdf(e.target.result);
                        break;
                        
                    default:
                        console.log('Mauvais format');
                }
            };
        };

        function appendPdf(dataURI) {
            var BASE64_MARKER = ';base64,',
                base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length,
                base64 = dataURI.substring(base64Index),
                raw = window.atob(base64),
                rawLength = raw.length,
                array = new Uint8Array(new ArrayBuffer(rawLength));

            for (var i = 0; i < rawLength; i++) {
                array[i] = raw.charCodeAt(i);
            }

            PDFJS.getDocument(array)
            .then(function (pdf) {
                pdf.getPage(1).then(function (page) {
                    var scale = 1.5,
                        viewport = page.getViewport(scale),
                        canvas = document.getElementById('pdf-canvas'),
                        context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    var renderContext = {
                        canvasContext: context,
                        viewport: viewport,
                    };
                    page.render(renderContext).then(function () {
                        appendPng(canvas.toDataURL());
                    });
                });
            });
        }

        function appendPng(image) {
            var mapFormat = $location.search().mapFormat,

                widthMm = settings.FORMATS[mapFormat].width,
                    heightMm = settings.FORMATS[mapFormat].height,
                    widthSvg = widthMm / settings.ratioPixelPoint,
                    heightSvg = heightMm / settings.ratioPixelPoint,

                svg = initSvg.createDetachedSvg(widthMm, heightMm),
                ratioSvg = heightSvg / widthSvg,
                img = new Image();

            img.src = image;
            img.onload = function () {
                var width = this.width,
                    height = this.height,
                    ratio = height / width,
                    w, h;

                if (ratio > ratioSvg) {
                    h = heightSvg;
                    w = h / ratio;
                } else {
                    w = widthSvg;
                    h = w * ratio;
                }

                // Load polygon fill styles taht will be used on common map
                angular.forEach(settings.POLYGON_STYLES, function (key) {
                    svg.call(key);
                });

                initSvg.createFrame(svg, widthSvg, heightSvg);
                var map = svg.append('g')
                        .attr('id', 'map-layer')
                        .attr('width', widthSvg)
                        .attr('height', heightSvg),

                    sourceLayer = initSvg.createSource(map);
                initSvg.createDrawing(map);
                initSvg.createMargin(svg, widthSvg, heightSvg);

                sourceLayer.append('g')
                    .classed('sourceDocument', true)
                    .append('image')
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('width', w)
                    .attr('height', h)
                    .attr('xlink:href', image);

                shareSvg.setMap(svg.node())
                .then(function () {
                    $location.path('/commonmap');
                });
            };
        }

        function appendSvg(path) {

            var mapFormat = $location.search().mapFormat,

                widthMm = settings.FORMATS[mapFormat].width,
                    heightMm = settings.FORMATS[mapFormat].height,
                    widthSvg = widthMm / settings.ratioPixelPoint,
                    heightSvg = heightMm / settings.ratioPixelPoint,
                
                svg = initSvg.createDetachedSvg(widthMm, heightMm);

            d3.xml(path, function (xml) {
                // Load polygon fill styles taht will be used on common map
                angular.forEach(settings.POLYGON_STYLES, function (key) {
                    svg.call(key);
                });

                initSvg.createFrame(svg, widthSvg, heightSvg);
                var map = svg.append('g')
                        .attr('id', 'map-layer')
                        .attr('width', widthSvg)
                        .attr('height', heightSvg),

                    sourceLayer = initSvg.createSource(map);

                initSvg.createDrawing(map);
                initSvg.createMargin(svg, widthSvg, heightSvg);

                var originalSvg = d3.select(xml.documentElement),
                    children = originalSvg[0][0].children,

                    returnChildren = function () {
                        return children[i];
                    };

                for (var i = 0; i < children.length; i++) {
                    d3.select(children[i]).classed('sourceDocument', true);
                    sourceLayer.append(returnChildren);
                }

                shareSvg.setMap(svg.node())
                    .then(function () {
                        $location.path('/commonmap');
                    });
            });
        }

    }
    
    angular.module('accessimapEditeurDerApp')
            .controller('GlobalmapController', GlobalmapController);

    GlobalmapController.$inject = ['$location', 'initSvg', 'settings', 'shareSvg'];

})();