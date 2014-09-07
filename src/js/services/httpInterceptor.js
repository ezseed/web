angular.module('ezseed')
.factory('httpInterceptor', function($loaderService, $q, $log, $location) {

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

      if(rejection.data.error) {
        $loaderService.alert(rejection.data.error)
      } else {
        $loaderService.alert(rejection.statusText)
      }

      if(rejection.status == '404') {
        $location.path('/')
      }

      return $q.reject(rejection);
    }
  }
})

