angular.module('ezseed')
.controller('MovieCtrl', function($scope, $log, movie) {
  $log.debug('Movie: ', movie)
  $scope.movie = movie

  $scope.movieStyle = "'background-image'= '"+movie.infos.backdrop+"'"

  $scope.bgColor = movie.color

  $scope.selectVideoLink = function() {
    document.getElementById('video_link').select()
  }

  $scope.video = false
  
  var isVLCInstalled = function() {
    var name = "VLC";
    if (navigator.plugins && (navigator.plugins.length > 0)) {
      for(var i=0;i<navigator.plugins.length;++i) 
        if (navigator.plugins[i].name.indexOf(name) != -1) 
        return true;
    }
    else {
      try {
        new ActiveXObject("VideoLAN.VLCPlugin.2");
        return true;
      } catch (err) {}
    }
    return false;
  }

  // var player = videojs('video_container', {techOrder: ['html5', 'flash'], poster: movie.infos.backdrop})
  var player = document.getElementById('video_container')

  $scope.play = function(video) {
    video.download = "/movies/"+video._id+"/download"
    video.direct_link = window.location.origin + video.download
    $scope.video = video
    player.innerHTML = ""

    if(isVLCInstalled()) {
      player.innerHTML =  "<embed id='VLC' type='application/x-vlc-plugin' pluginspage='http://www.videolan.org' width='720px' height='480px' style='display: inline-block;' autoplay='yes' target='"+video.download+"'></embed>" 
    } else {
      player.innerHTML = '<video><source type='video/mp4' src='/movies/"+video._id+"/stream'/></video>'
    }
  }
})
.controller('tvshowController', function($scope, $filter) {
  $scope.countShows = function(tvshow) {
    var num = $filter('count')(tvshow)
    $scope.numCols = Math.max(2, Math.min(12, num * 2))
    $scope.numBlock = Math.min(num, 6)

    // console.log(numCols)
    return $scope.numCols
  }
})
