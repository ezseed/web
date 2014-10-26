/**
* ezseed Module
*
* Description
*/
angular.module('ezseed', ['mm.foundation', 'ngRoute', 'ngStorage', 'ngAnimate', 'ui.router', 'pascalprecht.translate', 'checklist-model', 'ngSanitize', 'btford.socket-io'])
.config(function($locationProvider, $logProvider, $urlRouterProvider, $stateProvider, $translateProvider, $httpProvider) {
  //enable debug
  $logProvider.debugEnabled(true)

  $httpProvider.interceptors.push('httpInterceptor');

  //log if missing translation
  $translateProvider.useMissingTranslationHandlerLog()
  $translateProvider.preferredLanguage('en')

  $translateProvider.useUrlLoader('locales.json')

  $urlRouterProvider.otherwise("/login")

  $stateProvider
  .state('login', {
    url: '/login',
    templateUrl: 'partials/login.html',
    controller: 'LoginCtrl'
  })
  .state('logout', {
    url: '/logout',
    controller: function($localStorage, $state) {
      delete $localStorage.user
      $state.transitionTo('login', {}, { 
        reload: true, inherit: false, notify: true 
      })
    }
  })
  .state('admin', {
    url: '/admin',
    views: {
      '': {
        templateUrl: 'partials/admin.html',
        controller: 'adminCtrl',
      },
      'nav@admin': {templateUrl: 'partials/header.html', controller: 'NavCtrl'} 
    },
    resolve: AdminResolver()
  })
  .state('settings', {
    url: '/settings',
    views: {
      '': {
        templateUrl: 'partials/settings.html',
        controller: 'settingsCtrl',
      },
      'nav@settings': {templateUrl: 'partials/header.html', controller: 'NavCtrl'} 
    }
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
          recent: function($http, $q, $filter) {

            var defer = $q.defer()

            $http.get('api/-/files', {params: {limit: 14, sort: '-dateAdded'}}).success(function(data){

              for(var i in data.albums) {
                data.albums[i] = $filter('albumsCover')(data.albums[i])
              }

              defer.resolve(data) 
            })

            return defer.promise
          },
        }
      },
    }
  })
  .state('home.type', {
    url: '/:type/:page',
    views: {
      'desktop': {
        templateUrl: 'partials/desktop.html', 
        controller: 'DesktopTypeCtrl'
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

  $locationProvider.html5Mode(false).hashPrefix('!')

})
.run(function($http, $localStorage, $rootScope, $stateParams, $translate, $state) {
  if($localStorage.user) {
    $http.defaults.headers.common.Authorization = 'Bearer '+$localStorage.user.token
    $translate.use('fr')
    $http.get('/api/config').success(function(data) {
      moment.locale(data.lang)
      $translate.use('fr')
    })
  } else {
    $state.go('login')
  }

  videojs.options.flash.swf = '/bower_components/videojs/dist/video-js/video-js.swf'

  $rootScope.$stateParams = $stateParams
  $rootScope.$state = $state
  $rootScope.search = {params: {}, query: {}}
})
