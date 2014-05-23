/**
* ezseed Module
*
* Description
*/
angular.module('ezseed', ['mm.foundation', 'ngRoute', 'ezseed.desktop', 'ezseed.sidebar'])
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
  .run(function($rootScope){
    $rootScope.sidebar = true

    $rootScope.toggleSidebar = function() {
      $rootScope.sidebar = !$rootScope.sidebar
    }
  })