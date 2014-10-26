// d3.legend.js 
// (C) 2012 ziggy.jonsson.nyc@gmail.com
// MIT licence

(function() {
d3.legend = function(g) {
  g.each(function() {
    var g= d3.select(this),
        items = {},
        svg = d3.select(g.property("nearestViewportElement")),
        legendPadding = g.attr("data-style-padding") || 5,
        lb = g.selectAll(".legend-box").data([true]),
        li = g.selectAll(".legend-items").data([true])

    lb.enter().append("rect").classed("legend-box",true)
    li.enter().append("g").classed("legend-items",true)

    svg.selectAll("[data-legend]").each(function() {
        var self = d3.select(this)
        items[self.attr("data-legend")] = {
          pos : self.attr("data-legend-pos") || this.getBBox().y,
          color : self.attr("data-legend-color") != undefined ? self.attr("data-legend-color") : self.style("fill") != 'none' ? self.style("fill") : self.style("stroke") 
        }
      })

    items = d3.entries(items).sort(function(a,b) { return a.value.pos-b.value.pos})

    
    li.selectAll("text")
        .data(items,function(d) { return d.key})
        .call(function(d) { d.enter().append("text")})
        .call(function(d) { d.exit().remove()})
        .attr('fill', '#000000')
        .attr("y",function(d,i) { return i+"em"})
        .attr("x","1em")
        .text(function(d) { ;return d.key})
    
    li.selectAll("circle")
        .data(items,function(d) { return d.key})
        .call(function(d) { d.enter().append("circle")})
        .call(function(d) { d.exit().remove()})
        .attr("cy",function(d,i) { return i-0.25+"em"})
        .attr("cx",0)
        .attr("r","0.4em")
        .style("fill",function(d) { return d.value.color})  
    
    // Reposition and resize the box
    var lbbox = li[0][0].getBBox()  
    lb.attr("x",(lbbox.x-legendPadding))
        .attr("y",(lbbox.y-legendPadding))
        .attr("height",(lbbox.height+2*legendPadding))
        .attr("width",(lbbox.width+2*legendPadding))
  })
  return g
}
})();

