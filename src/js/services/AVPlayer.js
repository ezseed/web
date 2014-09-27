angular.module('ezseed')
.factory('AVPlayer', function($loaderService) {
  var player = null

  var currentTime = 0,
    oldSeconds = 0,
    remaining = false

  var pad = function(input) {
    return ("00" + input).slice(-2)
  }

  return function(scope) {

    scope.player = {}

    return function(songs, options) {

      scope.player.toggleTimer = function() {
          remaining = !remaining
      }

      var self = {}

      self.songs = songs
      self.max = songs.length
      self.id = options.id ? options.id : null

      return angular.extend(self, {
        current: 0,
        loop: false,
        trackLength: 0,
        /**
         * @function playing
         * @param {int} [index] - Song index
         * @return {bool} Song is playing, or player is playing with no arguments
         */
        playing: function(i) { return player && player.playing && (i === undefined || this.current == i) },
        /**
         * @function disconnect
         * @return void disconnect events
         */
        disconnect: function() {
          player.off('end', this.end)
          player.off('error', this.error)
          player.off('progress', this.progress)
          player.off('duration', this.duration)
        },
        /**
         * @function play
         */
        play: function() {
          
          if(player && player.playing) {
            this.stop()
          }

          player = AV.Player.fromURL(this.songs[this.current])

          player.on('end', this.end)
          player.on('error', this.error)
          player.on('progress', this.progress ? this.progress : function() {})
          player.on('duration', this.duration ? this.duration : function() {})

          player.play()
        },
        playSong: function(i) {
          if(this.playing(i))
            return false

          this.current = i

          return this.play()
        },
        toggle: function() {

          if(!player) {
            return this.play()
          } else {
            return player.togglePlayback()
          }

        },
        stop: function() {
          if(player) {
            player.stop() 
            this.disconnect()
          }
        },
        next: function(force) {
          if(this.current == this.max - 1) {
            if(this.loop === false && !force) {
              this.player.stop()
              return false
            } else {
              this.current = 0
            }
          } else {
            this.current++
          }

          return this.play()
        },
        prev: function(force) {
          if(this.current == 0) {
            if(this.loop === false && !force) {
              this.player.stop()
              return false
            } else {
              this.current = this.max - 1
            }
          } else {
            this.current--
          }

          return this.play()
        },
        volume: function(v) { 
          console.log(v)
          if(player)  
            return player.volume = v
          else
            return false
        },

        trackLength: 0,
        position: 0,
        timeSpent: '+0:00',
        trackLength: '0:00',

        progress: function(time) {

          oldSeconds = Math.floor(currentTime / 1000 % 60)
          currentTime = time

          if (currentTime >= trackLength && trackLength > 0) {
            console.log('trackend')
          }

          var t = currentTime / 1000,
              seconds = Math.floor(t % 60),
              minutes = Math.floor((t /= 60) % 60);
          
          var l = trackLength  / 1000,
              s = Math.floor(l % 60),
              m = Math.floor((l /= 60) % 60)

          scope.player.trackLength = m + ':' + pad(s)

          if (seconds === oldSeconds)
              return;

          scope.player.timeSpent = '+' + pad(minutes) + ':'+ pad(seconds)

          scope.player.position = 100 * Math.max(0, Math.min(1, currentTime / trackLength));
           
          // only show the progress bar and remaining time if we know the duration
          if (trackLength > 0) {
              var r = (trackLength - currentTime) / 1000,
                  remainingSeconds = Math.floor(r % 60),
                  remainingMinutes = Math.floor((r /= 60) % 60);

              scope.player.timeRemaining = '-' + remainingMinutes + ':' + pad(remainingSeconds);
          } else {
            scope.player.timeRemaining = '-0:00';
          }

          if(remaining)
            scope.player.time = scope.player.timeRemaining
          else 
            scope.player.time = scope.player.timeSpent

          scope.$digest()
        },
        duration: function(d) {
          trackLength = d 
        },
        end: function() { return self.next() },
        error: function(e) { 
          console.error(e)
          $loaderService.alert(e.message, 'alert')
        }
      })
    }
  }
})
