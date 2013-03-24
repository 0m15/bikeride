var RidesController = function($scope, rides) {
  $scope.history = rides.all()
}