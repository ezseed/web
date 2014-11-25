angular.module('ezseed')
  .filter('capitalize', function() {
    return function(input, scope) {

      if (input) {
        input = input.toLowerCase().charAt(0).toUpperCase() + input.substring(1)
      }

      return input
    }
  })
  .filter('prettyDate', function() {
    return function(date) {
      return moment(date).format('llll')
    }
  })
  .filter('count', function() {
    return function(o) {
      if(angular.isArray(o)) {
        return o.length
      } else if (typeof o == 'object') {
        return Object.keys(o).length
      } else {
        return 0
      }
    }
  })
  /**
   * Albums cover normalizer
   */
  .filter('albumsCover', function() {

    return function(data) {

      if(!data.picture)
        return data

      var a = document.createElement('a')
      a.href = data.picture

      if(a.hostname == location.hostname) {
        if(a.pathname.indexOf('/tmp') !== 0) {
          data.picture = window.location.origin + '/albums/' + data._id + '/cover'
        } else {
          data.picture = window.location.origin + '/' + data.picture
        }
      } 

      return data
    }
  })
  .filter('prettyBytes', function() {

      /*!
        pretty-bytes
        Convert bytes to a human readable string: 1337 → 1.34 kB
        https://github.com/sindresorhus/pretty-bytes
        by Sindre Sorhus
        MIT License
      */
      // Number.isNaN() polyfill
      var isNaN = function (val) {
        return val !== val;
      };

      var prettyBytes = function (num) {
        num = parseInt(num)
        if (typeof num !== 'number' || isNaN(num)) {
          throw new TypeError('Expected a number');
        }

        var exponent;
        var unit;
        var neg = num < 0;
        var units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        if (neg) {
          num = -num;
        }

        if (num === 0) {
          return '0 B';
        }

        exponent = Math.min(Math.floor(Math.log(num) / Math.log(1000)), units.length - 1);
        num = (num / Math.pow(1000, exponent)).toFixed(2) * 1;
        unit = units[exponent];

        return (neg ? '-' : '') + num + ' ' + unit;
      };

    return prettyBytes;
  })
  /**
   * unique array
   * https://raw.githubusercontent.com/kvz/phpjs/master/functions/array/array_unique.js
   */
  .filter('unique', function() {
    return function array_unique(inputArr) {
      var key = '',
        tmp_arr2 = {},
        val = '';

      var __array_search = function (needle, haystack) {
        var fkey = '';
        for (fkey in haystack) {
          if (haystack.hasOwnProperty(fkey)) {
            if ((haystack[fkey] + '') === (needle + '')) {
              return fkey;
            }
          }
        }
        return false;
      };

      for (key in inputArr) {
        if (inputArr.hasOwnProperty(key)) {
          val = inputArr[key];
          if (false === __array_search(val, tmp_arr2)) {
            tmp_arr2[key] = val;
          }
        }
      }

      return tmp_arr2;
    }
  })

