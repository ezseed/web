angular.module('ezseed')
.service('$loaderService', function($rootScope, $log) {
  $rootScope.loading = false

  $rootScope.alert = null 

  $rootScope.closeAlert = function() {
     $rootScope.alert = null
  }

  return {
    alert: function(error, type) {

      if(type !== 'success')
       $log.error(error)
       
     if($rootScope.alert) 
       $rootScope.closeAlert()

     $rootScope.alert = {
       message: error,
       type: type || 'alert'
     }

     setTimeout(function() {
       $rootScope.closeAlert() 
       $rootScope.$apply()
     }, 2650)
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
