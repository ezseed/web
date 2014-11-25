function AlbumResolver($stateParams, $http, $q, $filter) {
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
    }

    defer.resolve(data)
  })

  return defer.promise
}

