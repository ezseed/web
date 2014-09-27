angular.module('ezseed')
.controller('sidebarCtrl', function($scope, $http, paths, size, $log, $rootScope, $recent, $stateParams, $translate) {

  $scope.paths = paths
  $log.debug('paths: ', paths)

  $scope.size = size
  $log.debug('size: ', size)

  $scope.usageDetails = {
    size: size.total.pretty,
    total: $scope.user.prettySize
  }

  $scope.array_colors = ['#A7C5BD', '#EB7B59','#CF4647']
  $scope.array_sizes = [size.albums.percent, size.movies.percent, size.others.percent]

  //TODO
  $scope.watched_paths = []

  $scope.$watchCollection('watched_paths', function(newVal, oldVal) {
    if(!angular.equals(newVal, oldVal)) {
      console.log(newVal);
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

