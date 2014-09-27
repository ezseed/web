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

