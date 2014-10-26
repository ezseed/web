angular.module('ezseed')
/**
 * @name ezScroll
 * @desc Adds padding to the sidebar when user scrolls
 */
.directive('ezScroll', function ($window) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {

      var md = new MobileDetect(window.navigator.userAgent)

      if(md.os() === null) {
        angular.element($window).bind("scroll", function() {
          if(this.pageYOffset > 20) {
            element.css({'padding-top': this.pageYOffset - 50 + 'px'})
          } else {
            element.css({'padding-top': 0})
          }
        })
      }

    }
  }
})
