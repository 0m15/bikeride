bikerider.factory('geolocation', ['$rootScope', 
  function(rootScope) {
  var geolocation = new Geolocation(rootScope)
  return geolocation
}])

var Geolocation = function(rootScope) {
  this.rootScope = rootScope
  this.watchId = 0
  this.watchInterval = 1000 * 10 // 10 secs
}

Geolocation.prototype = {

  locate: function() {
    this.rootScope.$broadcast('Spinner.msg', 'getting your position')
    if(this.watchId) this.clearWatch()
    navigator.geolocation.getCurrentPosition(angular.bind(this, this.onPosition), this.onError)
  },

  watchPosition: function() {
    if(this.watchId) this.clearWatch()
    this.watchId = navigator.geolocation.watchPosition(angular.bind(this, this.onPosition), this.onError, { maximumAge: this.watchInterval})
  },

  clearWatch: function() {
    if(!this.watchId) return
    navigator.geolocation.clearWatch(this.watchId)
  },

  onPosition: function(data) {
    console.log('onPosition', this.rootScope)
    this.rootScope.$broadcast('Location.position', data)
  },

  onError: function(err) {
    this.rootScope.$broadcast('Location.error', err)
  }

}