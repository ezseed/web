/**
* ezseed Module
*
* Description
*/
angular.module('ezseed', [
  'mm.foundation',
  'ngRoute',
  'ngStorage',
  'ngAnimate',
  'ui.router',
  'pascalprecht.translate',
  'checklist-model',
  'ngSanitize',
  'btford.socket-io'
]).config([
  '$locationProvider',
  '$logProvider',
  '$urlRouterProvider',
  '$stateProvider',
  '$translateProvider',
  '$httpProvider',
  function ($locationProvider, $logProvider, $urlRouterProvider, $stateProvider, $translateProvider, $httpProvider) {
    //enable debug
    $logProvider.debugEnabled(true);
    $httpProvider.interceptors.push('httpInterceptor');
    //log if missing translation
    $translateProvider.useMissingTranslationHandlerLog();
    $translateProvider.preferredLanguage('en_US');
    $translateProvider.useUrlLoader('locales.json');
    $urlRouterProvider.otherwise('/login');
    $stateProvider.state('login', {
      url: '/login',
      templateUrl: 'partials/login.html',
      controller: 'LoginCtrl'
    }).state('logout', {
      url: '/logout',
      controller: function ($localStorage, $state) {
        delete $localStorage.user;
        $state.transitionTo('login', {}, {
          reload: true,
          inherit: false,
          notify: true
        });
      }
    }).state('admin', {
      url: '/admin',
      views: {
        '': {
          templateUrl: 'partials/admin.html',
          controller: 'adminCtrl'
        },
        'nav@admin': {
          templateUrl: 'partials/header.html',
          controller: 'NavCtrl'
        }
      },
      resolve: AdminResolver()
    }).state('settings', {
      url: '/settings',
      views: {
        '': {
          templateUrl: 'partials/settings.html',
          controller: 'settingsCtrl'
        },
        'nav@settings': {
          templateUrl: 'partials/header.html',
          controller: 'NavCtrl'
        }
      }
    }).state('home', {
      abstract: true,
      views: {
        '': { templateUrl: 'partials/container.html' },
        'sidebar@home': {
          templateUrl: 'partials/sidebar.html',
          controller: 'sidebarCtrl',
          resolve: {
            paths: function ($http, $q, $localStorage) {
              var defer = $q.defer();
              $http.get('api/-').success(function (data) {
                angular.extend($localStorage.user, data);
                defer.resolve(data);
              });
              return defer.promise;
            },
            size: function ($http, $q) {
              var defer = $q.defer();
              $http.get('api/-/size').success(function (data) {
                defer.resolve(data);
              });
              return defer.promise;
            }
          }
        },
        'nav@home': {
          templateUrl: 'partials/header.html',
          controller: 'NavCtrl'
        }
      }
    }).state('home.desktop', {
      url: '/',
      views: {
        'desktop': {
          templateUrl: 'partials/desktop.html',
          controller: 'DesktopCtrl',
          resolve: {
            recent: function ($http, $q, $filter) {
              var defer = $q.defer();
              $http.get('api/-/files', {
                params: {
                  limit: 14,
                  sort: '-dateAdded'
                }
              }).success(function (data) {
                for (var i in data.albums) {
                  data.albums[i] = $filter('albumsCover')(data.albums[i]);
                }
                defer.resolve(data);
              });
              return defer.promise;
            }
          }
        }
      }
    }).state('home.type', {
      url: '/:type',
      views: {
        'desktop': {
          templateUrl: 'partials/desktop.html',
          controller: 'DesktopCtrl',
          resolve: {
            recent: function ($recent, $stateParams) {
              return $recent($stateParams.type);
            }
          }
        }
      }
    }).state('items', {
      abstract: true,
      views: {
        '': { templateUrl: 'partials/items/container.html' },
        'nav@items': {
          templateUrl: 'partials/header.html',
          controller: 'NavCtrl'
        }
      }
    }).state('items.movie', {
      url: '/movie/:movieId',
      views: {
        '': {
          templateUrl: 'partials/items/movie.html',
          controller: 'MovieCtrl',
          resolve: { movie: MovieResolver }
        }
      }
    }).state('items.album', {
      url: '/album/:albumId',
      views: {
        '': {
          templateUrl: 'partials/items/album.html',
          controller: 'AlbumCtrl',
          resolve: { album: AlbumResolver }
        }
      }
    });
    $locationProvider.html5Mode(false).hashPrefix('!');
  }
]).run([
  '$http',
  '$localStorage',
  '$rootScope',
  '$stateParams',
  '$translate',
  function ($http, $localStorage, $rootScope, $stateParams, $translate) {
    if ($localStorage.user) {
      $http.defaults.headers.common.Authorization = 'Bearer ' + $localStorage.user.token;
      $translate.use($localStorage.user.lang);
    }
    $http.get('/api/config').success(function (data) {
      moment.locale(data.lang);
    });
    $rootScope.$stateParams = $stateParams;
    $rootScope.search = {
      params: {},
      query: {}
    };
  }
]);
angular.module('ezseed').filter('capitalize', function () {
  return function (input, scope) {
    if (input) {
      input = input.toLowerCase().charAt(0).toUpperCase() + input.substring(1);
    }
    return input;
  };
}).filter('prettyDate', function () {
  return function (date) {
    return moment(date).format('llll');
  };
}).filter('count', function () {
  return function (o) {
    if (angular.isArray(o)) {
      return o.length;
    } else if (typeof o == 'object') {
      return Object.keys(o).length;
    } else {
      return 0;
    }
  };
}).filter('albumsCover', function () {
  return function (data) {
    if (!data.picture)
      return data;
    var a = document.createElement('a');
    a.href = data.picture;
    if (a.hostname == location.hostname) {
      if (a.pathname.indexOf('/tmp') !== 0) {
        data.picture = window.location.origin + '/albums/' + data._id + '/cover';
      } else {
        data.picture = window.location.origin + '/' + data.picture;
      }
    }
    return data;
  };
}).filter('prettyBytes', function () {
  /*!
        pretty-bytes
        Convert bytes to a human readable string: 1337 → 1.34 kB
        https://github.com/sindresorhus/pretty-bytes
        by Sindre Sorhus
        MIT License
      */
  // Number.isNaN() polyfill
  var isNaN = function (val) {
    return val !== val;
  };
  var prettyBytes = function (num) {
    num = parseInt(num);
    if (typeof num !== 'number' || isNaN(num)) {
      throw new TypeError('Expected a number');
    }
    var exponent;
    var unit;
    var neg = num < 0;
    var units = [
        'B',
        'kB',
        'MB',
        'GB',
        'TB',
        'PB',
        'EB',
        'ZB',
        'YB'
      ];
    if (neg) {
      num = -num;
    }
    if (num === 0) {
      return '0 B';
    }
    exponent = Math.min(Math.floor(Math.log(num) / Math.log(1000)), units.length - 1);
    num = (num / Math.pow(1000, exponent)).toFixed(2) * 1;
    unit = units[exponent];
    return (neg ? '-' : '') + num + ' ' + unit;
  };
  return prettyBytes;
});
angular.module('ezseed').directive('diskMeter', [
  '$addStylesheetRule',
  function ($addStylesheetRule) {
    //http://davidwalsh.name/vendor-prefix
    var styles = window.getComputedStyle(document.documentElement, ''), pre = (Array.prototype.slice.call(styles).join('').match(/-(moz|webkit|ms)-/) || styles.OLink === '' && [
        '',
        'o'
      ])[1];
    return {
      restrict: 'A',
      scope: {
        diskSizes: '=',
        diskColors: '=?'
      },
      link: function (scope, element, attrs) {
        var colors = scope.diskColors, sizes = scope.diskSizes, gradient = '', percent = 5, l = colors.length * 2, c = 0;
        for (var i = 0; i < l; i++) {
          if (i === 0) {
            gradient += colors[i] + ' 0%, ';
            percent = 0;
          } else if (i == l - 1) {
            c = colors.length - 1;
            gradient += colors[c] + ' 100%);';
          } else if (i % 2 != 0) {
            c = (i - 1) / 2 + 1;
            percent += Math.floor(sizes[c - 1]) == 0 ? 1 : Math.floor(sizes[c - 1]) - 1;
            gradient += colors[c - 1] + ' ' + percent + '%, ';
          } else {
            c = i / 2;
            gradient += colors[c] + ' ' + percent + '%, ';
          }
        }
        var sheet = document.head.appendChild(document.createElement('style')).sheet;
        if (pre == 'webkit')
          sheet = $addStylesheetRule(sheet)('meter#' + element[0].id + '::-webkit-meter-optimum-value', { 'background-image': 'linear-gradient(90deg, ' + gradient });
        else if (pre == 'moz')
          sheet = $addStylesheetRule(sheet)('meter#' + element[0].id + '::-moz-meter-bar', { 'background-image': 'linear-gradient(90deg, ' + gradient });
      }
    };
  }
]);
angular.module('ezseed').directive('dynamicBackground', [
  '$addStylesheetRule',
  function ($addStylesheetRule) {
    var scaleColor = function (c, n, i, d) {
      for (i = 3; i--; c[i] = d < 0 ? 0 : d > 255 ? 255 : d | 0)
        d = c[i] + n;
      return c;
    };
    return {
      restrict: 'E',
      scope: {
        color: '=',
        factor: '@?'
      },
      link: function (scope, element, attrs) {
        if (!scope.color) {
          console.warn('No color to add');
          return;
        } else if (!angular.isArray(scope.color)) {
          throw new Error('We need an rgb array color!');
        }
        var sheet = document.head.appendChild(document.createElement('style')).sheet;
        //according to the foundation button-function-factor
        var darker = scaleColor(angular.copy(scope.color), scope.factor || -30);
        sheet = $addStylesheetRule(sheet)('.button.secondary, button.secondary, .label.secondary', {
          'background-color': 'rgb(' + scope.color.join(',') + ')',
          'border-color': 'rgb(' + darker.join(',') + ')'
        });
        sheet = $addStylesheetRule(sheet)('.button.secondary:hover, button.secondary:hover', { 'background-color': 'rgb(' + darker.join(',') + ')' });
        sheet = $addStylesheetRule(sheet)('#audio-player .meter', { 'background-color': 'rgb(' + scope.color.join(',') + ')' });
        sheet = $addStylesheetRule(sheet)('a', { 'color': 'rgb(' + scope.color.join(',') + ')' });
        sheet = $addStylesheetRule(sheet)('a:hover', { 'color': 'rgb(' + darker.join(',') + ')' });
        element[0].style.display = 'none';
      }
    };
  }
]);
angular.module('ezseed').directive('ezScroll', [
  '$window',
  function ($window) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        angular.element($window).bind('scroll', function () {
          if (this.pageYOffset > 20) {
            element.css({ 'padding-top': this.pageYOffset - 50 + 'px' });
          } else {
            element.css({ 'padding-top': 0 });
          }
        });
      }
    };
  }
]);
angular.module('ezseed').controller('adminCtrl', [
  '$scope',
  'users',
  'paths',
  '$log',
  '$http',
  '$state',
  '$stateParams',
  function ($scope, users, paths, $log, $http, $state, $stateParams) {
    $log.debug('Admin users', users);
    $log.debug('Admin paths', paths);
    $scope.users = users;
    $scope.paths = paths;
    var hasPath = function (user, path) {
      for (var i in user.paths) {
        if (path._id == user.paths[i]._id) {
          return true;
        }
      }
      return false;
    };
    $scope.isWatching = function (user, path) {
      if (user.default_path == path._id) {
        return '&#9733;';
      } else if (hasPath(user, path)) {
        return '&#10003;';
      } else {
        return '&#10007;';
      }
    };
    $scope.watch = function (user, path) {
      if (user.default_path == path._id) {
        return false;
      }
      var next = function () {
        $state.transitionTo($state.current, $stateParams, {
          reload: true,
          inherit: false,
          notify: true
        });
      };
      if (hasPath(user, path)) {
        $http.delete('admin/user/' + user._id + '/path/' + path._id).success(next);
      } else if (user.default_path !== path._id) {
        $http.put('admin/user/' + user._id + '/path/' + path._id).success(next);
      }
    };
    $scope.deletePath = function (id_path) {
      $http.delete('admin/path/' + id_path).success(function (data) {
        $state.transitionTo($state.current, $stateParams, {
          reload: true,
          inherit: false,
          notify: true
        });
      });
    };
    //checks for a valid path
    $scope.isValidPath = function (e, path) {
      if (e.currentTarget.value) {
        $http.get('admin/validPath', { params: { path: e.currentTarget.value } }).success(function (data) {
          if (path) {
            path.error = data.error;
          } else {
            $scope.path.error = data.error;
          }
        });
      }
    };
    $scope.new = false;
    $scope.edit = [];
    $scope.togglePath = function () {
      $scope.new = !$scope.new;
    };
    $scope.editPath = function ($index, path) {
      $scope.edit[$index] = angular.copy(path);
    };
    $scope.cancelPath = function ($index) {
      $scope.paths[$index] = $scope.edit[$index];
      $scope.edit[$index] = false;
    };
    $scope.getPath = function (default_path) {
      for (var i in $scope.paths) {
        if ($scope.paths[i]._id == default_path)
          return $scope.paths[i].path;
      }
    };
  }
]).controller('adminNewPathCtrl', [
  '$scope',
  '$http',
  '$state',
  '$stateParams',
  function ($scope, $http, $state, $stateParams) {
    $scope.path = {};
    $scope.createPath = function () {
      $http.post('admin/path', { path: $scope.path.path }).success(function (data) {
        $state.transitionTo($state.current, $stateParams, {
          reload: true,
          inherit: false,
          notify: true
        });
      });
    };
  }
]).controller('adminUpdatePathCtrl', [
  '$scope',
  '$http',
  '$loaderService',
  function ($scope, $http, $loaderService) {
    $scope.updatePath = function ($index, path) {
      $http.put('admin/path/' + path._id, { path: path.path }).success(function (data) {
        $loaderService.alert('Path saved!', 'success');
        $scope.edit[$index] = false;
      });
    };
  }
]).controller('adminUserCtrl', [
  '$scope',
  '$http',
  '$loaderService',
  function ($scope, $http, $loaderService) {
    $scope.editing = [];
    $scope.edit = function ($index, user) {
      $scope.editing[$index] = angular.copy(user);
    };
    $scope.cancel = function ($index) {
      $scope.users[$index] = $scope.editing[$index];
      $scope.editing[$index] = false;
    };
    $scope.save = function ($index, user) {
      $http.put('admin/user/' + user._id, {
        default_path: user.default_path,
        spaceLeft: user.spaceLeft,
        role: user.role
      }).success(function (data) {
        $loaderService.alert('User saved!', 'success');
        $scope.editing[$index] = false;
      });
    };
  }
]);
angular.module('ezseed').factory('$socket', [
  'socketFactory',
  function (socketFactory) {
    return socketFactory({ prefix: '' });
  }
]).controller('DesktopCtrl', [
  '$scope',
  '$stateParams',
  '$rootScope',
  'recent',
  '$recent',
  '$loaderService',
  '$socket',
  function ($scope, $stateParams, $rootScope, recent, $recent, $loaderService, $socket) {
    $rootScope.recent = recent;
    $socket.on('update', function (update) {
      $recent($stateParams.type, $rootScope.search.params).then(function (data) {
        $rootScope.recent = data;
      });
    });
    //notify that watcher is working
    $socket.on('watching', $loaderService.load);
  }
]);
angular.module('ezseed').controller('LoginCtrl', [
  '$scope',
  '$http',
  '$localStorage',
  '$log',
  '$state',
  '$loaderService',
  '$rootScope',
  function ($scope, $http, $localStorage, $log, $state, $loaderService, $rootScope) {
    var body = document.querySelector('body');
    if ($localStorage.user) {
      body.classList.add('loading');
      return $state.transitionTo('home.desktop');
    }
    body.classList.add('login');
    document.querySelector('input[type="text"]').focus();
    $scope.userf = {};
    $scope.login = function () {
      $http.post('api/login', $scope.userf).success(function (user) {
        if (user.error) {
          $loaderService.alert(user.error);
        } else {
          $log.debug('User logged in', user);
          body.classList.remove('login');
          var origin = window.location.protocol + '//' + window.location.hostname;
          if (user.client == 'none') {
            user.client_link = '#';
          } else {
            user.client_link = user.client == 'transmission' ? origin + ':' + user.port : origin + '/rutorrent';
          }
          $localStorage.user = user;
          $rootScope.user = $localStorage.user;
          $http.defaults.headers.common.Authorization = 'Bearer ' + $localStorage.user.token;
          $state.go('home.desktop', angular.copy($state.params), {
            reload: true,
            inherit: false,
            notify: true
          });
        }
      });
    };
  }
]);
angular.module('ezseed').controller('MainCtrl', [
  '$scope',
  '$location',
  '$localStorage',
  function ($scope, $location, $localStorage) {
    $scope.user = $localStorage.user;
    if (!$scope.user && $location.path() !== '/login') {
      $location.path('/login');
    }
    $scope.sidebar = true;
    $scope.toggleSidebar = function () {
      $scope.sidebar = !$scope.sidebar;
    };
    //get back from storage
    $scope.filters = {
      videos: false,
      albums: false,
      others: false
    };
    $scope.displays = {
      list: true,
      table: false,
      thumb: false
    };
    $scope.tags = {
      sd: false,
      hd: false,
      movie: false,
      serie: false
    };
  }
]);
angular.module('ezseed').controller('NavCtrl', [
  '$scope',
  '$http',
  '$localStorage',
  '$rootScope',
  '$recent',
  '$timeout',
  '$stateParams',
  function ($scope, $http, $localStorage, $rootScope, $recent, $timeout, $stateParams) {
    $scope.user = $localStorage.user;
    //debug purpose only
    $scope.resetLibrairy = function ($event) {
      $event.preventDefault();
      $http.get('api/-/reset').success(function (data) {
        $recent($stateParams.type, $rootScope.search.params).then(function (data) {
          $rootScope.recent = data;
        });
      });
    };
    $scope.refreshLibrairy = function ($event) {
      $event.preventDefault();
      $http.get('api/-/refresh').success(function (data) {
        $recent($stateParams.type, $rootScope.search.params).then(function (data) {
          $rootScope.recent = data;
        });
      });
    };
    var timeout;
    $scope.search = function ($event) {
      timeout ? clearTimeout(timeout) : timeout;
      timeout = setTimeout(function () {
        var search = document.getElementById('search').value;
        if (search.replace(' ', '').length) {
          $rootScope.search.params.search = search;
          $recent($stateParams.type, $rootScope.search.params).then(function (data) {
            $rootScope.recent = data;
          });
        } else {
          $rootScope.search.params.search = null;
          $recent($stateParams.type, $rootScope.search.params).then(function (data) {
            $rootScope.recent = data;
          });
        }
      }, 375);
    };
    Mousetrap.bind('/', function (e) {
      e.preventDefault();
      document.getElementById('search').focus();
    });
  }
]);
angular.module('ezseed').controller('settingsCtrl', [
  '$scope',
  '$localStorage',
  '$translate',
  function ($scope, $localStorage, $translate) {
    $scope.lang = $localStorage.user.lang ? $localStorage.user.lang : 'en_US';
    $scope.changeLanguage = function (key) {
      $localStorage.user.lang = $scope.lang;
      $translate.use($scope.lang);
    };
  }
]);
angular.module('ezseed').controller('sidebarCtrl', [
  '$scope',
  '$http',
  'paths',
  'size',
  '$log',
  '$rootScope',
  '$recent',
  '$stateParams',
  '$translate',
  '$localStorage',
  function ($scope, $http, paths, size, $log, $rootScope, $recent, $stateParams, $translate, $localStorage) {
    $scope.paths = paths;
    $log.debug('paths: ', paths);
    $scope.size = size;
    $log.debug('size: ', size);
    $scope.usageDetails = {
      size: size.total.pretty,
      total: $localStorage.user.prettySize
    };
    $scope.array_colors = [
      '#A7C5BD',
      '#EB7B59',
      '#CF4647'
    ];
    $scope.array_sizes = [
      size.albums.percent,
      size.movies.percent,
      size.others.percent
    ];
    var watched_paths = $localStorage.watched_paths || [];
    if (watched_paths.length == 0) {
      for (var i in paths.paths) {
        watched_paths.push(paths.paths[i]._id);
      }
    }
    $rootScope.watched_paths = watched_paths;
    $rootScope.$watchCollection('watched_paths', function (newVal, oldVal) {
      if (!angular.equals(newVal, oldVal)) {
        $rootScope.watched_paths = $localStorage.watched_paths = newVal;
        $rootScope.recent = {};
        $recent($stateParams.type, $rootScope.search.params).then(function (data) {
          $rootScope.recent = data;
        });
      }
    });
    $scope.choose = function (type) {
      return function (params) {
        for (var i in params) {
          if (params[i] == $rootScope.search.params[i]) {
            $rootScope.search.params[i] = null;
          } else {
            $rootScope.search.params[i] = params[i];
          }
        }
        $rootScope.recent = {};
        $recent($stateParams.type, $rootScope.search.params).then(function (data) {
          $rootScope.recent = data;
        });
      };
    };
  }
]);
angular.module('ezseed').filter('tvShowsPacker', function () {
  return function (movies) {
    var shows = [];
    //Transform movies in a key => value array
    for (var i in movies) {
      var e = movies[i];
      if (!shows[e.name]) {
        shows[e.name] = [];
      }
      shows[e.name].push(e);
    }
    //sorting seasons in every show
    for (var j in shows) {
      shows[j].sort(function (a, b) {
        return parseInt(a.season) - parseInt(b.season);
      });
    }
    //counting shows based on a 2 grid width
    var blocks = [];
    var maxLength = 0;
    //max tv shows elements
    for (var o in shows) {
      var l = shows[o].length;
      blocks.push({
        width: l,
        shows: shows[o],
        name: o
      });
    }
    //sort the blocks according to the width - better results with the Packer
    blocks.sort(function (a, b) {
      return a.width - b.width;
    });
    // styling length for a 6 row items
    for (var u in blocks) {
      //count num covers until u
      blocks[u].until = u == 0 ? blocks[u].shows.length : blocks[u - 1].until + blocks[u].shows.length;
      //count num of the first cover of the show
      blocks[u].num = u == 0 ? 0 : blocks[u].until - blocks[u].shows.length;
      //style = %6 ==0 (new row) clear
      blocks[u].style = blocks[u].num % 6 == 0 ? { clear: 'left' } : {};
    }
    return blocks;
  };
});
function AdminResolver() {
  return {
    users: function ($http, $q) {
      var defer = $q.defer();
      $http.get('admin/users').success(function (data) {
        defer.resolve(data);
      });
      return defer.promise;
    },
    paths: function ($http, $q) {
      var defer = $q.defer();
      $http.get('admin/paths').success(function (data) {
        defer.resolve(data);
      });
      return defer.promise;
    }
  };
}
function AlbumResolver($stateParams, $http, $q, $colorThief, $filter) {
  var defer = $q.defer();
  $http.get('albums/' + $stateParams.albumId).success(function (data) {
    data.songs.sort(function (a, b) {
      if (a.specific && a.specific.track && a.specific.track.no && b.specific && b.specific.track && b.specific.track.no) {
        return a.specific.track.no - b.specific.track.no;
      } else {
        return a.name > b.name;
      }
    });
    if (data.picture) {
      data = $filter('albumsCover')(data);
      //checking if it's a local element
      if (a.origin == location.origin && location.origin.indexOf('localhost') !== -1) {
        defer.resolve(data);
      } else {
        $colorThief(data.picture).then(function (colors) {
          data.color = colors[0];
          defer.resolve(data);
        });
      }
    } else {
      defer.resolve(data);
    }
  });
  return defer.promise;
}
function MovieResolver($stateParams, $http, $q, $colorThief) {
  var defer = $q.defer();
  $http.get('movies/' + $stateParams.movieId).success(function (data) {
    //sort videos according to ep num or name
    data.videos.sort(function (a, b) {
      if (a.specific && b.specific && a.specific.episode && b.specific.episode) {
        return parseInt(a.specific.episode) - parseInt(b.specific.episode);
      } else
        return a.name > b.name;
    });
    // if(!data.infos.picture) 
    //   data.infos.picture = '/img/movie/no_cover.jpg'
    //this should not be here
    if (data.infos && data.infos.seasonInfos) {
      for (var i in data.videos) {
        var e = data.videos[i];
        if (e.specific) {
          var episode = data.infos.seasonInfos.episodes[parseInt(e.specific.episode) - 1];
          if (episode) {
            data.videos[i].name = episode.name || e.name;
            data.videos[i].picture = episode.still_path || null;
            data.videos[i].synopsis = episode.overview || null;
            data.videos[i].air_date = episode.air_date || null;
          }
        }
      }
    }
    if (data.infos.picture) {
      $colorThief(data.infos.backdrop || data.infos.picture).then(function (colors) {
        data.color = colors[0];
        defer.resolve(data);
      });
    } else {
      if (!data.infos.backdrop)
        data.infos.backdrop = 'img/movie/no_backdrop.png';
      defer.resolve(data);
    }
  });
  return defer.promise;
}
angular.module('ezseed').factory('AVPlayer', [
  '$loaderService',
  function ($loaderService) {
    var player = null;
    var currentTime = 0, oldSeconds = 0, remaining = false;
    var pad = function (input) {
      return ('00' + input).slice(-2);
    };
    return function (scope) {
      scope.player = {};
      return function (songs, options) {
        scope.player.toggleTimer = function () {
          remaining = !remaining;
        };
        var self = {};
        self.songs = songs;
        self.max = songs.length;
        self.id = options.id ? options.id : null;
        return angular.extend(self, {
          current: 0,
          loop: false,
          trackLength: 0,
          playing: function (i) {
            return player && player.playing && (i === undefined || this.current == i);
          },
          disconnect: function () {
            player.off('end', this.end);
            player.off('error', this.error);
            player.off('progress', this.progress);
            player.off('duration', this.duration);
          },
          play: function () {
            if (player && player.playing) {
              this.stop();
            }
            player = AV.Player.fromURL(this.songs[this.current]);
            player.on('end', this.end);
            player.on('error', this.error);
            player.on('progress', this.progress ? this.progress : function () {
            });
            player.on('duration', this.duration ? this.duration : function () {
            });
            player.play();
          },
          playSong: function (i) {
            if (this.playing(i))
              return false;
            this.current = i;
            return this.play();
          },
          toggle: function () {
            if (!player) {
              return this.play();
            } else {
              return player.togglePlayback();
            }
          },
          stop: function () {
            if (player) {
              player.stop();
              this.disconnect();
            }
          },
          next: function (force) {
            if (this.current == this.max - 1) {
              if (this.loop === false && !force) {
                this.player.stop();
                return false;
              } else {
                this.current = 0;
              }
            } else {
              this.current++;
            }
            return this.play();
          },
          prev: function (force) {
            if (this.current == 0) {
              if (this.loop === false && !force) {
                this.player.stop();
                return false;
              } else {
                this.current = this.max - 1;
              }
            } else {
              this.current--;
            }
            return this.play();
          },
          volume: function (v) {
            console.log(v);
            if (player)
              return player.volume = v;
            else
              return false;
          },
          trackLength: 0,
          position: 0,
          timeSpent: '+0:00',
          trackLength: '0:00',
          progress: function (time) {
            oldSeconds = Math.floor(currentTime / 1000 % 60);
            currentTime = time;
            if (currentTime >= trackLength && trackLength > 0) {
              console.log('trackend');
            }
            var t = currentTime / 1000, seconds = Math.floor(t % 60), minutes = Math.floor((t /= 60) % 60);
            var l = trackLength / 1000, s = Math.floor(l % 60), m = Math.floor((l /= 60) % 60);
            scope.player.trackLength = m + ':' + pad(s);
            if (seconds === oldSeconds)
              return;
            scope.player.timeSpent = '+' + pad(minutes) + ':' + pad(seconds);
            scope.player.position = 100 * Math.max(0, Math.min(1, currentTime / trackLength));
            // only show the progress bar and remaining time if we know the duration
            if (trackLength > 0) {
              var r = (trackLength - currentTime) / 1000, remainingSeconds = Math.floor(r % 60), remainingMinutes = Math.floor((r /= 60) % 60);
              scope.player.timeRemaining = '-' + remainingMinutes + ':' + pad(remainingSeconds);
            } else {
              scope.player.timeRemaining = '-0:00';
            }
            if (remaining)
              scope.player.time = scope.player.timeRemaining;
            else
              scope.player.time = scope.player.timeSpent;
            scope.$digest();
          },
          duration: function (d) {
            trackLength = d;
          },
          end: function () {
            return self.next();
          },
          error: function (e) {
            console.error(e);
            $loaderService.alert(e.message, 'alert');
          }
        });
      };
    };
  }
]);
angular.module('ezseed').factory('$addStylesheetRule', function () {
  /**
   * Adds a css rule
   * Adapted from http://stackoverflow.com/questions/4481485/changing-css-pseudo-element-styles-via-javascript
   * addRule(sheet)("p:before", {
   *     display: "block",
   *     width: "100px",
   *     height: "100px",
   *     background: "red",
   *     "border-radius": "50%",
   *     content: "''"
   * });
   */
  return function (sheet) {
    return function (selector, css) {
      var propText = typeof css === 'string' ? css : Object.keys(css).map(function (p) {
          return p + ':' + (p === 'content' ? '\'' + css[p] + '\'' : css[p]);
        }).join(';');
      sheet.insertRule(selector + '{' + propText + '}', sheet.cssRules.length);
      return sheet;
    };
  };
});
angular.module('ezseed').service('$colorThief', [
  '$http',
  '$q',
  function ($http, $q) {
    return function (url) {
      var defer = $q.defer();
      // .replace('w185/', 'original/')
      $http.get('http://soyuka.me/color-thief/', { params: { image: url } }).success(function (data) {
        defer.resolve(data);
      });
      return defer.promise;
    };
  }
]);
angular.module('ezseed').factory('httpInterceptor', [
  '$loaderService',
  '$q',
  '$log',
  '$location',
  '$localStorage',
  function ($loaderService, $q, $log, $location, $localStorage) {
    return {
      request: function (config) {
        $loaderService.load(true);
        return config;
      },
      requestError: function (rejection) {
        $loaderService.load(false);
        $log.debug('request error', rejection);
        return $q.reject(rejection);
      },
      response: function (response) {
        $loaderService.load(false);
        return response;
      },
      responseError: function (rejection) {
        $loaderService.load(false);
        $log.debug('response error', rejection);
        if (rejection.status == '404') {
          $location.path('/');
        } else if (rejection.status == '401') {
          delete $localStorage.user;
          $loaderService.alert('Whoops, try again.');
        } else if (rejection.data.error) {
          $loaderService.alert(rejection.data.error);
        } else {
          $loaderService.alert('Unexpected error');
        }
        return $q.reject(rejection);
      }
    };
  }
]);
angular.module('ezseed').service('$loaderService', [
  '$rootScope',
  '$log',
  function ($rootScope, $log) {
    $rootScope.loading = false;
    $rootScope.alert = null;
    $rootScope.closeAlert = function () {
      $rootScope.alert = null;
    };
    return {
      alert: function (error, type) {
        if (type !== 'success')
          $log.error(error);
        if ($rootScope.alert)
          $rootScope.closeAlert();
        $rootScope.alert = {
          message: error,
          type: type || 'alert'
        };
        setTimeout(function () {
          $rootScope.closeAlert();
          $rootScope.$apply();
        }, 2650);
      },
      load: function (loading) {
        if (loading === true) {
          this.pending++;
        } else {
          this.pending--;
        }
        if (this.pending > 0) {
          $rootScope.loading = true;
        } else {
          $rootScope.loading = false;
        }
      },
      pending: 0
    };
  }
]);
angular.module('ezseed').factory('$recent', [
  '$q',
  '$http',
  '$stateParams',
  '$log',
  '$filter',
  '$rootScope',
  function ($q, $http, $stateParams, $log, $filter, $rootScope) {
    return function (type, params) {
      var default_params = { sort: '-dateAdded' }, defer = $q.defer();
      params = typeof type == 'object' ? type : params ? params : {};
      type = typeof type == 'object' ? null : type;
      $log.debug('Call recent for type %s with params %o', type, params);
      default_params.type = type ? type : $stateParams.type;
      $http.get('api/-/files', {
        params: angular.extend(default_params, {
          match: params,
          paths: $rootScope.watched_paths
        })
      }).success(function (data) {
        if ($rootScope.search && $rootScope.search.params && $rootScope.search.params.movieType == 'tvseries') {
          data.movies = $filter('tvShowsPacker')(data.movies);
        }
        if (data.albums) {
          for (var i in data.albums) {
            if (data.albums[i].picture) {
              var e = document.createElement('A');
              e.href = data.albums[i].picture;
              if (e.hostname == location.hostname && e.pathname.indexOf('/tmp') !== 0) {
                data.albums[i].picture = window.location.origin + '/albums/' + data.albums[i]._id + '/cover';
              }
            }
          }
        }
        $log.debug('Recent: ', data);
        defer.resolve(data);
      });
      return defer.promise;
    };
  }
]);
angular.module('ezseed').controller('AlbumCtrl', [
  '$scope',
  '$log',
  'album',
  '$loaderService',
  'AVPlayer',
  '$rootScope',
  function ($scope, $log, album, $loaderService, AVPlayer, $rootScope) {
    $log.debug('Album: ', album);
    $scope.album = album;
    $scope.bgColor = album.color ? album.color : '';
    var urls = [];
    for (var i in album.songs) {
      urls.push('/albums/' + album.songs[i]._id + '/download');
    }
    var player = AVPlayer($rootScope);
    if (!$rootScope.player.id) {
      $rootScope.player = player(urls, { id: album._id });
    } else if ($rootScope.player.id !== album._id) {
      $rootScope.player.stop();
      $rootScope.player = player(urls, { id: album._id });
    }
    console.log($scope.player);
    Mousetrap.bind('space', function (e) {
      if ($rootScope.player) {
        $rootScope.player.toggle();
        $rootScope.$digest();
      }
    });
  }
]);
angular.module('ezseed').controller('MovieCtrl', [
  '$scope',
  '$log',
  'movie',
  function ($scope, $log, movie) {
    $log.debug('Movie: ', movie);
    $scope.movie = movie;
    $scope.movieStyle = '\'background-image\'= \'' + movie.infos.backdrop + '\'';
    $scope.bgColor = movie.color;
    $scope.selectVideoLink = function () {
      document.getElementById('video_link').select();
    };
    $scope.video = false;
    var isVLCInstalled = function () {
      var name = 'VLC';
      if (navigator.plugins && navigator.plugins.length > 0) {
        for (var i = 0; i < navigator.plugins.length; ++i)
          if (navigator.plugins[i].name.indexOf(name) != -1)
            return true;
      } else {
        try {
          new ActiveXObject('VideoLAN.VLCPlugin.2');
          return true;
        } catch (err) {
        }
      }
      return false;
    };
    // var player = videojs('video_container', {techOrder: ['html5', 'flash'], poster: movie.infos.backdrop})
    var player = document.getElementById('video_container');
    $scope.play = function (video) {
      video.download = '/movies/' + video._id + '/download';
      video.direct_link = window.location.origin + video.download;
      $scope.video = video;
      player.innerHTML = '';
      if (isVLCInstalled()) {
        $log.debug('VLC installed');
        player.innerHTML = '<embed id=\'VLC\' type=\'application/x-vlc-plugin\' pluginspage=\'http://www.videolan.org\' width=\'720px\' height=\'480px\' style=\'display: inline-block;\' autoplay=\'yes\' target=\'' + video.download + '\'></embed>';
      } else {
        player.innerHTML = '<video><source type=\'video/mp4\' src=\'/movies/' + video._id + '/stream\'/></video>';
      }
    };
  }
]).controller('tvshowController', [
  '$scope',
  '$filter',
  function ($scope, $filter) {
    $scope.countShows = function (tvshow) {
      var num = $filter('count')(tvshow);
      $scope.numCols = Math.max(2, Math.min(12, num * 2));
      $scope.numBlock = Math.min(num, 6);
      return $scope.numCols;
    };
  }
]);