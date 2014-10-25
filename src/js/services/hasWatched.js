angular.module('ezseed')
.factory('$hasWatched', function($localStorage, $log) {
  //stores watched movies
  if(!angular.isArray($localStorage.watched)) {
    $localStorage.watched = []
  }

  return {
    add: function(id) {
      if($localStorage.watched.indexOf(id) === -1) {
        $localStorage.watched.push(id)
      }
    }, 
    has: function(id) {
      return $localStorage.watched.indexOf(id) !== -1
    }
  }
})
