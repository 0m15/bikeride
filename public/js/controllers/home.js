var HomeController = function($scope, $http, $rootScope, geolocation, weatherService, $navigate) {
  console.log('+ HomeController', geolocation.getPosition)

  $rootScope.$on('Location.position', function(e, data) {
    $scope.locationSuccess(data)
  })

  // geolocation
  // ----------------------------
  $scope.geolocate = function() {
    console.log('location')
    if($rootScope.position && $rootScope.position.latitude) return
    geolocation.locate()
  }

  $scope.locationSuccess = function(data) {
    if($rootScope.position && $rootScope.position.latitude) return
    $rootScope.position = data.coords
    // $scope.position = { latitude: 45.4457348, longitude: 9.158210000000054 } // milan via malaga
    // $scope.position = { latitude: 41.4635924, longitude: 15.542589799999973 } // foggia via arpi
    // $scope.position = { latitude: 41.9064985, longitude: 12.484470299999998 } // rome piazza di spagna
    // $scope.position = { latitude: 45.0627425, longitude: 7.650455400000055 } // torino b.go san paolo
    if(!$scope.$$phase) $scope.$apply()
    weatherService.getWeather($scope.position.latitude, $scope.position.longitude)
    $scope.getPicture()
  }

  // picture
  // ------------------------------
  $scope.getPicture = function() {
    console.log('+ get picture')

    var minlat = parseFloat($scope.position.latitude.toFixed(2)) - 0.003 //41.8
    var lat = parseFloat($scope.position.latitude.toFixed(2)) + 0.003 //41.9
    var minlng = parseFloat($scope.position.longitude.toFixed(2)) - 0.003
    var lng = parseFloat($scope.position.longitude.toFixed(2)) + 0.003
    var base = 'http://www.panoramio.com/map/get_panoramas.php'
    var q = '?set=public&from=0&to=10&minx='+minlng+'&miny='+minlat+'&maxx='+lng+'&maxy='+lat+'&size=original&mapfilter=true&callback=JSON_CALLBACK'

    $http.jsonp(base+q, [], {cache: true }).success(function(data) {
      console.log('+panoramio', data)
      $rootScope.background = data.photos[0].photo_file_url
    })
  }

}