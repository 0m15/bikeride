var RideController = function($scope, $rootScope, $http, rides, localStorageService, geolocation, dateFilter) {

  $scope.ride = new Ride()
  $scope.ride.id = 'ride:'+ new Date().getTime()
  $scope.watching = false
  $scope.point = {}
  $scope.trip = []
  $scope.position = null
  $scope.counter = 10
  
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
    $scope.position = data.coords
    if(!$scope.$$phase) $scope.$apply()
    $scope.ride.setData($scope.trip)
    rides.put($scope.ride, $scope.trip)
    $scope.distance = $scope.ride.getTotalDistance()
    $scope.speed = $scope.ride.getAverageSpeed()
    console.log($scope.ride)
    //console.log('added', $scope.ride, $scope.trip)
    //$scope.$emit('Location.position', data)
    console.log($scope.counter)
    if($scope.counter % 5 == 0) $scope.getPicture()
    $scope.counter += 1
  }

  // picture
  // ------------------------------
  $scope.getPicture = function() {

    var minlat = parseFloat($scope.position.latitude.toFixed(2)) - 0.003 //41.8
    var lat = parseFloat($scope.position.latitude.toFixed(2)) + 0.003 //41.9
    var minlng = parseFloat($scope.position.longitude.toFixed(2)) - 0.003
    var lng = parseFloat($scope.position.longitude.toFixed(2)) + 0.003
    var base = 'http://www.panoramio.com/map/get_panoramas.php'
    var q = '?set=public&from=0&to=10&minx='+minlng+'&miny='+minlat+'&maxx='+lng+'&maxy='+lat+'&size=original&mapfilter=true&callback=JSON_CALLBACK'


    $http.jsonp(base+q, [], {cache: true }).success(function(data) {
      if(!data.photos.length) {
        return
      }
      console.log(data)
      var idx = Math.floor(Math.random() * data.photos.length)
      $rootScope.background = data.photos[idx].photo_file_url
      $rootScope.locationDescription = data.photos[idx].photo_title

    })
  }

  $scope.getTime = function(time) {
    return dateFilter(time, 'H:mm:ss')
  }
}