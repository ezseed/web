angular.module('ezseed')
.controller('sidebarCtrl', function($scope, $http, paths, size, $log, $rootScope, $recent, $stateParams, $translate, $localStorage, $filter, $socket, $paginate, $state) {

  $scope.paths = paths
  $log.debug('paths: ', paths)

  $rootScope.size = size
  $log.debug('size: ', size)

  $socket.on('update', function(update) {
    $http.get('api/-/size').success(function(data){
      $rootScope.size = data
    })
  })

  $scope.usageDetails = {
    size: size.total.pretty,
    total: $localStorage.user.prettySize
  }

  //configuration for the size Donut
  $scope.array_colors = ['#A7C5BD', '#EB7B59','#CF4647']
  $scope.array_sizes = [size.albums.percent, size.movies.percent, size.others.percent]
  $scope.array_legend = [
    $filter('translate')('ALBUMS'),
    $filter('translate')('MOVIES'),
    $filter('translate')('OTHERS')
  ]

  //get back localStorage watched paths
  var watched_paths = $localStorage.watched_paths || []

  if(watched_paths.length == 0) {
    for(var i in paths.paths) {
      watched_paths.push(paths.paths[i]._id)
    }
  }

  $rootScope.watched_paths = watched_paths

  //watch the checkbox paths
  $rootScope.$watchCollection('watched_paths', function(newVal, oldVal) {
    if(!angular.equals(newVal, oldVal)) {
      $rootScope.watched_paths = $localStorage.watched_paths = newVal

      $rootScope.recent = {}
      $recent($stateParams.type, $paginate({match: $rootScope.search.params})).then(function(data) {
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

      $state.go($state.current.name, angular.extend($stateParams, {page: 1}), {reload: true})
      // $rootScope.recent = {}
      // $recent(type, {match: $rootScope.search.params}).then(function(data) {
      //   $rootScope.recent = data
      // })
    }
  }

})

