angular.module('ezseed')
.factory('$recent', function($q, $http, $log, $filter, $rootScope, $state) {

  return function(type, params) {
    var default_params = {sort: '-dateAdded'}, defer = $q.defer()

    params = typeof type == 'object' ? type : params ? params : {} 
    type = typeof type == 'object' ? null : type

    $log.debug('Call recent for type %s with params %o', type, params)

    if($rootScope.search && $rootScope.search.params && $rootScope.search.params.movieType == 'tvseries') {
      params.limit = 0
      params.skip = 0
    }

    $http.get('api/-/files', 
      {
        params: angular.extend(default_params, 
                               params, 
                               {paths: $rootScope.watched_paths},
                               {type: type})
    }).success(function(data){

      if($rootScope.search && $rootScope.search.params && $rootScope.search.params.movieType == 'tvseries') {
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

      if(type && $rootScope.page_next != 0 && data[type].length < 21) {
        $rootScope.page_next = 0
      }

      $log.debug('Recent: ', data)
      defer.resolve(data) 
    })

    return defer.promise
  }
})
