angular.module('ezseed')
.filter('explorer', function() {

  // from joyent/node
  // Split a filename into [root, dir, basename, ext], unix version
  // 'root' is just a slash, or nothing.
  function splitPath(filename) {
    return /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/.exec(filename).slice(1)
  }

  function dirname(path) {
    var result = splitPath(path),
        root = result[0],
        dir = result[1]

    if (!root && !dir) {
      // No dirname whatsoever
      return '.'
    }

    if (dir) {
      // It has a dirname, strip trailing slash
      dir = dir.substr(0, dir.length - 1)
    }

    return root + dir;
  }

  function hasParentDirectory(arr, parent) {

    var l = arr.length

    if(l == 0) return false

    for (var i = 0; i < l; i++) {
      if(arr[i].path == parent) {
        return true;
      }
    }
    
    return false
  }


  /**
   * get the upper paths from the list
   * @param array node nodes
   */
  function getPaths(node) {
    var arr = []

    for(var i in node) {
      var parent = node[i].prevDir

      //if parent and path are the same get the directory dirname
      if(node[i].path === parent) {
        parent = dirname(node[i].path)
      }

      arr.push(angular.extend(node[i], {parent: parent}))
    } 

    //sort by length to filter from the lower path to the upper
    arr.sort(function(a, b) {
      return b.path.length - a.path.length 
    })

    //filter if previous contain parent directory ignore
    var filter = [], l = arr.length
    while(l--) {
      if(!hasParentDirectory(arr, arr[l].parent)) {
        filter.push(arr[l]) 
      }
    }

    return filter
  }

  return getPaths
})
