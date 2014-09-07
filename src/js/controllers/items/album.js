angular.module('ezseed')
.controller('AlbumCtrl', function($scope, $log, album) {
  $log.debug('Album: ', album)
  $scope.album = album

})
