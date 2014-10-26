angular.module('ezseed')
.service('$colorThief', function($http, $q) {

  return function(url) {
    var defer = $q.defer()
// .replace('w185/', 'original/')
    $http.get('http://soyuka.me/color-thief/', {params: {image: url}, timeout: 3000}).success(function(data) {
      defer.resolve(data)
    }).error(function() {
      defer.resolve(null)
    })

    return defer.promise
  }
})
