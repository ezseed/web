angular.module('ezseed')
.factory('$socket', function(socketFactory) {
  return socketFactory({prefix: ''})
})
.controller('DesktopCtrl', function($scope, $stateParams, $rootScope, recent, $recent, $loaderService, $socket) {
  $rootScope.recent = recent

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
