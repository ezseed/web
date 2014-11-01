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

    //Transform movies in a key => value array containing every season of the same serie
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
      blocks.push({width: l, shows: shows[o], name: o})
    }

    //sort the blocks according to the width
    blocks.sort(function(a, b) {
      return a.width - b.width
    })

    var numCols = 6
    var numBlocks = blocks.length
    var u = 0
    var currentPosition = 0, nextBreak = numCols 

    // styling length for a 6 row items
    for(u; u < numBlocks; u++) {
      //count num covers until u
      blocks[u].until = u == 0 ? blocks[u].shows.length : blocks[u-1].until + blocks[u].shows.length
      //count num of the first cover of the show
      blocks[u].num = u == 0 ? 0 : blocks[u].until - blocks[u].shows.length 

      currentPosition += blocks[u].width

      //take a break
      if(blocks[u].num >= nextBreak) {
        nextBreak += numCols
      }

      blocks[u].style = {}
      //if nb cols left + num > 6
      // or
      //style = %6 ==0 (new row) clear
      if(blocks[u].width + blocks[u].num > nextBreak || blocks[u].num % numCols == 0) {
        blocks[u].style = {clear: 'left'}
      }
    }

    return blocks
  }
  
})
