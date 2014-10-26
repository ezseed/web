angular.module('ezseed')
.controller('NavCtrl', function($scope, $http, $localStorage, $rootScope, $recent, $timeout, $state, $paginate) {

  $scope.user = $localStorage.user

  $scope.refreshLibrairy = function($event) {
    $event.preventDefault()
    $http.get('api/-/refresh').success(function(data) {
      $recent($state.params.type, $paginate({match: $rootScope.search.params}))
      .then(function(data) {
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
        $recent($state.params.type, {match: $rootScope.search.params}).then(function(data) {
          $rootScope.recent = data
        })
      } else {
        $rootScope.search.params.search = null
        $recent($state.params.type, $paginate({match: $rootScope.search.params}))
        .then(function(data) {
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

