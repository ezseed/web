function AdminResolver() {

  return {
    users: function($http, $q) {
      var defer = $q.defer()

      $http.get('admin/users').success(function(data) {
       defer.resolve(data) 
      })

      return defer.promise
    },
    paths: function($http, $q) {
      var defer = $q.defer()

      $http.get('admin/paths').success(function(data) {
       defer.resolve(data) 
      })

      return defer.promise
    }
  }
}
