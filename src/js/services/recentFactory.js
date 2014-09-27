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

      $log.debug('Recent: ', data)
      defer.resolve(data) 
    })

    return defer.promise
  }
})
