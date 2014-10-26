angular.module('ezseed')
.controller('DesktopTypeCtrl', function($scope, $stateParams, $rootScope, $recent, $socket, $loaderService, $state, $paginate) {

  var body = document.querySelector('body')

  if(body.classList.contains('loading'))
    body.classList.remove('loading')

  //notify that watcher is working
  $socket.on('watching', $loaderService.load)

  var getData = function() {
    $recent($state.params.type, $paginate({match: $rootScope.search.params})).then(function(data) {
      $rootScope.recent = data
    })
  }

  $socket.on('update', function(update) {
    getData()
  })
 
  getData()

  Mousetrap.bind('right', function(e) {
    e.preventDefault()
    if($rootScope.page_next > 0) {
      $stateParams.page = $rootScope.page_next
      $state.go($state.current.name, $stateParams, {reload: true})
    }
  })

  Mousetrap.bind('left', function(e) {
    e.preventDefault()
    if($rootScope.page_prev > 0) {
      $stateParams.page = $rootScope.page_prev
      $state.go($state.current.name, $stateParams, {reload: true})
    }
  })
})
