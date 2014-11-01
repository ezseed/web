angular.module('ezseed')
.directive('diskMeter', function() {
 
  return {
    restrict: 'A',
    scope: {
      diskSizes: '=',
      diskColors: '=?',
      diskLegend: '=?'
    },
    link: function(scope, element, attrs) {
      var meter = new Donut({
        bindTo: element[0],
        background: true,
        thickness: 20,
        offset: 0,
        startAngle: -90,
        endAngle: 90,
        maxValue: 100,
        colors: scope.diskColors
      })

      meter.load({data: scope.diskSizes, legend: scope.diskLegend})

    }
  }
})
