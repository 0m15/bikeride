var RideDetail = function($scope, $routeParams, $rootScope, rides, localStorageService) {
  console.log($routeParams.ride_id)
  $scope.ride = rides.get($routeParams.ride_id)
  console.log($scope.ride)
}