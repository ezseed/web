angular.module('ezseed.desktop', ['ngAnimate']).controller('DesktopCtrl', [
  '$scope',
  function ($scope) {
  }
]);
/**
* ezseed Module
*
* Description
*/
angular.module('ezseed', [
  'mm.foundation',
  'ngRoute',
  'ezseed.desktop',
  'ezseed.sidebar'
]).filter('capitalize', function () {
  return function (input, scope) {
    if (input) {
      input = input.toLowerCase().charAt(0).toUpperCase() + input.substring(1);
    }
    return input;
  };
}).config([
  '$routeProvider',
  '$locationProvider',
  function ($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
      templateUrl: 'partials/desktop.html',
      controller: 'DesktopCtrl'
    }).when('/admin', {
      templateUrl: 'partials/admin.html',
      controller: 'ChapterController'
    }).otherwise('/');
    // configure html5 to get links working on jsfiddle
    $locationProvider.html5Mode(true);
  }
]).run([
  '$rootScope',
  function ($rootScope) {
    $rootScope.sidebar = true;
    $rootScope.toggleSidebar = function () {
      $rootScope.sidebar = !$rootScope.sidebar;
    };
  }
]);
angular.module('ezseed.sidebar', ['ngAnimate']).controller('sidebarCtrl', [
  '$scope',
  function ($scope) {
    //get back from storage
    $scope.filters = {
      videos: false,
      albums: false,
      others: false
    };
    $scope.displays = {
      list: false,
      table: false,
      thumb: false
    };
    $scope.tags = {
      sd: false,
      hd: false,
      movie: false,
      serie: false
    };
    $scope.choose = function (type) {
      return function (key, reset) {
        $scope[type][key] = !$scope[type][key];
        //checkbox is now option - reset others
        if (reset) {
          for (var i in $scope[type]) {
            //reset is an array of option keys
            if (reset instanceof Array && i !== key && reset.indexOf(i) !== -1) {
              $scope[type][i] = false;
            } else if (typeof reset == 'boolean' && i !== key) {
              $scope[type][i] = false;
            }
          }
        }
      };
    };
    $scope.reset = function (type) {
      return function () {
        for (var i in $scope[type]) {
          $scope[type][i] = false;
        }
      };
    };
    $scope.enabled = function (type) {
      return function () {
        var result = false;
        for (var i in $scope[type]) {
          if ($scope[type][i]) {
            result = true;
            break;
          }
        }
        return result;
      };
    };
  }
]);