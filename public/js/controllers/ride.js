var RideController = function($scope, $rootScope, rides, localStorageService, geolocation, dateFilter) {

  $scope.ride = new Ride()
  $scope.ride.id = 'ride:'+ new Date().getTime()
  $scope.watching = false
  $scope._point = {}
  $scope.trip = []
  
  var _rides = JSON.parse(localStorageService.get('r_'))||[]
  _rides.push($scope.ride.id)
  localStorageService.add('r_', JSON.stringify(_rides))

  $rootScope.$on('Location.position', function(e, data) {
    if($scope.watching) $scope.locationSuccess(data)
  })

  $scope.watch = function() {
    geolocation.watchPosition()
    $scope.watching = true
  }

  $scope.stop = function() {
    geolocation.clearWatch()
    $scope.watching = false
  }

  $scope.locationSuccess = function(data) {
    if(!$scope.watching) return

    var coords = data.coords
    var point = { 
      lat: coords.latitude, 
      lng: coords.longitude,
      time: new Date(),
      speed: coords.speed,
    }

    //if($scope._point && $scope._point.lat.toFixed(7) == point.lat.toFixed(7) && $scope._point.lng.toFixed(7) == point.lng ) return

    $scope.trip.push(point)
    if(!$scope.$$phase) $scope.$apply()
    $scope._point = point
    rides.put($scope.ride, $scope.trip)
    //localStorageService.add($scope.rideId, JSON.stringify($scope.trip))
  }

  $scope.getTime = function(time) {
    return dateFilter(time, 'H:mm:ss')
  }
}