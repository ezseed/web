angular.module('ezseed')
.factory('$recent', function($q, $http, $log, $filter, $rootScope, $state) {

  var limit = $rootScope.paginationLimit

  return function(type, params) {
    var default_params = {sort: '-dateAdded'}, defer = $q.defer()

    params = typeof type == 'object' ? type : params ? params : {} 
    type = typeof type == 'object' ? null : type

    if($rootScope.search && $rootScope.search.params && $rootScope.search.params.movieType == 'tvseries') {
      params.limit = 0
      params.skip = 0
    }

    $log.debug('Call recent for type %s with params %o', type, params)

    $http.get('api/-/files', 
      {
        params: angular.extend(default_params, 
                               params, 
                               {paths: $rootScope.watched_paths},
                               {type: type})
    }).success(function(data){

      if($rootScope.search && $rootScope.search.params && $rootScope.search.params.movieType == 'tvseries') {
        $log.debug('tvshowspacker')
        data.movies = $filter('tvShowsPacker')(data.movies)
      }

      //fix for albums cover - @todo work this on watcher
      if(data.albums) {
        for(var i in data.albums) {
          if(data.albums[i].picture) {
            var e = document.createElement('A')
            e.href = data.albums[i].picture
            if(e.hostname == location.hostname && e.pathname.indexOf('/tmp') !== 0) {
              data.albums[i].picture = window.location.origin + '/albums/' + data.albums[i]._id + '/cover'
            }
          }

        }
      }

      if(type && $rootScope.page_next != 0 && data[type].length < limit) {
        $rootScope.page_next = 0
      }

      $log.debug('Recent: ', data)
      defer.resolve(data) 
    })

    return defer.promise
  }
})
