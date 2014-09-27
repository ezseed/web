angular.module('ezseed')
.controller('adminCtrl', function($scope, users, paths, $log, $http, $state, $stateParams) {
  $log.debug('Admin users', users) 
  $log.debug('Admin paths', paths) 

  $scope.users = users 
  $scope.paths = paths 

  var hasPath = function(user, path) {
    for(var i in user.paths) {
      if(path._id == user.paths[i]._id) {
        return true
      }
    }

    return false
  }

  $scope.isWatching = function(user, path) {
    if(user.default_path == path._id) {
      return '&#9733;'
    } else if(hasPath(user, path)) {
      return '&#10003;'
    } else {
      return '&#10007;'
    }
  }

  $scope.watch = function(user, path) {
    if(user.default_path == path._id) {
      return false
    }

    var next = function() {
      $state.transitionTo($state.current, $stateParams, { 
        reload: true, inherit: false, notify: true 
      })
    }

    if(hasPath(user, path)) {
      $http.delete('admin/user/'+user._id+'/path/'+path._id).success(next)
    } else if (user.default_path !== path._id){
      $http.put('admin/user/'+user._id+'/path/'+path._id).success(next)
    }
  }

  $scope.deletePath = function(id_path) {
    $http.delete('admin/path/'+id_path).success(function(data) {
      $state.transitionTo($state.current, $stateParams, { 
        reload: true, inherit: false, notify: true 
      })
    })
  }

  //checks for a valid path
  $scope.isValidPath = function(e, path) {
    if(e.currentTarget.value) {
      $http.get('admin/validPath', {params: {path: e.currentTarget.value}}).success(function(data) {
        if(path) {
          path.error = data.error
        } else {
          $scope.path.error = data.error
        }
      })

    }
  }

  $scope.new = false
  $scope.edit = []

  $scope.togglePath = function() { $scope.new = !$scope.new }

  $scope.editPath = function($index, path) { 
    $scope.edit[$index] = angular.copy(path)
  }

  $scope.cancelPath = function($index) {
    $scope.paths[$index] = $scope.edit[$index]
    $scope.edit[$index] = false
  }

  $scope.getPath = function(default_path) {
    for(var i in $scope.paths) {
      if($scope.paths[i]._id == default_path)
        return $scope.paths[i].path
    }
  }
})
.controller('adminNewPathCtrl', function($scope, $http, $state, $stateParams) {
  $scope.path = {}

  $scope.createPath = function() {
    $http.post('admin/path', {path: $scope.path.path}).success(function(data) {
      $state.transitionTo($state.current, $stateParams, { 
        reload: true, inherit: false, notify: true 
      })
    })
  }


})

.controller('adminUpdatePathCtrl', function($scope, $http, $loaderService) {

  $scope.updatePath = function($index, path) {
    $http.put('admin/path/'+path._id, {path: path.path}).success(function(data) {
        $loaderService.alert('Path saved!', 'success')  
        $scope.edit[$index] = false
    })
  }


})

.controller('adminUserCtrl', function($scope, $http, $loaderService) {
  $scope.editing = []

  $scope.edit = function($index, user) {
    $scope.editing[$index] = angular.copy(user)
  }

  $scope.cancel = function($index) {
    $scope.users[$index] = $scope.editing[$index]
    $scope.editing[$index] = false
  }

  $scope.save = function($index, user) {
    $http.put('admin/user/'+user._id, {default_path: user.default_path, spaceLeft: user.spaceLeft, role: user.role}).success(function(data) {
        $loaderService.alert('User saved!', 'success')  
        $scope.editing[$index] = false;
    })
  }
})
