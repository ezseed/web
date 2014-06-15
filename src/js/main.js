/**
* ezseed Module
*
* Description
*/
angular.module('ezseed', ['mm.foundation', 'ngRoute', 'ezseed.desktop', 'ezseed.sidebar'])
  .controller('MainCtrl', function($scope) {
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
  .filter('capitalize', function() {
    return function(input, scope) {

      if (input) {
        input = input.toLowerCase().charAt(0).toUpperCase() + input.substring(1)
      }

      return input
    }
  })
  .config(function($routeProvider, $locationProvider) {
    $routeProvider
     .when('/', {
      templateUrl: 'partials/desktop.html',
      controller: 'DesktopCtrl'
    })
    .when('/admin', {
      templateUrl: 'partials/admin.html',
      controller: 'ChapterController'
    })
    .otherwise('/')

    // configure html5 to get links working on jsfiddle
    $locationProvider.html5Mode(true)

  })
