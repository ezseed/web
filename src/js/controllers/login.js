angular.module('ezseed')
.controller('LoginCtrl', function($scope, $http, $localStorage, $location, $log, $window) {

  var body = document.querySelector('body')

  if($localStorage.user) 
    return $location.path('/')
  else {
    body.classList.add('login')
    document.querySelector('input[type="text"]').focus()
  }

  $scope.userf = {}

  $scope.login = function() {
    $http
    .post('api/login', $scope.userf)
    .success(function(user) {
      $log.debug('User logged in', user)
      body.classList.remove('login')
      $localStorage.user = user
      $location.path('/')

      $http.defaults.headers.common.Authorization = 'Bearer '+$localStorage.user.token
    })
  }
})
