angular.module('ezseed.sidebar', ['ngAnimate'])
	.controller('sidebarCtrl', function($scope) {
  
    $scope.choose = function(type) {
      return function(key, reset) {
        $scope[type][key] = !$scope[type][key]

        //checkbox is now an <option> - reset others
        if(reset) {

          for(var i in $scope[type]) {
            //reset is an array of option keys
            if(reset instanceof Array && i !== key && reset.indexOf(i) !== -1) {
              $scope[type][i] = false
            } else if(typeof reset == 'boolean' && i !== key) {
              $scope[type][i] = false
            }

          }
        }

      }
    }

    $scope.reset = function(type) {
      return function() {
        for(var i in $scope[type]) {
          $scope[type][i] = false
        }
      }
    }

    $scope.enabled = function(type) {
      return function() {
        var result = false

        for(var i in $scope[type]) {
          if($scope[type][i]) {
            result = true
            break;
          }
        }
        return result
      }
    }
	})

	.directive('ezScroll', function ($window) {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				angular.element($window).bind("scroll", function() {
					if(this.pageYOffset > 20) {
						element.css({'padding-top': this.pageYOffset - 50 + 'px'})
					} else {
						element.css({'padding-top': 0})
					}

				})
			}
		}
	})
