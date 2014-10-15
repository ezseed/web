angular.module('ezseed')
.factory('httpInterceptor', function($loaderService, $q, $log, $location, $localStorage) {

  return {
    request: function(config) {
      $loaderService.load(true)
      return config;
    },

    // should not happen
   requestError: function(rejection) {
      $loaderService.load(false)
      $log.debug('request error', rejection)
      return $q.reject(rejection);
    },

    response: function(response) {
      $loaderService.load(false)
      return response;
    },

   responseError: function(rejection) {
      $loaderService.load(false)
      $log.debug('response error', rejection)

      if(rejection.status == '404') {
        $location.path('/')
      } else if(rejection.status == '401') {
        delete $localStorage.user
        $loaderService.alert('Whoops, try again.')
      } else if (rejection.data.error) {
        $loaderService.alert(rejection.data.error)
      } else {
        $loaderService.alert('Unexpected error')
      }

      return $q.reject(rejection);
    }
  }
})

