angular.module('ezseed')
.controller('DesktopCtrl', function($scope, $localStorage, $log, recent) {
  $scope.recent = recent
  $log.debug('Recent: ', recent)

  // $scope.$watch('show_files', function(newValue, oldValue) {
  //   console.log(newValue, oldValue)
  // })
})
