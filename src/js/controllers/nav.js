angular.module('ezseed')
.controller('NavCtrl', function($scope, $http, $localStorage, $rootScope, $recent, $timeout, $stateParams) {

  //debug purpose only
  $scope.resetLibrairy = function($event) {
    $event.preventDefault()
    $http.get('api/-/reset').success(function(data) {
      $recent($stateParams.type, $rootScope.search.params).then(function(data) {
        $rootScope.recent = data
      })
    })
  }

  $scope.refreshLibrairy = function($event) {
    $event.preventDefault()
    $http.get('api/-/refresh').success(function(data) {
      $recent($stateParams.type, $rootScope.search.params).then(function(data) {
        $rootScope.recent = data 
      })
    })
  }

  var timeout 

  $scope.search = function($event) {
    timeout ? clearTimeout(timeout) : timeout

    timeout = setTimeout(function() {
      var search = document.getElementById('search').value

      if(search.replace(' ', '').length) {
        $rootScope.search.params.search = search
        $recent($stateParams.type, $rootScope.search.params).then(function(data) {
          $rootScope.recent = data
        })
      } else {
        $rootScope.search.params.search = null
        $recent($stateParams.type, $rootScope.search.params).then(function(data) {
          $rootScope.recent = data 
        })
      }
    }, 375)

  }

  Mousetrap.bind('/', function(e) {
    e.preventDefault()
    document.getElementById('search').focus()
  })
})

