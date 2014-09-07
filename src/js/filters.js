angular.module('ezseed')
  .filter('capitalize', function() {
    return function(input, scope) {

      if (input) {
        input = input.toLowerCase().charAt(0).toUpperCase() + input.substring(1)
      }

      return input
    }
  })

