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
    var now = null
    var diff = {
      hours: function(t2,t1) {
        return pad(Math.floor(((t2-t1) / (1000 * 3600)) % 24))
      },
      minutes: function(t2,t1) {
        return pad(Math.floor(((t2-t1) / (1000 * 60)) % 60))
      },
      seconds: function(t2,t1) {
        return pad(Math.floor(((t2-t1) / 1000) % 60))
      },
      tenths: function(t2,t1) {
        return pad(Math.floor(((t2-t1) / 100) % 10))
      }
    }
    var pad = function(num, size) {
      size || (size = 2)
      var s = num+""
      if(num < 10) s = "0" + num
      return s
    }
    return function(scope, el, attrs) {
      this.interval = setInterval(function() {
        now = new Date().getTime()
        var hh = diff.hours(now,start),
            mm = diff.minutes(now,start),
            ss = diff.seconds(now,start),
            tt = diff.tenths(now,start)
        el.text(hh + ':' + mm + ':' + ss + ':' + tt)
      }, 100)
    }
  })

var MainController = function($scope, $navigate) {
  $scope.navigate = $navigate
}