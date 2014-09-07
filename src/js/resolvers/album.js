function AlbumResolver($stateParams, $http, $q, $colorThief) {
  var defer = $q.defer()

  $http.get('albums/'+ $stateParams.albumId).success(function(data){

    data.songs.sort(function(a, b) {
      if(a.specific && a.specific.track && a.specific.track.no && b.specific && b.specific.track && b.specific.track.no) {
        return a.specific.track.no - b.specific.track.no
      } else {
        return a.name > b.name
      }
    })

    if(data.picture) {

      var a = document.createElement('a')
      a.href = data.picture

      if(a.origin == location.origin && location.origin.indexOf('localhost') !== -1) {
        defer.resolve(data)
      } else {
        $colorThief(data.picture).then(function(colors) {
          var color = colors[0].join(',')
          data.color = 'rgb('+color+')'
          defer.resolve(data)
        })

      }

    }
  })

  return defer.promise
}

