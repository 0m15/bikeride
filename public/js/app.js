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

var MainController = function($scope, $navigate) {
  $scope.navigate = $navigate
}