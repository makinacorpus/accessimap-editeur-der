'use strict';

/**
 * @ngdoc function
 * @name accessimapEditeurDerApp.controller:GlobalmapCtrl
 * @description
 * # GlobalmapCtrl
 * Controller of the accessimapEditeurDerApp
 */
angular.module('accessimapEditeurDerApp')
    .controller('GlobalmapCtrl', ['$scope', '$rootScope', '$http', '$location', 'usSpinnerService',
        'initSvg', 'settings', 'shareSvg',
        function($scope, $rootScope, $http, $location, usSpinnerService,
            initSvg, settings, shareSvg) {

            $scope.mapCategories = [{
                id: 'world',
                name: 'Monde',
                images: [{
                    path: 'data/BlankMap-World6-Equirectangular.svg'
                }]
            }, {
                id: 'france',
                name: 'France',
                images: [{
                    path: 'data/France_all_regions_A4.svg'
                }]
            }];
            $scope.uploadSvg = function(element) {
                var svgFile = element.files[0];
                var fileType = svgFile.type;
                var reader = new FileReader();
                reader.readAsDataURL(svgFile);
                reader.onload = function(e) {
                    $scope.accordionStyle = {display: 'none'};
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
                var BASE64_MARKER = ';base64,';
                var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
                var base64 = dataURI.substring(base64Index);
                var raw = window.atob(base64);
                var rawLength = raw.length;
                var array = new Uint8Array(new ArrayBuffer(rawLength));

                for (var i = 0; i < rawLength; i++) {
                    array[i] = raw.charCodeAt(i);
                }
                PDFJS.getDocument(array)
                .then(function(pdf) {
                    pdf.getPage(1).then(function(page) {
                        var scale = 1.5;
                        var viewport = page.getViewport(scale);

                        var canvas = document.getElementById('pdf-canvas');
                        var context = canvas.getContext('2d');
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;

                        var renderContext = {
                            canvasContext: context,
                            viewport: viewport
                        };
                        page.render(renderContext).then(function(rrr) {
                            appendPng(canvas.toDataURL());
                        });
                    });
                });
            }

            function appendPng(image) {
                var mapFormat = $location.search().mapFormat;
                var legendFormat = $location.search().legendFormat;

                var widthMm = settings.FORMATS[mapFormat].width,
                        heightMm = settings.FORMATS[mapFormat].height,
                        widthSvg = widthMm / 0.283,
                        heightSvg = heightMm / 0.283;
                var svg = initSvg.createDetachedSvg(widthMm, heightMm);
                var ratioSvg = heightSvg / widthSvg;
                var img = new Image();
                img.src = image;
                img.onload = function() {
                    var width = this.width;
                    var height = this.height;
                    var ratio = height / width;
                    var w, h;
                    if (ratio > ratioSvg) {
                        h = heightSvg;
                        w = h / ratio;
                    } else {
                        w = widthSvg;
                        h = w * ratio;
                    }
                    var g = svg.append('g')
                        .classed('sourceDocument', true)
                        .append('image')
                        .attr('x', 0)
                        .attr('y', 0)
                        .attr('width', w)
                        .attr('height', h)
                        .attr('xlink:href', image);
                    // Load polygon fill styles taht will be used on common map
                    angular.forEach(settings.POLYGON_STYLES, function(key) {
                            svg.call(key);
                    });
                    shareSvg.addMap(svg.node())
                    .then(function() {
                        $location.path('/commonmap');
                    });
                };
            }

            function appendSvg(path) {
                d3.xml(path, function(xml) {
                    var svg = d3.select(xml.documentElement);
                    angular.forEach(svg[0][0].children, function(child) {
                            d3.select(child).classed('sourceDocument', true);
                    });
                    // Load polygon fill styles taht will be used on common map
                    angular.forEach(settings.POLYGON_STYLES, function(key) {
                            svg.call(key);
                    });
                    shareSvg.addMap(xml.documentElement)
                    .then(function() {
                        $location.path('/commonmap');
                    });
                });
            }

            $scope.appendSvg = appendSvg;

}]);
