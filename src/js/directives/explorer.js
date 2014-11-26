angular.module('ezseed')
.directive('tree', function() {
  return {
    restrict: 'E',
    templateUrl: '/partials/items/tree.html',
    scope: {
      nodes: '=',
      archives: '='
    }
  }
})
.directive('treeitem', function($compile) {
  var addFileTree = function addFileTree (scope, element) {
    var template = angular.element('<tree nodes="node.children" ng-show="node.opened" archives="archives"></tree>')

    $compile(template)(scope, function(cloned, scope) {
      element.after(cloned) 
    })
  }

  return {
    restrict: 'E',
    templateUrl: '/partials/items/treeitem.html',
    // require: 'tree',
    controllerAs: 'treeItemCtrl',
    controller: function($scope, $http, $compile, $rootScope) {

      $scope.check = function(event, node) {
        node.checked = event.currentTarget.checked 

        //node is checked but not opened
        if(node.checked == true && !node.opened && !node.children) {
          $scope.selectNode(event, node.prevDirRelative)
        }
      }

      $scope.selectNode = function(event, isDirectory) {
        var self = this

        if(!self.node.children && isDirectory) {
          self.node.loading = true
          $http.get('api/-/tree', {params: {path: this.node.prevDir}}).success(function(data) {
            self.node.children = data
            addFileTree($scope, angular.element(event.target.parentElement))
            $rootScope.$broadcast('tree.update')
            self.node.loading = false
          })
        }

        if(isDirectory) {
          this.node.opened = !this.node.opened
        }
      }
    },

    link: function(scope, element, attrs) {

      if(angular.isArray(scope.node.children) && scope.node.children.length > 0) {
        addFileTree(scope, element)
      }
    }
  }
})
.controller('ExplorerCtrl', function($scope, $rootScope, $sessionStorage, $socket, $filter, $log, $http) {

  var paths = $rootScope.paths.paths

 function reset() {
      $sessionStorage.tree = {nodes: []}
      for(var i in paths) {
        var p = paths[i].path
        $sessionStorage.tree.nodes.push({prevDirRelative: p, prevDir: p, opened: false, name: p})
      }
  }

  function resetArchive() {
    //populate scope 
    var archives = $filter('explorer')($scope.archives)
    var size = archiveSize(archives)
   
    $scope.archive.class = {
      alert: size > 2500000000,
      warning: size < 2500000000 && size > 1500000000,
      success: size < 1500000000
    }

    $scope.archive.size = $filter('prettyBytes')(size)

    for(var i in archives) {
      delete archives[i].children 
    }

    $scope.archive.link = '/files/archive?' + $filter('querystring')({paths: archives, name: $scope.archive.name})

  }

  function archiveSize(archives, s) {
    var s = 0
    for(var i in archives) {
      s += archives[i].size

      if(archives[i].children) {
        s += archiveSize(archives[i].children, s)
      }
    }
    return s
  }

  if(!$sessionStorage.tree) {
    reset()
  }

  $socket.on('update', function(update) {
    reset()
  })

  $scope.nodes = $sessionStorage.tree.nodes

  $rootScope.$on('tree.update', function() {
    $sessionStorage.tree = {nodes: $scope.nodes}
    resetArchive()
  })

  $scope.archives = []
  

  $scope.archive = {
    class: {},
    size: 0,
    name: 'archive-' + moment().format('YYYYMMDD')
  }

  $scope.$watchCollection('archives', function() {
    resetArchive()  
  })

  $scope.$watch('archive.name', function() {
    resetArchive()
  })
})

