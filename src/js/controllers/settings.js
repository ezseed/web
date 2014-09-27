
angular.module('ezseed')
.controller('settingsCtrl', function($scope, $localStorage, $translate) {
  $scope.lang = $localStorage.user.lang ? $localStorage.user.lang : 'en_US'

  $scope.changeLanguage = function(key) {
    $localStorage.user.lang = $scope.lang
    $translate.use($scope.lang)
  }
})
