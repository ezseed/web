angular.module('ezseed')
.directive('dynamicBackground', function($addStylesheetRule) {

  var scaleColor = function(c,n,i,d){for(i=3;i--;c[i]=d<0?0:d>255?255:d|0)d=c[i]+n;return c}

  return {
    restrict: 'E',
    scope: {
      color: '=',
      factor: '@?'
    },
    link: function(scope, element, attrs) {

      if(!scope.color) {
        console.warn('No color to add')
        return;
      } else if (!angular.isArray(scope.color)) {
        throw new Error('We need an rgb array color!')
      }

      var sheet = document.head.appendChild(document.createElement("style")).sheet
      //according to the foundation button-function-factor
      var darker = scaleColor(angular.copy(scope.color), scope.factor || -30)
      
      sheet = $addStylesheetRule(sheet)(".button.secondary, button.secondary, .label.secondary", { 'background-color': 'rgb('+scope.color.join(',')+')', 'border-color': 'rgb('+darker.join(',')+')' })
      sheet = $addStylesheetRule(sheet)(".button.secondary:hover, button.secondary:hover", { 'background-color': 'rgb('+darker.join(',')+')' })
      sheet = $addStylesheetRule(sheet)("#audio-player .meter", { 'background-color': 'rgb('+scope.color.join(',')+')' })
      sheet = $addStylesheetRule(sheet)("a", { 'color': 'rgb('+scope.color.join(',')+')' })
      sheet = $addStylesheetRule(sheet)("a:hover", { 'color': 'rgb('+darker.join(',')+')' })

      element[0].style.display = 'none'
    }
  }
})
