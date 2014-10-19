angular.module('ezseed')
.factory('$hasWatched', function($localStorage) {
  //stores watched movies
  if(!angular.isArray($localStorage.watched)) {
    $localStorage.watched = []
  }

  return {
    add: function(id) {
      console.log(id)
      if($localStorage.watched.indexOf(id) === -1) {
        $localStorage.watched.push(id)
        console.log($localStorage.watched)
      }
    }, 
    has: function(id) {
      console.log($localStorage.watched.indexOf(id) !== -1)
      return $localStorage.watched.indexOf(id) !== -1
    }
  }
})
