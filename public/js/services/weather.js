bikerider.factory('weatherService', ['$rootScope', '$http', 'localStorageService',
  function($rootScope, $http, localStorageService) {
  
  var weatherService = new WeatherService($rootScope, $http, localStorageService)
  return weatherService
}])

var WeatherService = function(rootScope, http, localStorageService) {
  this.rootScope = rootScope
  this.http = http
  this.localStorage = localStorageService
  return this
}

WeatherService.prototype = {

  getWeather: function(lat, lng) {

    if(!navigator.onLine) {
      rootScope.temp = "n.d."
      rootScope.icon = "bike"
      return
    }

    var BASE_URL = 'http://api.wunderground.com/api/d4d5fb876ec15c06/geolookup/conditions/q/'
    var latlng = lat + ',' + lng
    var rootScope = this.rootScope
    var _this = this
    this.http.jsonp(BASE_URL + latlng + '.json?callback=JSON_CALLBACK', [], {cache: true})
         .success(function(data) {
          var w = data.current_observation
          rootScope.town = w.display_location.city
          rootScope.weather = w.weather
          rootScope.temp = w.temp_c
          rootScope.wind_kph = w.wind_kph
          rootScope.icon = w.icon
          rootScope.humidity = w.relative_humidity
          rootScope.$emit('Spinner.msg', 'getting background picture')
          _this.setCache(data)
    })
  },

  setCache: function(data) {
    var KEY = 'weather'
    //localStorage.add(KEY, JSON.stringify(data))
  },

  getCache: function(key) {
    return JSON.parse(localStorage.get(key))
  }
}