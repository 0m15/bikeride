var HomeController = function($scope, $http, $rootScope, geolocation, weatherService, $navigate) {
  console.log('+ HomeController', geolocation.getPosition)

  $rootScope.$on('Location.position', function(e, data) {
    $scope.locationSuccess(data)
  })

  // geolocation
  // ----------------------------
  $scope.geolocate = function() {
    if($rootScope.position && $rootScope.position.latitude) return
    geolocation.locate()
  }

  $scope.locationSuccess = function(data) {
    if($rootScope.position && $rootScope.position.latitude) return
    $rootScope.position = data.coords
    if(!$scope.$$phase) $scope.$apply()
    weatherService.getWeather($rootScope.position.latitude, $rootScope.position.longitude)
    $scope.getPicture()
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

    if(!navigator.onLine) {
      $rootScope.background = "img/bike.svg"
    }

    $http.jsonp(base+q, [], {cache: true }).success(function(data) {
      if(!data.photos) {
        $rootScope.background = "img/bike.svg"
        return
      }
      var idx = 0 //Math.floor(Math.random() * data.photos.length)
      $rootScope.background = data.photos[idx].photo_file_url
    })
  }

}