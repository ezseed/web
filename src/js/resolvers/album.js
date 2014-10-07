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

      //checking if it's a local element
      if(a.origin == location.origin && location.origin.indexOf('localhost') !== -1) {
        defer.resolve(data)
      } else {
        $colorThief(location.origin + data.picture).then(function(colors) {
          data.color = colors[0] 
          defer.resolve(data)
        })

      }

    } else {
      defer.resolve(data)
    }
  })

  return defer.promise
}

