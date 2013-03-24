var RideController = function($scope, $http, $rootScope, $navigate, localStorageService, geolocation, dateFilter) {

  $scope.trip = []
  $scope._point = {}
  $scope.rideId = 'ride:'+ new Date().getTime()
  
  var _rides = JSON.parse(localStorageService.get('r_'))||[]
  _rides.push($scope.rideId)
  localStorageService.add('r_', JSON.stringify(_rides))

  $rootScope.$on('Location.position', function(e, data) {
    $scope.locationSuccess(data)
  })

  $scope.watch = function() {
    geolocation.watchPosition()
  }

  $scope.stop = function() {
    geolocation.clearWatch()
  }

  $scope.locationSuccess = function(data) {
    console.log('+ updating position', data)
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
    localStorageService.add($scope.rideId, JSON.stringify($scope.trip))
  }

  $scope.getTime = function(time) {
    return dateFilter(time, 'H:mm:ss')
  }

  $scope.deg2rad = function(deg) {
    console.log('-deg2rad')
    return deg * (Math.PI/180)
  }

  $scope.getDistanceKm = function(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = $scope.deg2rad(lat2-lat1);  // deg2rad below
    var dLon = $scope.deg2rad(lon2-lon1); 
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos($scope.deg2rad(lat1)) * Math.cos($scope.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d.toFixed(2);
  }

  $scope.getDistance = function(stage) {
    var idx = $scope.trip.indexOf(stage)
    if(idx < 2) return 0
    var p1 = $scope.trip[idx-1]
    var p2 = $scope.trip[idx]
    var lat1 = p1.lat
    var lng1 = p1.lng
    var lat2 = p2.lat
    var lng2 = p2.lng
    console.log(lat1,lng1,lat2,lng2)
    return $scope.getDistanceKm(lat1, lng1, lat2, lng2)
  }



}