(function(global, undefined) {

  var defaults = {
    bindTo: 'body',
    className: 'donut',
    size: {
      width: 200,
      height: 200 
    },
    margin: {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20
    },
    startAngle: 0,
    endAngle: 360,
    thickness: null,
    offset: 0,
    sort: null,
    maxValue: null,
    background: false,
    colors: d3.scale.category20c(),
    accessor: function(d, i) {
      return d;
    }
  };

  var Donut = global.Donut = function(config) {
    // need an extend fn
    this.config = extend({}, defaults, config);

    // setup radius
    this.config.radius = getRadius(this);

    // setup accessor
    this.accessor = this.config.accessor;
    
    // convenience method to map data to start/end angles
    this.pie = d3.layout.pie()
      .sort(this.config.sort)
      .startAngle(degToRad(this.config.startAngle))
      .endAngle(degToRad(this.config.endAngle))

    if (this.accessor && typeof this.accessor === 'function') {
      this.pie.value(this.accessor);
    }
    
    var thickness = getThickness(this);

    // setup the arc
    // divide offset by 4 because the middle of the stroke aligns to the edge
    // so it's 1/2 on the outside, 1/2 inside
    this.arc = d3.svg.arc()
      .innerRadius(this.config.radius - thickness - (this.config.offset / 4))
      .outerRadius(this.config.radius + (this.config.offset / 4));

    bindSvgToDom(this);
  };

  Donut.prototype.load = function(newOpts) {
    // store data on object
    var data = (newOpts && newOpts.data != null) ? newOpts.data : this.data.map(this.accessor);

    this.legend = newOpts.legend

    // convert to array if not already
    data = Array.isArray(data) ? data : [data];

    if (this.config.maxValue) {
      this.data = this.pieMaxValue(data);
    } else {
      this.data = this.pie(data);
    }

    // drawPaths
    drawPaths(this);
  };

  Donut.prototype.pieMaxValue = function(data) {
    var accessor = this.accessor,
      self = this;

    // Compute the numeric values for each data element.      
    var values = data.map(function(d, i) { return +accessor.call(self, d, i); });

    var sum = d3.sum(values),
      max = d3.max([this.config.maxValue, sum]),
      diff = max - sum;

    // Compute the start angle.
    var a = +(degToRad(this.config.startAngle));

    // Compute the angular scale factor: from value to radians.
    // include the diff because it will help create angles with a maxValue in mind
    var k = (degToRad(this.config.endAngle) - a) / (sum + diff);

    var index = d3.range(data.length);

    // Compute the arcs!
    // They are stored in the original data's order.
    var arcs = [];
    index.forEach(function(i) {
      var d;
      arcs[i] = {
        data: data[i],
        value: d = values[i],
        startAngle: a,
        endAngle: a += d * k
      };
    });
    return arcs;
  };
  
  function getThickness(donut) {
    return donut.config.thickness || donut.config.radius;
  }
  
   /*
    * Setup the svg in the DOM and cache a ref to it
    */
  function bindSvgToDom(donut) {
    var width = getWidth(donut),
      height = getHeight(donut);

    donut.svg = d3.select(donut.config.bindTo)
      .append('svg')
      .attr('class', donut.config.classNames)
      .attr('width', width)
      .attr('height', height)
      .append('g')
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');


    if (donut.config.background) {
      donut.svg.append('path')
        .attr('class', 'donut-background')
        .attr('fill', '#626262')
        .transition()
        .duration(500)
        .attrTween('d', function(d, i) {
          var fullArc = {
            value: 0,
            startAngle: degToRad(donut.config.startAngle),
            endAngle: degToRad(donut.config.endAngle)
          };
          return arcTween.call(this, fullArc, i, donut);
        });
    }
  }

  function drawPaths(donut) {
    var paths = donut.svg.selectAll('path.donut-section').data(donut.data)

    var tip = d3.tip().attr('class', 'd3-tip').html(function(d) { 
      return Math.round(d.data, 2) + '%'; 
    });

    // enter new data
    paths.enter()
      .append('path')
      .attr('class', function(d, i) { return 'donut-section value-' + i; })
      .attr('fill', function(d, i) {
        return (typeof donut.config.colors === 'function') ? donut.config.colors(i) : donut.config.colors[i];
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', donut.config.offset / 2)
      .attr('data-legend', function(d, i) {
        return donut.legend[i]
      })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)

    // transition existing paths
    donut.svg.selectAll('path.donut-section')
      .transition()
      .duration(500)
      .attrTween('d', function(d, i) {
        return arcTween.call(this, d, i, donut);
      })
    // exit old data
    paths.exit()
      .transition()
      .duration(100)
      .attrTween('d', function(d, i) {
        return removeArcTween.call(this, d, i, donut);
      })
      .remove();

    paths.call(tip)

    donut.svg
      .append('g')
      .attr('class', 'disk-legend')
      .attr('fill', 'none')
      .attr('transform', 'translate(-20, -30)')
      .style('font-size', '12px')
      .call(d3.legend)
  }

  // Store the currently-displayed angles in this._current.
  // Then, interpolate from this._current to the new angles.
  function arcTween(a, i, donut) {
    var prevSiblingArc, startAngle, newArc, interpolate;
    

    if (!this._current) {
      prevSiblingArc = donut.svg.selectAll('path')[0][i - 1];// donut.data[i - 1];

      // start at the end of the previous one or start of entire donut
      startAngle = (prevSiblingArc && prevSiblingArc._current) ?
        prevSiblingArc._current.endAngle :
        degToRad(donut.config.startAngle);

      newArc = {
        startAngle: startAngle,
        endAngle: startAngle,
        value: 0
      };
    }
    
    interpolate = d3.interpolate(this._current || newArc, a);

    // cache a copy of data to each path
    this._current = interpolate(0);
    return function(t) {
      return donut.arc(interpolate(t));
    };
  }

  function removeArcTween(a, i, donut) {
    var emptyArc = {
        startAngle: degToRad(donut.config.endAngle),
        endAngle: degToRad(donut.config.endAngle),
        value: 0
      },
      i = d3.interpolate(a, emptyArc);
    return function(t) {
      return donut.arc(i(t));
    };
  }

  function getRadius(donut) {
    var width = getWidth(donut) - donut.config.margin.left - donut.config.margin.right,
      height = getHeight(donut) - donut.config.margin.top - donut.config.margin.bottom;

    return Math.min(width, height) / 2;
  }

  function getWidth(donut) {
    return donut.config.size && donut.config.size.width;
  }

  function getHeight(donut) {
    return donut.config.size && donut.config.size.height;
  }

  function degToRad(degree) {
    return degree * (Math.PI / 180);
  }

  function radToDeg(radian) {
    return radian * (180 / Math.PI);
  }

  /*
   * Simple extend fn like jQuery
   * 
   * Usage: extend({ name: 'Default' }, { name: 'Matt' });
   * Result: { name: 'Matt' }
   */
  function extend() {
    for (var i = 1; i < arguments.length; i++) {
      for (var prop in arguments[i]) {
        if (arguments[i].hasOwnProperty(prop)) {
          arguments[0][prop] = arguments[i][prop];
        }
      }
    }
    return arguments[0];
  }

})(window);

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
