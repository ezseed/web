angular.module('ezseed')
.controller('MovieCtrl', function($scope, $log, movie, $localStorage, $hasWatched) {

  $log.debug('Movie: ', movie)
  $scope.movie = movie

  $scope.hasWatched = $hasWatched.has;

  $scope.movieStyle = "'background-image'= '"+movie.infos.backdrop+"'"

  //color of the background according to cover (@see colorThief)
  $scope.bgColor = movie.color

  var md = new MobileDetect(window.navigator.userAgent)

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

  //stores the video informations
  $scope.video = false

  var video_container = document.getElementById('video_container'), player, watched

  $scope.play = function(video) {

    //...
    if(watched) {
      clearTimeout(watched)
    }

    setTimeout(function() {
      watched = $hasWatched.add(video._id)
    }, 600000)
    
    video.download = "/movies/"+video._id+"/download" //used with vlc
    video.stream = "/movies/"+video._id+"/stream/" + md.os() || md.userAgent()
    video.direct_link = window.location.origin + video.download

    $scope.video = video
    //if the player has been initiated before call dispose
    if(player && player.dispose) {
      player.dispose()
      player = null
      video_container.innerHTML = ""
    }

    if(isVLCInstalled()) {
      $log.debug('VLC installed')
      video_container.innerHTML =  "<embed id='VLC' type='application/x-vlc-plugin' pluginspage='http://www.videolan.org' width='720px' height='480px' style='display: inline-block;' autoplay='yes' target='"+video.download+"'></embed>" 

    } else if (md.os() !== null){  
      video_container.innerHTML = "<video controls width='720' height='480' style='margin: 0 auto' preload autoplay><source src='"+video.stream+"'></source></video>"
    } else {
      video_container.innerHTML = "<video id='videojs_container' class='video-js vjs-default-skin' controls width='720' height='480' style='margin: 0 auto' preload></video>"
      player = videojs('videojs_container')

      player.ready(function() {
        player.src([
          { type: 'video/flv', src: video.stream }
        ])

        player.play()
      })

    }

  }
})
.controller('tvshowController', function($scope, $filter) {
  $scope.countShows = function(tvshow) {
    var num = $filter('count')(tvshow)
    $scope.numCols = Math.max(2, Math.min(12, num * 2))
    $scope.numBlock = Math.min(num, 6)

    return $scope.numCols
  }
})
