/**
* ezseed Module
*
* Description
*/
angular.module('ezseed', ['mm.foundation', 'ngRoute', 'ngStorage', 'ngAnimate', 'ui.router', 'pascalprecht.translate', 'checklist-model'])
.config(function($locationProvider, $logProvider, $urlRouterProvider, $stateProvider, $translateProvider, $httpProvider) {
  //no debug
  $logProvider.debugEnabled(true)

  $httpProvider.interceptors.push('httpInterceptor');

  //log if missing translation
  $translateProvider.useMissingTranslationHandlerLog()

  $translateProvider.useUrlLoader('locales.json')

  $translateProvider.preferredLanguage('en_US')

  $urlRouterProvider.otherwise("/login")

  $stateProvider
  .state('admin', {
    url: '/admin',
    template: 'Hello'
  })
  .state('home', {
    abstract: true,
    views: {
      '': { templateUrl: 'partials/container.html' },
      'sidebar@home': {
        templateUrl: 'partials/sidebar.html',
        controller: 'sidebarCtrl',
        resolve: {
          paths: function($http, $q, $localStorage) {
            var defer = $q.defer()

            $http.get('api/-').success(function(data){
              angular.extend($localStorage.user, data)
              defer.resolve(data)            
            })

            return defer.promise
          },
          size: function($http, $q) {
            var defer = $q.defer()

            $http.get('api/-/size').success(function(data){
              defer.resolve(data)            
            })

            return defer.promise
          }
        }
      },
      'nav@home': {templateUrl: 'partials/header.html', controller: 'NavCtrl'}
    } 
  })
  .state('home.desktop', {
    url: '/',
    views: {
      'desktop': {
        templateUrl: 'partials/desktop.html', 
        controller: 'DesktopCtrl',
        resolve: {
          recent: function($http, $q) {

            var defer = $q.defer()

            $http.get('api/-/files', {params: {limit: 14, sort: '-dateAdded'}}).success(function(data){
              defer.resolve(data) 
            })

            return defer.promise
          },
        }
      },
    }
  })
  .state('home.type', {
    url: '/:type',
    views: {
      'desktop': {
        templateUrl: 'partials/desktop.html', 
        controller: 'DesktopCtrl',
        resolve: {
          recent: function($http, $q, $stateParams) {

            var defer = $q.defer()

            $http.get('api/-/files', {params: {type: $stateParams.type, sort: '-dateAdded'}}).success(function(data){
              defer.resolve(data) 
            })

            return defer.promise
          },
        }
      },
    }
  })
  .state('items', {
    abstract: true,
    views: {
      '': { templateUrl: 'partials/items/container.html' },
      'nav@items': { templateUrl: 'partials/header.html', controller: 'NavCtrl'}
    }
  })
  .state('items.movie', {
    url: '/movie/:movieId',
    views: {
      '': {
        templateUrl: 'partials/items/movie.html',
        controller: 'MovieCtrl',
        resolve: {
          movie: MovieResolver
       }
      } 
    },
  })
  .state('items.album', {
    url: '/album/:albumId',
    views: {
      '': {
        templateUrl: 'partials/items/album.html',
        controller: 'AlbumCtrl',
        resolve: {
          album: AlbumResolver
       }
      } 
    },
  })
  .state('login', {
    url: '/login',
    templateUrl: 'partials/login.html',
    controller: 'LoginCtrl'
  })
  .state('logout', {
    url: '/logout',
    controller: function($localStorage, $location, $window, $rootScope) {
      delete $localStorage.user
      $location.path('/login')
    }
  })

  $locationProvider.html5Mode(false).hashPrefix('!')

})
.run(function($http, $localStorage) {
  if($localStorage.user)
    $http.defaults.headers.common.Authorization = 'Bearer '+$localStorage.user.token
})
