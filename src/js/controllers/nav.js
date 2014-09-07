angular.module('ezseed')
.controller('NavCtrl', function($scope, $http, $localStorage) {
  $scope.resetLibrairy = function($event) {

    $event.preventDefault()
    $http.get('api/-/reset').success(function(data) {
      console.log(data)
    })
  }
})

