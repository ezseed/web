function MovieResolver($stateParams, $http, $q, $colorThief) {
  var defer = $q.defer()

  $http.get('movies/'+ $stateParams.movieId).success(function(data){
    //sort videos according to ep num or name
    data.videos.sort(function(a, b) {
      if(a.specific && b.specific && a.specific.episode && b.specific.episode) {
        return parseInt(a.specific.episode) - parseInt(b.specific.episode) 
      }
      else
        return a.name > b.name
    })

    // if(!data.infos.picture) 
    //   data.infos.picture = '/img/movie/no_cover.jpg'

    //this should not be here
    if(data.infos && data.infos.seasonInfos) {
      for(var i in data.videos) {
        var e = data.videos[i]
        if(e.specific) {
          var episode = data.infos.seasonInfos.episodes[parseInt(e.specific.episode) - 1]

          if(episode) {
            data.videos[i].name = episode.name || e.name
            data.videos[i].picture = episode.still_path || null
            data.videos[i].synopsis = episode.overview || null
            data.videos[i].air_date = episode.air_date || null

          }
        }
      }
    }

    if(data.infos.picture) {
      $colorThief(data.infos.backdrop || data.infos.picture).then(function(colors) {
        if(colors) {
          data.color = colors[0]
        }

        defer.resolve(data)
      })
    } else {
      if(!data.infos.backdrop)
        data.infos.backdrop = 'img/movie/no_backdrop.png'

      defer.resolve(data)
    }
  })

  return defer.promise
}

