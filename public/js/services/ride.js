bikerider.factory('rides', ['$rootScope', '$routeParams', 'localStorageService',
  function($rootScope, $routeParams, localStorageService) {

    var ALL_RIDES = 'r_'

    return {

      get: function(id) {
        var ride = new Ride(JSON.parse(localStorageService.get(id)))
        ride.id = id
        return ride
      },

      all: function() {
        
        var rideList = JSON.parse(localStorageService.get(ALL_RIDES))||[]
        var i = 0, len = rideList.length, rideId, trip
        var history = []

        for(; i < len; i++) {
          rideId = rideList[i]
          trip = new Ride(JSON.parse(localStorageService.get(rideId)))
          if(!trip) continue
          trip.id = rideId
          history.push(trip)
        }
        return history
      },
    }
  }
])

function Ride(data) {
  this.data = data
  return this
}

Ride.prototype = {
  
  getTotalTime: function(formatted) {
    if(!this.data || this.data.length == 1) return '00:00:00'
    console.log('- getTotalTime')
    var time1 = moment(this.data[0].time)
    var time2 = moment(this.data[this.data.length - 1].time)
    var h = time2.diff(time1, 'hours')
    var m = time2.diff(time1, 'minutes')
    var s = time2.diff(time1, 'seconds') % 60
      
    if(!formatted) {
      console.log(time2.diff(time1, 'seconds'))
      return time2.diff(time1, 'seconds')
    }

    var format = function(val) {
      val = val < 10 ? '0' + val : val
      return val
    }

    return format(h) + ':' + format(m) + ':' + format(s)
  },


  getAverageSpeed: function(unit) {
    unit||(unit='kmh')
    var multiplier
    var divider = 1
    if(unit == 'kmh') multiplier = 3600
    if(unit == 'ms') multiplier = 1, divider = 1000
    var speed = this.getTotalDistance() * divider / this.getTotalTime(false) * multiplier
    return speed.toFixed(4)
  },

  getDate: function() {
    if(!this.data) return
    return moment(this.data[0].time).format('dddd D, MMM YYYY')
  },

  getTotalDistance: function() {
    if(!this.data || this.length < 1) return '0.000'
    var len = this.data.length - 1
    var p1 = this.data[0]
    var p2 = this.data[len]
    return this.getDistanceKm(p1.lat, p1.lng, p2.lat, p2.lng)
  },

  getStageDistance: function(stage) {
    var idx = this.data.indexOf(stage)
    if(idx < 2) return 0
    var p1 = this.data[idx-1]
    var p2 = this.data[idx]
    return this.getDistanceKm(p1.lat, p1.lng, p2.lat, p2.lng)
  },

  getDistanceKm: function(lat1, lng1, lat2, lng2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
    var dLon = this.deg2rad(lng2-lng1); 
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d.toFixed(3);
  },

  deg2rad: function(deg) {
    return deg * (Math.PI/180)
  }

}