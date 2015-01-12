angular.module('ezseed')
.factory('$socket', function(socketFactory, $window) {
  var sock = io.connect(window.location.pathname.substr(1))
  return socketFactory({prefix: '', ioSocket: sock})
})
.controller('DesktopCtrl', function($scope, $stateParams, $rootScope, recent, $recent, $socket, $loaderService) {
  $rootScope.recent = recent

  var body = document.querySelector('body')

  if(body.classList.contains('loading'))
    body.classList.remove('loading')

  $socket.on('update', function(update) {
    $recent($stateParams.type, $rootScope.search.params).then(function(data) {
      $rootScope.recent = data 
    })
  })

  //notify that watcher is working
  $socket.on('watching', $loaderService.load)
})
.controller('tvshowController', function($scope, $filter) {
  $scope.countShows = function(tvshow) {

    $scope.numCols = Math.max(2, Math.min(12, tvshow.width * 2))
    $scope.numBlock = Math.min(tvshow.width, 6)

    return $scope.numCols
  }
})
