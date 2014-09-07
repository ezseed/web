angular.module('ezseed')
.controller('MainCtrl', function($scope, $location, $localStorage) {
  
  $scope.user = $localStorage.user

  if(!$scope.user && $location.path() !== '/login') {
    $location.path('/login')
  }

  $scope.sidebar = true

  $scope.toggleSidebar = function() {
    $scope.sidebar = !$scope.sidebar
  }

  //get back from storage
  $scope.filters = {
    videos: false,
    albums: false,
    others: false
  }

  $scope.displays = {
    list: true,
    table: false,
    thumb: false
  }

  $scope.tags = {
    sd: false,
    hd: false,
    movie: false,
    serie: false
  }
})
