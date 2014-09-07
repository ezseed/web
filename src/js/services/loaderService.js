angular.module('ezseed')
.service('$loaderService', function($rootScope, $log) {
  $rootScope.loading = false

  return {
    alert: function(error) {
       $log.error(error)
    },
    /**
     * @name load
     * @desc called on every request through interceptor
     * @return is loading or not
     */
    load: function(loading) {
      if(loading === true) {
        this.pending++
      } else {
        this.pending--
      } 

      if(this.pending > 0) {
        $rootScope.loading = true
      } else {
        $rootScope.loading = false
      }
    },
    pending: 0
  }
})
