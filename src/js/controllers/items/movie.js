angular.module('ezseed')
.controller('MovieCtrl', function($scope, $log, movie) {
  $log.debug('Movie: ', movie)
  $scope.movie = movie

  $scope.movieStyle = "'background-image'= '"+movie.infos.backdrop+"'"
})
