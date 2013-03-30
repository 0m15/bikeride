var RideController = function($scope, $rootScope, rides, localStorageService, geolocation, dateFilter) {

  $scope.ride = new Ride()
  $scope.ride.id = 'ride:'+ new Date().getTime()
  $scope.watching = false
  $scope.point = {}
  $scope.trip = []
  
  if(!$rootScope.background) $rootScope.background = 'http://www.marcobreier.com/wp/wp-content/uploads/2011/06/urban_ny_street_1.jpg'

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

    $scope.trip.push(point)
    if(!$scope.$$phase) $scope.$apply()
    $scope.point = point
    $scope.distance = $scope.ride.getTotalDistance()
    if(!$scope.$$phase) $scope.$apply()
    rides.put($scope.ride, $scope.trip)
    console.log('added', $scope.ride, $scope.trip)
  }

  $scope.getTime = function(time) {
    return dateFilter(time, 'H:mm:ss')
  }
}