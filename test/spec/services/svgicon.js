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

  describe('svgIcon, when called with a line', function() {

    it('should return the right style', function() {
      var $injector = angular.injector(['ng', 'accessimapEditeurDerApp']);
      var settings = $injector.get('settings');
      var linesettings = settings.STYLES.line[0];
      expect(svgicon.featureIcon(linesettings, 'line')).toBe('<svg height="40"><g><line x1="0" y1="15" x2="250" y2="15" fill="none" stroke="black" stroke-width="2"></line><line x1="0" y1="15" x2="250" y2="15" fill="none" stroke-width="0"></line></g></svg>');
    });

  });

  describe('svgIcon, when called with a point', function() {

    it('should return the right style', function() {
      var $injector = angular.injector(['ng', 'accessimapEditeurDerApp']);
      var settings = $injector.get('settings');
      var pointsettings = settings.STYLES.point[0];
      expect(svgicon.featureIcon(pointsettings, 'point')).toBe('<svg height="40"><g><path d="M 20 20 m -10, 0 a 10,10 0 1,0 20,0 a 10,10 0 1,0 -20,0" stroke="black" stroke-width="2" fill="none"></path></g></svg>');
    });

  });


});
