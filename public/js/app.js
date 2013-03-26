var bikerider = angular.module('bikerider', ['ui', 'mobile-navigate', 'LocalStorageModule']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/home.html', 
        controller: HomeController 
      })  
      .when('/ride', {
        templateUrl: 'partials/ride.html', 
        controller: RideController, 
        transition: 'slide' 
      })  
      .when('/history', {
        templateUrl: 'partials/rides.html', 
        controller: RidesController, 
        transition: 'slide' 
      })  
      .when('/history/:ride_id', {
        templateUrl: 'partials/rideDetail.html', 
        controller: RideDetail, 
        transition: 'slide' 
      })
      .when('/history/:ride_id/map', {
        templateUrl: 'partials/rideMap.html', 
        controller: RideMap, 
        transition: 'modal' 
      })  
  }])
  .run(function($route, $http, $templateCache) {
    angular.forEach($route.routes, function(r) {
      if (r.templateUrl) { 
        $http.get(r.templateUrl, {cache: $templateCache})
      }
    })
  })
  .directive('ngTap', function() {
    var isTouchDevice = !!("ontouchstart" in window)
    return function(scope, elm, attrs) {
      if (isTouchDevice) {
        var tapping = false;
        elm.bind('touchstart', function() { tapping = true; });
        elm.bind('touchmove', function() { tapping = false; });
        elm.bind('touchend', function() { 
          tapping && scope.$apply(attrs.ngTap)
        });
      } else {
        elm.bind('click', function() {
          scope.$apply(attrs.ngTap)
        })
      }
    }
  })
  .directive('chrono', function() {
    var start = new Date().getTime()
    return function(scope, el, attrs) {
      this.interval = setInterval(function() {
        
      }, 1000)
    }
  })

var MainController = function($scope, $navigate) {
  $scope.navigate = $navigate
}