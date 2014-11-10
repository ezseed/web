angular.module('ezseed')
.factory('isPluginInstalled', function() {

  return function isPluginInstalled(plugin) {
    if (navigator.plugins) {
      var i = 0, l = navigator.plugins.length

      for(;i < l; i++) {
        if(!navigator.plugins[i]) continue;

        if(navigator.plugins[i].name.toLowerCase().indexOf(plugin.toLowerCase()) != -1) {
          return true
        }
      }
    }
    /*
     * } else {
     *   //IE SUCKS
     *   try {
     *     new ActiveXObject("VideoLAN.VLCPlugin.2");
     *     return true;
     *   } catch (err) {}
     * }
     */

    return false;
  }
})
