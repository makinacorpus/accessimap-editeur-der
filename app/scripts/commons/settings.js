/*global textures */
// jscs:disable maximumLineLength
/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.settings
 * @requires accessimapEditeurDerApp.editSvg
 * @requires accessimapEditeurDerApp.removeService
 * @requires accessimapEditeurDerApp.interactService
 * @requires accessimapEditeurDerApp.styleService
 * @requires accessimapEditeurDerApp.moveService
 * @requires accessimapEditeurDerApp.geometryService
 * @description
 * # settings
 * Factory in the accessimapEditeurDerApp.
 */
(function() {
    'use strict';

    function settings (editSvg, removeService, interactService, 
                        styleService, moveService, geometryService) {

        var leafletConf = {
                GLOBAL_MAP_CENTER: [1.441019, 43.604268], // [lon, lat]
                GLOBAL_MAP_DEFAULT_ZOOM: 13,
            },

        /**
         * @ngdoc property
         * @name  ratioPixelPoint
         * @propertyOf accessimapEditeurDerApp.settings
         * @type {Number}
         * @description Ratio between a pixel and a millimeter
         */
        ratioPixelPoint = 0.283,

        FONTS = [{
                name: 'Braille',
                size: '35px',
                family: 'Braille_2007',
                weight: null,
                color: 'black'
            }, {
                name: 'Arial gras 32',
                size: '32px',
                family: 'Arial',
                weight: 'bold',
                color: 'other'
            }, {
                name: 'Arial gras 28',
                size: '28px',
                family: 'Arial',
                weight: 'bold',
                color: 'other'
            }, {
                name: 'Arial gras 22',
                size: '22px',
                family: 'Arial',
                weight: 'bold',
                color: 'other'
            }, {
                name: 'Arial gras 18',
                size: '18px',
                family: 'Arial',
                weight: 'bold',
                color: 'other'
            }
        ],

        COLORS = {
            'black': [{
                name: 'Noir',
                color: 'black',
            }],
            'transparent': [{
                name: 'Transparent',
                color: 'none',
            }, {
                name: 'Blanc',
                color: 'white',
            }],
            'other': [{
                name: 'Bleu',
                color: 'blue',
            }, {
                name: 'Rouge',
                color: 'red',
            }, {
                name: 'Jaune',
                color: 'yellow',
            }
        ]},

        /**
         * @ngdoc property
         * @name  accessimapEditeurDerApp.settings.FORMATS
         * @propertyOf accessimapEditeurDerApp.settings
         * @description
         * Formats availables for editing documents.
         */
        FORMATS = {
            'portraitA4': {
                name: 'A4 Portrait',
                width: 210,
                height: 297
            },
            'landscapeA4': {
                name: 'A4 Paysage',
                width: 297,
                height: 210
            },
            'portraitA3': {
                name: 'A3 Portrait',
                width: 297,
                height: 420
            },
            'landscapeA3': {
                name: 'A3 Paysage',
                width: 420,
                height: 297
            },
            'nexus9': {
                name: 'Nexus 9 Paysage',
                width: 181, // 7.12"
                height: 136 // 5.35"
            }
        },

        QUERY_LIST = [{
            id: 'poi',
            name: 'Point d\'intérêt',
            type: 'point',
            query: ['node["amenity"]', 'node["shop"]'],
            icon: 'road'
        },{
            id: 'trottoirs',
            name: 'Trottoirs',
            type: 'line',
            query: ['way["footway"="sidewalk"]'],
            icon: 'road'
        }, {
            id: 'ppietons',
            name: 'Passages piétons',
            type: 'line',
            query: ['way["footway"="crossing"]'],
            icon: 'road'
        }, {
            id: 'principales',
            name: 'Routes principales',
            type: 'line',
            query: ['way["highway"~"motorway|trunk|primary|secondary"]'],
            icon: 'road'
        }, {
            id: 'places',
            name: 'Places',
            type: 'polygon',
            query: ['way["highway"="pedestrian"]["area"="yes"]'],
            icon: 'road'
        }, {
            id: 'rues',
            name: 'Toutes les rues',
            type: 'line',
            query: ['way["highway"]["highway"!="footway"]["highway"!="cycleway"]["highway"!="path"]["highway"!="steps"]["area"!="yes"]'],
            icon: 'road'
        }, {
            id: 'ruespietonnes',
            name: 'Chemins piétons',
            type: 'line',
            query: ['way["highway"~"footway|cycleway|path|steps"]["area"!="yes"]["footway"!="sidewalk"]["footway"!="crossing"]'],
            icon: 'road'
        }, {
            id: 'trafficSignals',
            name: 'Feux tricolores',
            type: 'point',
            query: ['node["highway"="traffic_signals"]'],
            icon: 'street-view'
        }, {
            id: 'trafficSignals_sound',
            name: 'Feux sonores',
            type: 'point',
            query: ['node["traffic_signals:sound"]'],
            icon: 'street-view'
        }, {
            id: 'batiments',
            name: 'Batiments',
            type: 'polygon',
            query: ['way["building"]["building"!="no"]'],
            icon: 'building-o'
        }, {
            id: 'eau',
            name: 'Eau',
            type: 'polygon',
            query: ['relation["type"="multipolygon"]["natural"="water"]', 'way["waterway"="riverbank"]'],
            icon: 'leaf'
        }, {
            id: 'parc',
            name: 'Parc',
            type: 'polygon',
            query: ['way["leisure"="park"]'],
            icon: 'leaf'
        }],

        POLYGON_STYLES = {
            'bighash': textures.lines().orientation('vertical'),
            'bighashm45': textures.lines().orientation('6/8'),
            'bighash45': textures.lines().orientation('2/8'),
            'smallhash': textures.lines().orientation('vertical').thicker(),
            'smallhashm45': textures.lines().orientation('6/8').thicker(),
            'smallhash45': textures.lines().orientation('2/8').thicker(),
            'waves': textures.paths().d('waves'),
            'smalldots': textures.circles().complement(),
            'smalldotsline': textures.circles().lighter().thicker().complement().strokeWidth(1.1).background('white'),
            'smalldotsthicker': textures.circles().lighter().thicker().complement().strokeWidth(1.1),
            'smalldotsthicker2': textures.circles().lighter().thicker().complement().strokeWidth(1.3),
            'bigdots': textures.circles().fill('grey').heavier().complement(),
            'squares45': textures.lines().orientation('2/8', '6/8').size(20).strokeWidth(1),
            'caps': textures.paths().d('caps'),
            'woven': textures.paths().d('woven'),
            'solid': textures.lines().strokeWidth(0),
            'bighash_white': textures.lines().orientation('vertical').background('white'),
            'bighashm45_white': textures.lines().orientation('6/8').background('white'),
            'bighash45_white': textures.lines().orientation('2/8').background('white'),
            'smallhash_white': textures.lines().orientation('vertical').thicker().background('white'),
            'smallhashm45_white': textures.lines().orientation('6/8').thicker().background('white'),
            'smallhash45_white': textures.lines().orientation('2/8').thicker().background('white'),
            'waves_white': textures.paths().d('waves').background('white'),
            'smalldots_white': textures.circles().complement().background('white'),
            'smalldotsline_white': textures.circles().lighter().thicker().complement().strokeWidth(1.1).background('white'),
            'smalldotsthicker_white': textures.circles().lighter().thicker().complement().strokeWidth(1.1).background('white'),
            'smalldotsthicker2_white': textures.circles().lighter().thicker().complement().strokeWidth(1.3).background('white'),
            'bigdots_white': textures.circles().fill('grey').heavier().complement().background('white'),
            'squares45_white': textures.lines().orientation('2/8', '6/8').size(20).strokeWidth(1).background('white'),
            'caps_white': textures.paths().d('caps').background('white'),
            'woven_white': textures.paths().d('woven').background('white'),
            'solid_white': textures.lines().strokeWidth(0).background('white'),
            'bighash_blue': textures.lines().orientation('vertical').background('blue'),
            'bighashm45_blue': textures.lines().orientation('6/8').background('blue'),
            'bighash45_blue': textures.lines().orientation('2/8').background('blue'),
            'smallhash_blue': textures.lines().orientation('vertical').thicker().background('blue'),
            'smallhashm45_blue': textures.lines().orientation('6/8').thicker().background('blue'),
            'smallhash45_blue': textures.lines().orientation('2/8').thicker().background('blue'),
            'waves_blue': textures.paths().d('waves').background('blue'),
            'smalldots_blue': textures.circles().complement().background('blue'),
            'smalldotsline_blue': textures.circles().lighter().thicker().complement().strokeWidth(1.1).background('blue'),
            'smalldotsthicker_blue': textures.circles().lighter().thicker().complement().strokeWidth(1.1).background('blue'),
            'smalldotsthicker2_blue': textures.circles().lighter().thicker().complement().strokeWidth(1.3).background('blue'),
            'bigdots_blue': textures.circles().fill('grey').heavier().complement().background('blue'),
            'squares45_blue': textures.lines().orientation('2/8', '6/8').size(20).strokeWidth(1).background('blue'),
            'caps_blue': textures.paths().d('caps').background('blue'),
            'woven_blue': textures.paths().d('woven').background('blue'),
            'solid_blue': textures.lines().strokeWidth(0).background('blue'),
            'bighash_red': textures.lines().orientation('vertical').background('red'),
            'bighashm45_red': textures.lines().orientation('6/8').background('red'),
            'bighash45_red': textures.lines().orientation('2/8').background('red'),
            'smallhash_red': textures.lines().orientation('vertical').thicker().background('red'),
            'smallhashm45_red': textures.lines().orientation('6/8').thicker().background('red'),
            'smallhash45_red': textures.lines().orientation('2/8').thicker().background('red'),
            'waves_red': textures.paths().d('waves').background('red'),
            'smalldots_red': textures.circles().complement().background('red'),
            'smalldotsline_red': textures.circles().lighter().thicker().complement().strokeWidth(1.1).background('red'),
            'smalldotsthicker_red': textures.circles().lighter().thicker().complement().strokeWidth(1.1).background('red'),
            'smalldotsthicker2_red': textures.circles().lighter().thicker().complement().strokeWidth(1.3).background('red'),
            'bigdots_red': textures.circles().fill('grey').heavier().complement().background('red'),
            'squares45_red': textures.lines().orientation('2/8', '6/8').size(20).strokeWidth(1).background('red'),
            'caps_red': textures.paths().d('caps').background('red'),
            'woven_red': textures.paths().d('woven').background('red'),
            'solid_red': textures.lines().strokeWidth(0).background('red'),
            'bighash_yellow': textures.lines().orientation('vertical').background('yellow'),
            'bighashm45_yellow': textures.lines().orientation('6/8').background('yellow'),
            'bighash45_yellow': textures.lines().orientation('2/8').background('yellow'),
            'smallhash_yellow': textures.lines().orientation('vertical').thicker().background('yellow'),
            'smallhashm45_yellow': textures.lines().orientation('6/8').thicker().background('yellow'),
            'smallhash45_yellow': textures.lines().orientation('2/8').thicker().background('yellow'),
            'waves_yellow': textures.paths().d('waves').background('yellow'),
            'smalldots_yellow': textures.circles().complement().background('yellow'),
            'smalldotsline_yellow': textures.circles().lighter().thicker().complement().strokeWidth(1.1).background('yellow'),
            'smalldotsthicker_yellow': textures.circles().lighter().thicker().complement().strokeWidth(1.1).background('yellow'),
            'smalldotsthicker2_yellow': textures.circles().lighter().thicker().complement().strokeWidth(1.3).background('yellow'),
            'bigdots_yellow': textures.circles().fill('grey').heavier().complement().background('yellow'),
            'squares45_yellow': textures.lines().orientation('2/8', '6/8').size(20).strokeWidth(1).background('yellow'),
            'caps_yellow': textures.paths().d('caps').background('yellow'),
            'woven_yellow': textures.paths().d('woven').background('yellow'),
            'solid_yellow': textures.lines().strokeWidth(0).background('yellow'),
        },

        STYLES = {
        'line': [{
            id: 'straight_2',
            name: 'Trait 2',
            style: [{
                'k': 'stroke',
                'v': 'black'
            }, {
                'k': 'stroke-width',
                'v': '2'
            }, {
                'k': 'fill',
                'v': 'none'
            }],
            styleInner: [{
                'k': 'stroke-width',
                'v': '0'
            }, {
                'k': 'fill',
                'v': 'none'
            }]
        },{
            id: 'straight_3',
            name: 'Trait 3',
            style: [{
                'k': 'stroke',
                'v': 'black'
            }, {
                'k': 'stroke-width',
                'v': '3'
            }, {
                'k': 'fill',
                'v': 'none'
            }],
            styleInner: [{
                'k': 'stroke-width',
                'v': '0'
            }, {
                'k': 'fill',
                'v': 'none'
            }]
        },{
            id: 'straight_5',
            name: 'Trait 5',
            style: [{
                'k': 'stroke',
                'v': 'black'
            }, {
                'k': 'stroke-width',
                'v': '5'
            }, {
                'k': 'fill',
                'v': 'none'
            }],
            styleInner: [{
                'k': 'stroke-width',
                'v': '0'
            }, {
                'k': 'fill',
                'v': 'none'
            }]
        },{
            id: 'straight_8',
            name: 'Traits parallèles',
            style: [{
                'k': 'stroke',
                'v': 'black'
            }, {
                'k': 'stroke-width',
                'v': '8'
            }, {
                'k': 'stroke-linecap',
                'v': 'butt'
            }, {
                'k': 'fill',
                'v': 'none'
            }],
            styleInner: [{
                'k': 'stroke',
                'v': 'white'
            }, {
                'k': 'stroke-width',
                'v': '4'
            }, {
                'k': 'stroke-linecap',
                'v': 'round'
            }, {
                'k': 'fill',
                'v': 'none'
            }]
        },{
            id: 'straight_12',
            name: 'Traits parallèles 2',
            style: [{
                'k': 'stroke',
                'v': 'black'
            }, {
                'k': 'stroke-width',
                'v': '12'
            }, {
                'k': 'stroke-linecap',
                'v': 'butt'
            }, {
                'k': 'fill',
                'v': 'none'
            }],
            styleInner: [{
                'k': 'stroke',
                'v': 'white'
            }, {
                'k': 'stroke-width',
                'v': '8'
            }, {
                'k': 'stroke-linecap',
                'v': 'round'
            }, {
                'k': 'fill',
                'v': 'none'
            }]
        },{
            id: 'straight_20',
            name: 'Traits parallèles 3',
            style: [{
                'k': 'stroke',
                'v': 'black'
            }, {
                'k': 'stroke-width',
                'v': '20'
            }, {
                'k': 'stroke-linecap',
                'v': 'butt'
            }, {
                'k': 'fill',
                'v': 'none'
            }],
            styleInner: [{
                'k': 'stroke',
                'v': 'white'
            }, {
                'k': 'stroke-width',
                'v': '15'
            }, {
                'k': 'stroke-linecap',
                'v': 'round'
            }, {
                'k': 'fill',
                'v': 'none'
            }]
        },{
            id: 'straight_20_fill',
            name: 'Traits parallèles 3 rempli',
            style: [{
                'k': 'stroke',
                'v': 'black'
            }, {
                'k': 'stroke-width',
                'v': '20'
            }, {
                'k': 'stroke-linecap',
                'v': 'round'
            }, {
                'k': 'fill',
                'v': 'none'
            }],
            styleInner: [{
                'k': 'stroke',
                'v': POLYGON_STYLES.smalldotsline.url()
            }, {
                'k': 'stroke-width',
                'v': '15'
            }, {
                'k': 'stroke-linecap',
                'v': 'round'
            }, {
                'k': 'fill',
                'v': 'none'
            }]
        },{
            id: 'straight_35',
            name: 'Traits parallèles 4',
            style: [{
                'k': 'stroke',
                'v': 'black'
            }, {
                'k': 'stroke-width',
                'v': '35'
            }, {
                'k': 'stroke-linecap',
                'v': 'butt'
            }, {
                'k': 'fill',
                'v': 'none'
            }],
            styleInner: [{
                'k': 'stroke',
                'v': 'white'
            }, {
                'k': 'stroke-width',
                'v': '30'
            }, {
                'k': 'stroke-linecap',
                'v': 'round'
            }, {
                'k': 'fill',
                'v': 'none'
            }]
        },{
            id: 'dashed11_11_5',
            name: 'Passage',
            style: [{
                'k': 'stroke',
                'v': 'black'
            }, {
                'k': 'stroke-width',
                'v': '15'
            }, {
                'k': 'fill',
                'v': 'none'
            }, {
                'k': 'stroke-dasharray',
                'v': '4, 4'
            }],
            styleInner: [{
                'k': 'stroke',
                'v': 'white'
            }, {
                'k': 'stroke-width',
                'v': '15'
            }, {
                'k': 'fill',
                'v': 'none'
            }, {
                'k': 'stroke-dasharray',
                'v': '4, 4'
            }, {
                'k': 'stroke-dashoffset',
                'v': '4'
            }]
        },{
            id: 'dashed21_5',
            name: 'Tirets 21_5',
            style: [{
                'k': 'stroke',
                'v': 'black'
            }, {
                'k': 'stroke-width',
                'v': '5'
            }, {
                'k': 'fill',
                'v': 'none'
            }, {
                'k': 'stroke-dasharray',
                'v': '10, 5'
            }],
            styleInner: [{
                'k': 'stroke-width',
                'v': '0'
            }, {
                'k': 'fill',
                'v': 'none'
            }]
        },{
            id: 'dashed22_3',
            name: 'Tirets 22_3',
            style: [{
                'k': 'stroke',
                'v': 'black'
            }, {
                'k': 'stroke-width',
                'v': '3'
            }, {
                'k': 'fill',
                'v': 'none'
            }, {
                'k': 'stroke-dasharray',
                'v': '6, 6'
            }],
            styleInner: [{
                'k': 'stroke-width',
                'v': '0'
            }, {
                'k': 'fill',
                'v': 'none'
            }]
        },{
            id: 'dashed22_5',
            name: 'Tirets 22_5',
            style: [{
                'k': 'stroke',
                'v': 'black'
            }, {
                'k': 'stroke-width',
                'v': '5'
            }, {
                'k': 'fill',
                'v': 'none'
            }, {
                'k': 'stroke-dasharray',
                'v': '10, 10'
            }],
            styleInner: [{
                'k': 'stroke-width',
                'v': '0'
            }, {
                'k': 'fill',
                'v': 'none'
            }]
        },{
            id: 'dashed42_3',
            name: 'Tirets 42_3',
            style: [{
                'k': 'stroke',
                'v': 'black'
            }, {
                'k': 'stroke-width',
                'v': '3'
            }, {
                'k': 'fill',
                'v': 'none'
            }, {
                'k': 'stroke-dasharray',
                'v': '12, 6'
            }],
            styleInner: [{
                'k': 'stroke-width',
                'v': '0'
            }, {
                'k': 'fill',
                'v': 'none'
            }]
        },{
            id: 'dashed42_5',
            name: 'Tirets 42_5',
            style: [{
                'k': 'stroke',
                'v': 'black'
            }, {
                'k': 'stroke-width',
                'v': '5'
            }, {
                'k': 'fill',
                'v': 'none'
            }, {
                'k': 'stroke-dasharray',
                'v': '20, 10'
            }],
            styleInner: [{
                'k': 'stroke-width',
                'v': '0'
            }, {
                'k': 'fill',
                'v': 'none'
            }]
        },{
            id: 'dashed42_5',
            name: 'Tirets 62_5',
            style: [{
                'k': 'stroke',
                'v': 'black'
            }, {
                'k': 'stroke-width',
                'v': '5'
            }, {
                'k': 'fill',
                'v': 'none'
            }, {
                'k': 'stroke-dasharray',
                'v': '30, 10'
            }],
            styleInner: [{
                'k': 'stroke-width',
                'v': '0'
            }, {
                'k': 'fill',
                'v': 'none'
            }]
        },{
            id: 'dashed4212_3',
            name: 'Tirets 4212_3',
            style: [{
                'k': 'stroke',
                'v': 'black'
            }, {
                'k': 'stroke-width',
                'v': '3'
            }, {
                'k': 'fill',
                'v': 'none'
            }, {
                'k': 'stroke-dasharray',
                'v': '12, 6, 3, 6'
            }],
            styleInner: [{
                'k': 'stroke-width',
                'v': '0'
            }, {
                'k': 'fill',
                'v': 'none'
            }]
        },{
            id: 'dashed4212_5',
            name: 'Tirets 4212_5',
            style: [{
                'k': 'stroke',
                'v': 'black'
            }, {
                'k': 'stroke-width',
                'v': '5'
            }, {
                'k': 'fill',
                'v': 'none'
            }, {
                'k': 'stroke-dasharray',
                'v': '20, 10, 5, 10'
            }],
            styleInner: [{
                'k': 'stroke-width',
                'v': '0'
            }, {
                'k': 'fill',
                'v': 'none'
            }]
        }],
        'polygon': [{
            id: 'bighash',
            name: 'Hachures',
            style: [{
                'k': 'fill-pattern',
                'v': 'bighash'
            }]
        },{
            id: 'bighash-45',
            name: 'Hachures -45',
            style: [{
                'k': 'fill-pattern',
                'v': 'bighashm45'
            }]
        },{
            id: 'bighash45',
            name: 'Hachures 45',
            style: [{
                'k': 'fill-pattern',
                'v': 'bighash45'
            }]
        },{
            id: 'smallhash',
            name: 'Petites hachures',
            style: [{
                'k': 'fill-pattern',
                'v': 'smallhash'
            }]
        },{
            id: 'smallhashm45',
            name: 'Petites hachures -45',
            style: [{
                'k': 'fill-pattern',
                'v': 'smallhashm45'
            }]
        },{
            id: 'smallhash45',
            name: 'Petites hachures 45',
            style: [{
                'k': 'fill-pattern',
                'v': 'smallhash45'
            }]
        },{
            id: 'waves',
            name: 'Vagues',
            style: [{
                'k': 'fill-pattern',
                'v': 'waves'
            }]
        },{
            id: 'bigdots',
            name: 'Points',
            style: [{
                'k': 'fill-pattern',
                'v': 'bigdots'
            }]
        },{
            id: 'smalldots',
            name: 'Petits points',
            style: [{
                'k': 'fill-pattern',
                'v': 'smalldots'
            }]
        },{
            id: 'smalldotsthicker',
            name: 'Petits points rapprochés',
            style: [{
                'k': 'fill-pattern',
                'v': 'smalldotsthicker'
            }]
        },{
            id: 'squares45',
            name: 'Quadrillage 45',
            style: [{
                'k': 'fill-pattern',
                'v': 'squares45'
            }]
        },{
            id: 'caps',
            name: 'caps',
            style: [{
                'k': 'fill-pattern',
                'v': 'caps'
            }]
        },{
            id: 'woven',
            name: 'woven',
            style: [{
                'k': 'fill-pattern',
                'v': 'woven'
            }]
        },{
            id: 'solid',
            name: 'Fond uni',
            style: [{
                'k': 'fill-pattern',
                'v': 'solid'
            }]
        }],
        'point': [{
            id: 'smallcircleempty',
            name: 'Petit cercle vide',
            path: editSvg.circlePath,
            radius: 10,
            style: [{
                'k': 'stroke',
                'v': 'black'
            }, {
                'k': 'stroke-width',
                'v': '2'
            },{
                'k': 'fill',
                'v': 'white'
            }]
        },{
            id: 'bigcircleempty',
            name: 'Grand cercle vide',
            path: editSvg.circlePath,
            radius: 18,
            style: [{
                'k': 'stroke',
                'v': 'black'
            }, {
                'k': 'stroke-width',
                'v': '2'
            },{
                'k': 'fill',
                'v': 'white'
            }]
        },{
            id: 'smallcircle',
            name: 'Petit cercle plein',
            path: editSvg.circlePath,
            radius: 10,
            style: [{
                'k': 'stroke',
                'v': 'grey'
            }, {
                'k': 'stroke-width',
                'v': '2'
            },{
                'k': 'fill',
                'v': 'grey'
            }]
        },{
            id: 'bigcircle',
            name: 'Grand cercle',
            path: editSvg.circlePath,
            radius: 18,
            style: [{
                'k': 'stroke',
                'v': 'grey'
            }, {
                'k': 'stroke-width',
                'v': '2'
            },{
                'k': 'fill',
                'v': 'grey'
            }]
        },{
            id: 'circleCross',
            name: 'Cercle croix',
            path: editSvg.circleCrossPath,
            radius: 18,
            style: [{
                'k': 'stroke',
                'v': 'black'
            }, {
                'k': 'stroke-width',
                'v': '2'
            },{
                'k': 'fill',
                'v': 'white'
            }]
        },{
            id: 'ovalempty',
            name: 'Ovale vide',
            path: editSvg.ovalPath,
            radius: 18,
            style: [{
                'k': 'stroke',
                'v': 'black'
            }, {
                'k': 'stroke-width',
                'v': '2'
            },{
                'k': 'fill',
                'v': 'white'
            }]
        },{
            id: 'oval',
            name: 'Ovale',
            path: editSvg.ovalPath,
            radius: 18,
            style: [{
                'k': 'stroke',
                'v': 'grey'
            }, {
                'k': 'stroke-width',
                'v': '2'
            },{
                'k': 'fill',
                'v': 'grey'
            }]
        },{
            id: 'triangleempty',
            name: 'Triangle vide',
            path: editSvg.trianglePath,
            radius: 22,
            style: [{
                'k': 'stroke',
                'v': 'black'
            }, {
                'k': 'stroke-width',
                'v': '2'
            },{
                'k': 'fill',
                'v': 'white'
            }]
        },{
            id: 'triangle',
            name: 'Triangle',
            path: editSvg.trianglePath,
            radius: 22,
            style: [{
                'k': 'stroke',
                'v': 'grey'
            }, {
                'k': 'stroke-width',
                'v': '2'
            },{
                'k': 'fill',
                'v': 'grey'
            }]
        },{
            id: 'squareempty',
            name: 'Carré vide',
            path: editSvg.squarePath,
            radius: 20,
            style: [{
                'k': 'stroke',
                'v': 'black'
            }, {
                'k': 'stroke-width',
                'v': '3'
            },{
                'k': 'fill',
                'v': 'white'
            }]
        },{
            id: 'square',
            name: 'Carré',
            path: editSvg.squarePath,
            radius: 20,
            style: [{
                'k': 'stroke',
                'v': 'grey'
            }, {
                'k': 'stroke-width',
                'v': '2'
            },{
                'k': 'fill',
                'v': 'grey'
            }]
        },{
            id: 'squareDiag',
            name: 'Carré Diag',
            path: editSvg.squareDiagPath,
            radius: 25,
            style: [{
                'k': 'stroke',
                'v': 'black'
            }, {
                'k': 'stroke-width',
                'v': '2'
            },{
                'k': 'fill',
                'v': 'white'
            }]
        },{
            id: 'squareCross',
            name: 'Carré croix',
            path: editSvg.squareCrossPath,
            radius: 25,
            style: [{
                'k': 'stroke',
                'v': 'black'
            }, {
                'k': 'stroke-width',
                'v': '2'
            },{
                'k': 'fill',
                'v': 'white'
            }]
        },{
            id: 'cross',
            name: 'Croix',
            path: editSvg.crossPath,
            radius: 25,
            style: [{
                'k': 'stroke',
                'v': 'black'
            }, {
                'k': 'stroke-width',
                'v': '3'
            },{
                'k': 'fill',
                'v': 'black'
            }]
        },{
            id: 'cross2',
            name: 'Croix2',
            path: editSvg.crossPath,
            radius: 25,
            style: [{
                'k': 'stroke',
                'v': 'black'
            }, {
                'k': 'stroke-width',
                'v': '5'
            },{
                'k': 'fill',
                'v': 'black'
            }]
        },{
            id: 'cross3',
            name: 'Croix3',
            path: editSvg.crossPath,
            radius: 30,
            style: [{
                'k': 'stroke',
                'v': 'black'
            }, {
                'k': 'stroke-width',
                'v': '5'
            },{
                'k': 'fill',
                'v': 'black'
            }]
        },{
            id: 'horizontalRect',
            name: 'horizontalRect',
            path: editSvg.horizontalRectPath,
            radius: 20,
            style: [{
                'k': 'stroke',
                'v': 'black'
            }, {
                'k': 'stroke-width',
                'v': '10'
            },{
                'k': 'fill',
                'v': 'black'
            }]
        },{
            id: 'horizontalArrow',
            name: 'horizontalArrow',
            path: editSvg.horizontalArrowPath,
            radius: 100,
            style: [{
                'k': 'stroke',
                'v': 'grey'
            }, {
                'k': 'stroke-width',
                'v': '4'
            },{
                'k': 'fill',
                'v': 'grey'
            }]
        },{
            id: 'horizontalArrowHash',
            name: 'horizontalArrowHash',
            path: editSvg.horizontalArrowPath,
            radius: 100,
            style: [{
                'k': 'stroke-width',
                'v': '0'
            },{
                'k': 'fill',
                'v': POLYGON_STYLES.smallhashm45.url()
            }]
        },{
            id: 'horizontalArrowDots',
            name: 'horizontalArrowDots',
            path: editSvg.horizontalArrowPath,
            radius: 100,
            style: [{
                'k': 'stroke',
                'v': '#343434'
            }, {
                'k': 'stroke-width',
                'v': '2'
            },{
                'k': 'fill',
                'v': POLYGON_STYLES.smalldotsthicker2.url()
            }]
        },{
            id: 'horizontalArrowMedium',
            name: 'horizontalArrowMedium',
            path: editSvg.horizontalArrowPath,
            radius: 60,
            style: [{
                'k': 'stroke',
                'v': 'grey'
            }, {
                'k': 'stroke-width',
                'v': '4'
            },{
                'k': 'fill',
                'v': 'grey'
            }]
        },{
            id: 'horizontalArrowSmall',
            name: 'horizontalArrowSmall',
            path: editSvg.horizontalSmallArrowPath,
            radius: 30,
            style: [{
                'k': 'stroke',
                'v': 'grey'
            }, {
                'k': 'stroke-width',
                'v': '4'
            },{
                'k': 'fill',
                'v': 'grey'
            }]
        },{
            id: 'northOrientation',
            name: 'Flèche du Nord',
            path: editSvg.northOrientation,
            radius: 30,
            style: [{
                'k': 'stroke',
                'v': 'black'
            }, {
                'k': 'stroke-width',
                'v': '4'
            },{
                'k': 'fill',
                'v': 'none'
            }]
        }]},

        markerStart = [{
            id: 'null',
            name: 'Aucun'
        }, {
            id: 'arrowStartMarker',
            name: 'Flèche'
        }, {
            id: 'straightMarker',
            name: 'Trait'
        }],

        markerStop = [{
            id: 'null',
            name: 'Aucun'
        }, {
            id: 'arrowStopMarker',
            name: 'Flèche'
        }, {
            id: 'straightMarker',
            name: 'Trait'
        }],

        XAPI_URL = 'http://overpass-api.de/api/interpreter?data=',

        ACTIONS = {
            'point': [
                { icon: 'bower_components/material-design-icons/action/svg/production/ic_delete_48px.svg', 
                    action: removeService.removeObject},
                { icon: 'bower_components/material-design-icons/action/svg/production/ic_open_with_48px.svg', 
                    action: moveService.movePath },
                { icon: 'bower_components/material-design-icons/action/svg/production/ic_autorenew_48px.svg', 
                    action: moveService.rotatePath },
                //{ icon: 'bower_components/material-design-icons/image/svg/production/ic_color_lens_48px.svg', action: 'fill' },
                { icon: 'bower_components/material-design-icons/toggle/svg/production/ic_radio_button_checked_48px.svg', 
                    action: styleService.emptyNearFeature },
                { icon: 'bower_components/material-design-icons/av/svg/production/ic_hearing_48px.svg', 
                    action: interactService.addInteraction }
            ],
            'line': [
                { icon: 'bower_components/material-design-icons/action/svg/production/ic_delete_48px.svg', 
                    action: removeService.removeObject },
                { icon: 'bower_components/material-design-icons/editor/svg/production/ic_linear_scale_48px.svg', 
                    action: moveService.movePoint },
                { icon: 'bower_components/material-design-icons/action/svg/production/ic_trending_flat_48px.svg', 
                    action: styleService.toggleArrow },
                { icon: 'bower_components/material-design-icons/toggle/svg/production/ic_radio_button_checked_48px.svg', 
                    action: styleService.emptyNearFeature },
                { icon: 'bower_components/material-design-icons/action/svg/production/ic_rounded_corner_48px.svg', 
                    action: geometryService.lineToCardinal }
            ],
            'polygon': [
                { icon: 'bower_components/material-design-icons/action/svg/production/ic_delete_48px.svg', 
                    action: removeService.removeObject },
                { icon: 'bower_components/material-design-icons/editor/svg/production/ic_linear_scale_48px.svg', 
                    action: moveService.movePoint },
                { icon: 'bower_components/material-design-icons/image/svg/production/ic_texture_48px.svg', 
                    action: styleService.changePattern },
                { icon: 'bower_components/material-design-icons/image/svg/production/ic_color_lens_48px.svg', 
                    action: styleService.changeColor },
                { icon: 'bower_components/material-design-icons/toggle/svg/production/ic_radio_button_checked_48px.svg', 
                    action: styleService.emptyNearFeature },
                { icon: 'bower_components/material-design-icons/image/svg/production/ic_crop_din_48px.svg', 
                    action: styleService.toggleStroke }
            ],
            'circle': [
                { icon: 'bower_components/material-design-icons/action/svg/production/ic_delete_48px.svg', 
                    action: removeService.removeObject },
                { icon: 'bower_components/material-design-icons/image/svg/production/ic_texture_48px.svg', 
                    action: styleService.changePattern },
                { icon: 'bower_components/material-design-icons/image/svg/production/ic_color_lens_48px.svg', 
                    action: styleService.changeColor },
                { icon: 'bower_components/material-design-icons/toggle/svg/production/ic_radio_button_checked_48px.svg', 
                    action: styleService.emptyNearFeature },
                { icon: 'bower_components/material-design-icons/image/svg/production/ic_crop_din_48px.svg', 
                    action: styleService.toggleStroke }
            ],
            'text': [
                { icon: 'bower_components/material-design-icons/action/svg/production/ic_delete_48px.svg', 
                    action: removeService.removeObject },
                { icon: 'bower_components/material-design-icons/toggle/svg/production/ic_radio_button_checked_48px.svg', 
                    action: styleService.textEmptyNearFeature }
            ]
        };

        // Public API here
        return {
            XAPI_URL: XAPI_URL,
            FONTS: FONTS,
            COLORS: COLORS,
            FORMATS: FORMATS,
            QUERY_LIST: QUERY_LIST,
            POLYGON_STYLES: POLYGON_STYLES,
            STYLES: STYLES,
            ACTIONS: ACTIONS,
            markerStart: markerStart,
            markerStop: markerStop,
            leaflet: leafletConf,
            ratioPixelPoint: ratioPixelPoint
        };
    }

    angular.module('accessimapEditeurDerApp')
        .factory('settings', settings);

    settings.$inject = ['editSvg', 'remove', 'interact', 'style', 'move', 'geometry'];

})();