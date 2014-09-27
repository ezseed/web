angular.module('ezseed')
.controller('LoginCtrl', function($scope, $http, $localStorage, $log, $state, $loaderService, $rootScope) {

  if($localStorage.user) {
    return $state.transitionTo('home.desktop')
  } 

  var body = document.querySelector('body')

  body.classList.add('login')
  document.querySelector('input[type="text"]').focus()

  $scope.userf = {}

  $scope.login = function() {
    $http
    .post('api/login', $scope.userf)
    .success(function(user) {
      if(user.error) {
        $loaderService.alert(user.error)
      } else {
        $log.debug('User logged in', user)
        body.classList.remove('login')
        $localStorage.user = user
        $rootScope.user = $localStorage.user

        $http.defaults.headers.common.Authorization = 'Bearer '+$localStorage.user.token

        $state.transitionTo('home.desktop', {}, { 
          reload: true, inherit: false, notify: true 
        })
      }
    })
  }
})
