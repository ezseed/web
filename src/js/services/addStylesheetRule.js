angular.module('ezseed')
.factory('$addStylesheetRule', function() {

  /**
   * Adds a css rule
   * Adapted from http://stackoverflow.com/questions/4481485/changing-css-pseudo-element-styles-via-javascript
   * addRule(sheet)("p:before", {
   *     display: "block",
   *     width: "100px",
   *     height: "100px",
   *     background: "red",
   *     "border-radius": "50%",
   *     content: "''"
   * });
   */
  return function(sheet) {
    return function (selector, css) {
        var propText = typeof css === "string" ? css : Object.keys(css).map(function (p) {
            return p + ":" + (p === "content" ? "'" + css[p] + "'" : css[p]);
        }).join(";");
        sheet.insertRule(selector + "{" + propText + "}", sheet.cssRules.length);

        return sheet;
    };
  }

})
