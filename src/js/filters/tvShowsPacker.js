angular.module('ezseed')
/**
 * @ngdoc filter
 * @name tvShowsPacker
 * @desc Order shows by their name and pack them to fit in a 12 grid rows
 * @param object movies - movies object to be sorted
 * @return array blocks - sorted blocks
 */
.filter('tvShowsPacker', function() {

  return function(movies) {

    var shows = []

    //Transform movies in a key => value array
    for(var i in movies) {
      var e = movies[i]

      if(!shows[e.name]) {
        shows[e.name] = []
      } 
      
      shows[e.name].push(e)
    }

    //sorting seasons in every show
    for(var j in shows) {
      shows[j].sort(function(a, b) {
        return parseInt(a.season) - parseInt(b.season)
      })
    }

    //counting shows based on a 2 grid width
    var blocks = []
    var maxLength = 0 //max tv shows elements
    for(var o in shows) {
      var l = shows[o].length
      blocks.push({ h: l, w: Math.max(2, Math.min(12, l * 2)), shows: shows[o], name: o })
      maxLength += 10*l
    }

    //sort the blocks according to the width - better results with the Packer
    blocks.sort(function(a, b) {
      return b.w - a.w
    })

    //packing
    var pack = new Packer(6, 10*shows.length)
    pack.fit(blocks)

    blocks.sort(function(a, b) {
      //those are too big to fit in one row, putting them at the end
      if(!a.fit) a.fit = {x: maxLength, y: 0}
      if(!b.fit) b.fit = {x: maxLength, y: 0}

      var x = parseInt(a.fit.y + '' + a.fit.x)
      var y = parseInt(b.fit.y + '' + b.fit.x)

      return x - y
    })

    //styling length for a 6 row items
    for(var u in blocks) {
      if(blocks[u].fit) {
        //count num covers until u
        blocks[u].until = u == 0 ? blocks[u].shows.length : blocks[u-1].until + blocks[u].shows.length
        //count num of the first cover of the show
        blocks[u].num = u == 0 ? 0 : blocks[u].until - blocks[u].shows.length 
        //style = %6 ==0 (new row) clear
        blocks[u].style = blocks[u].num % 6 == 0 ? {clear: 'left'} : {}
      }
    }

    return blocks
  }
  
})
