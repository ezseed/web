angular.module('ezseed')
.service('$colorThief', function($http, $q) {

  return function(url) {
    var defer = $q.defer()
// .replace('w185/', 'original/')
    $http.get('http://soyuka.me/color-thief/', {params: {image: url}}).success(function(data) {
      defer.resolve(data)
    })

    return defer.promise
  }
})
