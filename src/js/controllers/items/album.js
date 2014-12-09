angular.module('ezseed')
.controller('AlbumCtrl', function($scope, $log, album, $loaderService, AVPlayer, $rootScope) {

  $log.debug('Album: ', album)
  $scope.album = album
  $scope.bgColor = album.color ? album.color : ''

  var urls = []
  for(var i in album.songs) {
    urls.push('albums/'+album.songs[i]._id+'/download') 
  }

  var player = AVPlayer($rootScope)

  if(!$rootScope.player.id) {
    $rootScope.player = player(urls, {id: album._id})
  } else if ($rootScope.player.id !== album._id) {
    $rootScope.player.stop()
    $rootScope.player = player(urls, {id: album._id})
  } 

  console.log($scope.player)

  Mousetrap.bind('space', function(e) {
    if($rootScope.player) {
      $rootScope.player.toggle()
      $rootScope.$digest()
    }
  })
})
