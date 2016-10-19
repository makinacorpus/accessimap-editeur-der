// jscs:disable maximumNumberOfLines 
// jscs:disable maximumLineLength
/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.SettingsStyles
 * @description
 */
(function() {
    'use strict';

    function SettingsStyles(SVGService) {

        var POLYGON_STYLES = {
            'bighash': textures.lines().id('bighash').orientation('vertical'),
            'bighashm45': textures.lines().id('bighashm45').orientation('6/8'),
            'bighash45': textures.lines().id('bighash45').orientation('2/8'),
            'smallhash': textures.lines().id('smallhash').orientation('vertical').thicker(),
            'smallhashm45': textures.lines().id('smallhashm45').orientation('6/8').thicker(),
            'smallhash45': textures.lines().id('smallhash45').orientation('2/8').thicker(),
            'waves': textures.paths().id('waves').d('waves'),
            'smalldots': textures.circles().id('smalldots').complement(),
            'smalldotsline': textures.circles().id('smalldotsline').lighter().thicker().complement().strokeWidth(1.1).background('white'),
            'smalldotsthicker': textures.circles().id('smalldotsthicker').lighter().thicker().complement().strokeWidth(1.1),
            'smalldotsthicker2': textures.circles().id('smalldotsthicker2').lighter().thicker().complement().strokeWidth(1.3),
            'bigdots': textures.circles().id('bigdots').fill('grey').heavier().complement(),
            'squares45': textures.lines().id('squares45').orientation('2/8', '6/8').size(20).strokeWidth(1),
            'caps': textures.paths().id('caps').d('caps'),
            'woven': textures.paths().id('woven').d('woven'),
            'solid': textures.lines().id('solid').strokeWidth(0),
            'bighash_white': textures.lines().id('bighash_white').orientation('vertical').background('white'),
            'bighashm45_white': textures.lines().id('bighashm45_white').orientation('6/8').background('white'),
            'bighash45_white': textures.lines().id('bighash45_white').orientation('2/8').background('white'),
            'smallhash_white': textures.lines().id('smallhash_white').orientation('vertical').thicker().background('white'),
            'smallhashm45_white': textures.lines().id('smallhashm45_white').orientation('6/8').thicker().background('white'),
            'smallhash45_white': textures.lines().id('smallhash45_white').orientation('2/8').thicker().background('white'),
            'waves_white': textures.paths().id('waves_white').d('waves').background('white'),
            'smalldots_white': textures.circles().id('smalldots_white').complement().background('white'),
            'smalldotsline_white': textures.circles().id('smalldotsline_white').lighter().thicker().complement().strokeWidth(1.1).background('white'),
            'smalldotsthicker_white': textures.circles().id('smalldotsthicker_white').lighter().thicker().complement().strokeWidth(1.1).background('white'),
            'smalldotsthicker2_white': textures.circles().id('smalldotsthicker2_white').lighter().thicker().complement().strokeWidth(1.3).background('white'),
            'bigdots_white': textures.circles().id('bigdots_white').fill('grey').heavier().complement().background('white'),
            'squares45_white': textures.lines().id('squares45_white').orientation('2/8', '6/8').size(20).strokeWidth(1).background('white'),
            'caps_white': textures.paths().id('caps_white').d('caps').background('white'),
            'woven_white': textures.paths().id('woven_white').d('woven').background('white'),
            'solid_white': textures.lines().id('solid_white').strokeWidth(0).background('white'),
            'bighash_blue': textures.lines().id('bighash_blue').orientation('vertical').background('blue'),
            'bighashm45_blue': textures.lines().id('bighashm45_blue').orientation('6/8').background('blue'),
            'bighash45_blue': textures.lines().id('bighash45_blue').orientation('2/8').background('blue'),
            'smallhash_blue': textures.lines().id('smallhash_blue').orientation('vertical').thicker().background('blue'),
            'smallhashm45_blue': textures.lines().id('smallhashm45_blue').orientation('6/8').thicker().background('blue'),
            'smallhash45_blue': textures.lines().id('smallhash45_blue').orientation('2/8').thicker().background('blue'),
            'waves_blue': textures.paths().id('waves_blue').d('waves').background('blue'),
            'smalldots_blue': textures.circles().id('smalldots_blue').complement().background('blue'),
            'smalldotsline_blue': textures.circles().id('smalldotsline_blue').lighter().thicker().complement().strokeWidth(1.1).background('blue'),
            'smalldotsthicker_blue': textures.circles().id('smalldotsthicker_blue').lighter().thicker().complement().strokeWidth(1.1).background('blue'),
            'smalldotsthicker2_blue': textures.circles().id('smalldotsthicker2_blue').lighter().thicker().complement().strokeWidth(1.3).background('blue'),
            'bigdots_blue': textures.circles().id('bigdots_blue').fill('grey').heavier().complement().background('blue'),
            'squares45_blue': textures.lines().id('squares45_blue').orientation('2/8', '6/8').size(20).strokeWidth(1).background('blue'),
            'caps_blue': textures.paths().id('caps_blue').d('caps').background('blue'),
            'woven_blue': textures.paths().id('woven_blue').d('woven').background('blue'),
            'solid_blue': textures.lines().id('solid_blue').strokeWidth(0).background('blue'),
            'bighash_cyan': textures.lines().id('bighash_cyan').orientation('vertical').background('cyan'),
            'bighashm45_cyan': textures.lines().id('bighashm45_cyan').orientation('6/8').background('cyan'),
            'bighash45_cyan': textures.lines().id('bighash45_cyan').orientation('2/8').background('cyan'),
            'smallhash_cyan': textures.lines().id('smallhash_cyan').orientation('vertical').thicker().background('cyan'),
            'smallhashm45_cyan': textures.lines().id('smallhashm45_cyan').orientation('6/8').thicker().background('cyan'),
            'smallhash45_cyan': textures.lines().id('smallhash45_cyan').orientation('2/8').thicker().background('cyan'),
            'waves_cyan': textures.paths().id('waves_cyan').d('waves').background('cyan'),
            'smalldots_cyan': textures.circles().id('smalldots_cyan').complement().background('cyan'),
            'smalldotsline_cyan': textures.circles().id('smalldotsline_cyan').lighter().thicker().complement().strokeWidth(1.1).background('cyan'),
            'smalldotsthicker_cyan': textures.circles().id('smalldotsthicker_cyan').lighter().thicker().complement().strokeWidth(1.1).background('cyan'),
            'smalldotsthicker2_cyan': textures.circles().id('smalldotsthicker2_cyan').lighter().thicker().complement().strokeWidth(1.3).background('cyan'),
            'bigdots_cyan': textures.circles().id('bigdots_cyan').fill('grey').heavier().complement().background('cyan'),
            'squares45_cyan': textures.lines().id('squares45_cyan').orientation('2/8', '6/8').size(20).strokeWidth(1).background('cyan'),
            'caps_cyan': textures.paths().id('caps_cyan').d('caps').background('cyan'),
            'woven_cyan': textures.paths().id('woven_cyan').d('woven').background('cyan'),
            'solid_cyan': textures.lines().id('solid_cyan').strokeWidth(0).background('cyan'),
            'bighash_red': textures.lines().id('bighash_red').orientation('vertical').background('red'),
            'bighashm45_red': textures.lines().id('bighashm45_red').orientation('6/8').background('red'),
            'bighash45_red': textures.lines().id('bighash45_red').orientation('2/8').background('red'),
            'smallhash_red': textures.lines().id('smallhash_red').orientation('vertical').thicker().background('red'),
            'smallhashm45_red': textures.lines().id('smallhashm45_red').orientation('6/8').thicker().background('red'),
            'smallhash45_red': textures.lines().id('smallhash45_red').orientation('2/8').thicker().background('red'),
            'waves_red': textures.paths().id('waves_red').d('waves').background('red'),
            'smalldots_red': textures.circles().id('smalldots_red').complement().background('red'),
            'smalldotsline_red': textures.circles().id('smalldotsline_red').lighter().thicker().complement().strokeWidth(1.1).background('red'),
            'smalldotsthicker_red': textures.circles().id('smalldotsthicker_red').lighter().thicker().complement().strokeWidth(1.1).background('red'),
            'smalldotsthicker2_red': textures.circles().id('smalldotsthicker2_red').lighter().thicker().complement().strokeWidth(1.3).background('red'),
            'bigdots_red': textures.circles().id('bigdots_red').fill('grey').heavier().complement().background('red'),
            'squares45_red': textures.lines().id('squares45_red').orientation('2/8', '6/8').size(20).strokeWidth(1).background('red'),
            'caps_red': textures.paths().id('caps_red').d('caps').background('red'),
            'woven_red': textures.paths().id('woven_red').d('woven').background('red'),
            'solid_red': textures.lines().id('solid_red').strokeWidth(0).background('red'),
            'bighash_yellow': textures.lines().id('bighash_yellow').orientation('vertical').background('yellow'),
            'bighashm45_yellow': textures.lines().id('bighashm45_yellow').orientation('6/8').background('yellow'),
            'bighash45_yellow': textures.lines().id('bighash45_yellow').orientation('2/8').background('yellow'),
            'smallhash_yellow': textures.lines().id('smallhash_yellow').orientation('vertical').thicker().background('yellow'),
            'smallhashm45_yellow': textures.lines().id('smallhashm45_yellow').orientation('6/8').thicker().background('yellow'),
            'smallhash45_yellow': textures.lines().id('smallhash45_yellow').orientation('2/8').thicker().background('yellow'),
            'waves_yellow': textures.paths().id('waves_yellow').d('waves').background('yellow'),
            'smalldots_yellow': textures.circles().id('smalldots_yellow').complement().background('yellow'),
            'smalldotsline_yellow': textures.circles().id('smalldotsline_yellow').lighter().thicker().complement().strokeWidth(1.1).background('yellow'),
            'smalldotsthicker_yellow': textures.circles().id('smalldotsthicker_yellow').lighter().thicker().complement().strokeWidth(1.1).background('yellow'),
            'smalldotsthicker2_yellow': textures.circles().id('smalldotsthicker2_yellow').lighter().thicker().complement().strokeWidth(1.3).background('yellow'),
            'bigdots_yellow': textures.circles().id('bigdots_yellow').fill('grey').heavier().complement().background('yellow'),
            'squares45_yellow': textures.lines().id('squares45_yellow').orientation('2/8', '6/8').size(20).strokeWidth(1).background('yellow'),
            'caps_yellow': textures.paths().id('caps_yellow').d('caps').background('yellow'),
            'woven_yellow': textures.paths().id('woven_yellow').d('woven').background('yellow'),
            'solid_yellow': textures.lines().id('solid_yellow').strokeWidth(0).background('yellow'),
            'bighash_limegreen': textures.lines().id('bighash_limegreen').orientation('vertical').background('limegreen'),
            'bighashm45_limegreen': textures.lines().id('bighashm45_limegreen').orientation('6/8').background('limegreen'),
            'bighash45_limegreen': textures.lines().id('bighash45_limegreen').orientation('2/8').background('limegreen'),
            'smallhash_limegreen': textures.lines().id('smallhash_limegreen').orientation('vertical').thicker().background('limegreen'),
            'smallhashm45_limegreen': textures.lines().id('smallhashm45_limegreen').orientation('6/8').thicker().background('limegreen'),
            'smallhash45_limegreen': textures.lines().id('smallhash45_limegreen').orientation('2/8').thicker().background('limegreen'),
            'waves_limegreen': textures.paths().id('waves_limegreen').d('waves').background('limegreen'),
            'smalldots_limegreen': textures.circles().id('smalldots_limegreen').complement().background('limegreen'),
            'smalldotsline_limegreen': textures.circles().id('smalldotsline_limegreen').lighter().thicker().complement().strokeWidth(1.1).background('limegreen'),
            'smalldotsthicker_limegreen': textures.circles().id('smalldotsthicker_limegreen').lighter().thicker().complement().strokeWidth(1.1).background('limegreen'),
            'smalldotsthicker2_limegreen': textures.circles().id('smalldotsthicker2_limegreen').lighter().thicker().complement().strokeWidth(1.3).background('limegreen'),
            'bigdots_limegreen': textures.circles().id('bigdots_limegreen').fill('grey').heavier().complement().background('limegreen'),
            'squares45_limegreen': textures.lines().id('squares45_limegreen').orientation('2/8', '6/8').size(20).strokeWidth(1).background('limegreen'),
            'caps_limegreen': textures.paths().id('caps_limegreen').d('caps').background('limegreen'),
            'woven_limegreen': textures.paths().id('woven_limegreen').d('woven').background('limegreen'),
            'solid_limegreen': textures.lines().id('solid_limegreen').strokeWidth(0).background('limegreen'),
            'bighash_purple': textures.lines().id('bighash_purple').orientation('vertical').background('purple'),
            'bighashm45_purple': textures.lines().id('bighashm45_purple').orientation('6/8').background('purple'),
            'bighash45_purple': textures.lines().id('bighash45_purple').orientation('2/8').background('purple'),
            'smallhash_purple': textures.lines().id('smallhash_purple').orientation('vertical').thicker().background('purple'),
            'smallhashm45_purple': textures.lines().id('smallhashm45_purple').orientation('6/8').thicker().background('purple'),
            'smallhash45_purple': textures.lines().id('smallhash45_purple').orientation('2/8').thicker().background('purple'),
            'waves_purple': textures.paths().id('waves_purple').d('waves').background('purple'),
            'smalldots_purple': textures.circles().id('smalldots_purple').complement().background('purple'),
            'smalldotsline_purple': textures.circles().id('smalldotsline_purple').lighter().thicker().complement().strokeWidth(1.1).background('purple'),
            'smalldotsthicker_purple': textures.circles().id('smalldotsthicker_purple').lighter().thicker().complement().strokeWidth(1.1).background('purple'),
            'smalldotsthicker2_purple': textures.circles().id('smalldotsthicker2_purple').lighter().thicker().complement().strokeWidth(1.3).background('purple'),
            'bigdots_purple': textures.circles().id('bigdots_purple').fill('grey').heavier().complement().background('purple'),
            'squares45_purple': textures.lines().id('squares45_purple').orientation('2/8', '6/8').size(20).strokeWidth(1).background('purple'),
            'caps_purple': textures.paths().id('caps_purple').d('caps').background('purple'),
            'woven_purple': textures.paths().id('woven_purple').d('woven').background('purple'),
            'solid_purple': textures.lines().id('solid_purple').strokeWidth(0).background('purple'),
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
            path: SVGService.circlePath,
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
            path: SVGService.circlePath,
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
            path: SVGService.circlePath,
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
            path: SVGService.circlePath,
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
            path: SVGService.circleCrossPath,
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
            path: SVGService.ovalPath,
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
            path: SVGService.ovalPath,
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
            path: SVGService.trianglePath,
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
            path: SVGService.trianglePath,
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
            path: SVGService.squarePath,
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
            path: SVGService.squarePath,
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
            path: SVGService.squareDiagPath,
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
            path: SVGService.squareCrossPath,
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
            path: SVGService.crossPath,
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
            path: SVGService.crossPath,
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
            path: SVGService.crossPath,
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
            path: SVGService.horizontalRectPath,
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
            path: SVGService.horizontalArrowPath,
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
            path: SVGService.horizontalArrowPath,
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
            path: SVGService.horizontalArrowPath,
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
            path: SVGService.horizontalArrowPath,
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
            path: SVGService.horizontalSmallArrowPath,
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
            path: SVGService.northOrientation,
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
        }]}

        this.POLYGON_STYLES = POLYGON_STYLES;
        this.STYLES         = STYLES;
        this.ALL_STYLES     = STYLES.point.concat(STYLES.polygon.concat(STYLES.line));

    }

    angular.module(moduleApp).service('SettingsStyles', SettingsStyles);

    SettingsStyles.$inject = ['SVGService']

})();