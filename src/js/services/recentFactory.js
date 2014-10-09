angular.module('ezseed')
.factory('$recent', function($q, $http, $stateParams, $log, $filter, $rootScope) {

  return function(type, params) {
    var default_params = {sort: '-dateAdded'}, defer = $q.defer()

    params = typeof type == 'object' ? type : params ? params : {} 
    type = typeof type == 'object' ? null : type

    $log.debug('Call recent for type %s with params %o', type, params)

    default_params.type = type ? type : $stateParams.type 

    $http.get('api/-/files', {params: angular.extend(default_params, {match: params})}).success(function(data){

      if($rootScope.search && $rootScope.search.params && $rootScope.search.params.movieType == 'tvseries') {
        data.movies = $filter('tvShowsPacker')(data.movies)
      }

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

      $log.debug('Recent: ', data)
      defer.resolve(data) 
    })

    return defer.promise
  }
})
