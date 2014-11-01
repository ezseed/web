angular.module('ezseed')
.factory('$paginate', function($rootScope, $state, $log) {

  return function(currentParams) {

    var params = {}

    if($state.params.type) {

      var limit = 21

      if(!$state.params.page) {
        $state.params.page = 1
      }

      $state.params.page = parseInt($state.params.page)

      var max = $rootScope.size[$state.params.type].num

      if($state.params.page * limit > max) {
        $rootScope.page_next = 0
      } else {
        $rootScope.page_next = $state.params.page ? parseInt($state.params.page) + 1 : 2
      }

      $rootScope.page_prev = $state.params.page > 1 ? $state.params.page - 1 : 0

      var params = {
        limit: limit, 
        skip: $state.params.page === 1 ? 0 : ($state.params.page - 1) * limit
      }
    }

    $log.debug(params, $state.params, max)

    return angular.extend(params, currentParams)
  }
})
