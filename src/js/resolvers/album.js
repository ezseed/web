function AlbumResolver($stateParams, $http, $q, $colorThief, $filter) {
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

      data = $filter('albumsCover')(data)

      //checking if it's a local element
      if(location.origin.indexOf('localhost') !== -1) {
        defer.resolve(data)
      } else {
        $colorThief(data.picture).then(function(colors) {
          if(colors) {
            data.color = colors[0] 
          }
          defer.resolve(data)
        })
      }

    } else {
      defer.resolve(data)
    }
  })

  return defer.promise
}

