angular.module('ezseed')
.directive('tree', function() {
  return {
    restrict: 'E',
    templateUrl: '/partials/items/tree.html',
    scope: {
      nodes: '=',
    }
  }
})
.directive('treeitem', function($compile) {
  return {
    restrict: 'E',
    // transclude: true,
    templateUrl: '/partials/items/treeitem.html',
    controllerAs: 'treeItemCtrl',
    controller: function($scope, $http, $compile, $rootScope) {

      $scope.selectNode = function(event, isDirectory) {
        var self = this
        event.stopPropagation()

        if(!self.node.children && isDirectory) {
          $http.get('api/-/tree', {params: {path: this.node.prevDir}}).success(function(data) {
            self.node.children = data
            self.node.opened = true
            $compile(
              '<tree nodes="node.children" ng-show="node.opened"></tree>'
            )($scope, function(cloned, scope) {
              angular.element(event.target).append(cloned)
            })

            $rootScope.$broadcast('tree.update')
          })
        } else {
          this.node.opened = !this.node.opened
        }
      }
    },
    link: function(scope, element, attrs) {
      if(angular.isArray(scope.node.children)) {
        $compile(
          '<tree nodes="node.children" ng-show="node.opened"></tree>'
        )(scope, function(cloned, scope) {
          element.append(cloned)
        })
      }
    }
  }
})
.controller('ExplorerCtrl', function($scope, $rootScope, $sessionStorage, $socket) {

  var paths = $rootScope.paths.paths

  var reset = function() {
      $sessionStorage.tree = {nodes: []}
      for(var i in paths) {
        var p = paths[i].path
        $sessionStorage.tree.nodes.push({prevDirRelative: p, prevDir: p, opened: false, name: p})
      }
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
  })

})

