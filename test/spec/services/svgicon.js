'use strict';

describe('Service: svgicon', function () {

  // load the service's module
  beforeEach(module('accessimapEditeurDerApp'));

  // instantiate service
  var svgicon;
  beforeEach(inject(function (_svgicon_) {
    svgicon = _svgicon_;
  }));

  it('should do something', function () {
    expect(!!svgicon).toBe(true);
  });

  it('should do coucou', function() {
    var $injector = angular.injector(['accessimapEditeurDerApp']);
    var settings = $injector.get('settings');
    var linesettings = settings.STYLES.line[0];
    expect(svgicon.featureIcon(linesettings, 'line')).toBe('<svg height="30"><g><line x1="0" y1="15" x2="250" y2="15" fill="none" stroke="black" stroke-width="2"></line><line x1="0" y1="15" x2="250" y2="15" fill="none" stroke-width="0"></line></g></svg>');
  });

});
