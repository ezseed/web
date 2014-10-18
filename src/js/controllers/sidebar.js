angular.module('ezseed')
.controller('sidebarCtrl', function($scope, $http, paths, size, $log, $rootScope, $recent, $stateParams, $translate, $localStorage) {

  $scope.paths = paths
  $log.debug('paths: ', paths)

  $scope.size = size
  $log.debug('size: ', size)

  $scope.usageDetails = {
    size: size.total.pretty,
    total: $localStorage.user.prettySize
  }

  $scope.array_colors = ['#A7C5BD', '#EB7B59','#CF4647']
  $scope.array_sizes = [size.albums.percent, size.movies.percent, size.others.percent]

  var watched_paths = $localStorage.watched_paths || []

  if(watched_paths.length == 0) {
    for(var i in paths.paths) {
      watched_paths.push(paths.paths[i]._id)
    }
  }

  $rootScope.watched_paths = watched_paths

  $rootScope.$watchCollection('watched_paths', function(newVal, oldVal) {
    if(!angular.equals(newVal, oldVal)) {
      $rootScope.watched_paths = $localStorage.watched_paths = newVal

      $rootScope.recent = {}
      $recent($stateParams.type, $rootScope.search.params).then(function(data) {
        $rootScope.recent = data
      })
    }
  })

  $scope.choose = function(type) {
    return function(params) {

      for(var i in params) {
        if(params[i] == $rootScope.search.params[i]) {
          $rootScope.search.params[i] = null
        } else {
          $rootScope.search.params[i] = params[i]
        }
      }

      $rootScope.recent = {}
      $recent($stateParams.type, $rootScope.search.params).then(function(data) {
        $rootScope.recent = data
      })
    }
  }

})

