var RideMap = function($scope, $routeParams, $rootScope, localStorageService) {
  console.log($routeParams)
  
  $scope.ride = JSON.parse(localStorageService.get($routeParams.ride_id))
  $scope.markers = [];
  
  $scope.drawRoute = function() {
    var route = [], point, routePath
    angular.forEach($scope.ride, function(stage) {
      console.log('point', stage.lat, stage.lng)
      route.push(new google.maps.LatLng(stage.lat, stage.lng))
    })
    routePath = new google.maps.Polyline({
      path: route,
      strokeColor: "#444",
      strokeOpacity: .9,
      strokeWeight: 3.0,
    })
    routePath.setMap($scope.myMap)
  }

  $scope.$watch($scope.myMap, function() {
    console.log('myMap', $scope.myMap)
    $scope.drawRoute()
    google.maps.event.trigger($scope.myMap, 'resize')
  })

  $scope.$on('$destroy', function() {
    delete $scope.myMap
  })

  $scope.mapOptions = { 
    center: new google.maps.LatLng($scope.ride[0].lat, $scope.ride[0].lng),
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    disableDefaultUI: true,
  }
   
  $scope.addMarker = function($event) {
    $scope.markers.push(new google.maps.Marker({
      map: $scope.myMap,
      position: $event.latLng
    }))
  }
   
  $scope.setZoomMessage = function(zoom) {
    $scope.zoomMessage = 'You just zoomed to '+zoom+'!'
    console.log(zoom,'zoomed')
  }
   
  $scope.openMarkerInfo = function(marker) {
    $scope.currentMarker = marker
    $scope.currentMarkerLat = marker.getPosition().lat()
    $scope.currentMarkerLng = marker.getPosition().lng()
    $scope.myInfoWindow.open($scope.myMap, marker)
  };
   
  $scope.setMarkerPosition = function(marker, lat, lng) {
    marker.setPosition(new google.maps.LatLng(lat, lng));
  };

}