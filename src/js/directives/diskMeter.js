angular.module('ezseed')
.directive('diskMeter', function($addStylesheetRule) {
  
  //http://davidwalsh.name/vendor-prefix
  var styles = window.getComputedStyle(document.documentElement, ''),
    pre = (Array.prototype.slice
      .call(styles)
      .join('') 
      .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
    )[1] 

  return {
    restrict: 'A',
    scope: {
      diskSizes: '=',
      diskColors: '=?'
    },
    link: function(scope, element, attrs) {

      var colors = scope.diskColors, sizes = scope.diskSizes
        , gradient = '', percent = 5, l = colors.length*2, c = 0

      for(var i = 0; i < l; i++) {

        if(i === 0) {
          gradient += colors[i] + ' 0%, '
          percent = 0
        } else if (i == l-1) {
          c = colors.length - 1
          gradient += colors[c] + ' 100%);'
        } else if(i % 2 != 0){
          c = ((i-1) / 2) + 1
          percent += Math.floor(sizes[c-1]) == 0 ? 1 : Math.floor(sizes[c-1]) - 1
          gradient += colors[c-1] + ' ' + percent + '%, ' 
        } else {
          c = i / 2
          gradient += colors[c] + ' ' + percent + '%, '
        } 
        
      }

      var sheet = document.head.appendChild(document.createElement("style")).sheet
      
      if(pre == 'webkit')
        sheet = $addStylesheetRule(sheet)("meter#"+element[0].id +"::-webkit-meter-optimum-value", { 'background-image': 'linear-gradient(90deg, '+gradient })
      else if(pre == 'moz')
        sheet = $addStylesheetRule(sheet)("meter#"+element[0].id +"::-moz-meter-bar", { 'background-image': 'linear-gradient(90deg, '+gradient })

    },
  }
})
