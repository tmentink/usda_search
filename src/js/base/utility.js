

/*=================================
  Utility.js
  =================================*/

  var utility = (function () {

    /* selector_cache
    -------------------------------*/
    var selector_cache = function() {
      var elementCache = {};

      var get_from_cache = function( selector, $ctxt, reset ) {
        if ( 'boolean' === typeof $ctxt ) {
          reset = $ctxt;
          $ctxt = false;
        }
        var cacheKey = $ctxt ? $ctxt.selector + ' ' + selector : selector;

        if ( undefined === elementCache[ cacheKey ] || reset ) {
          elementCache[ cacheKey ] = $ctxt ? $ctxt.find( selector ) : jQuery( selector );
        }

        return elementCache[ cacheKey ];
      };

      get_from_cache.elementCache = elementCache;
      return get_from_cache;
    }


    /* debounce
    -------------------------------*/
    var debounce = function (fn, delay) {
      if (delay === undefined) { delay = 250; }

      var timer = null;
      return function () {
        var context = this, args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
          fn.apply(context, args);
        }, delay);
      };
    }


    /* throttle
    -------------------------------*/
    var throttle = function(fn, delay) {
      if (delay === undefined) { delay = 250; }

      var deferTimer,
          last;
      return function () {
        var context = this;

        var now = +new Date,
            args = arguments;
        if (last && now < last + delay) {
          // hold on to it
          clearTimeout(deferTimer);
          deferTimer = setTimeout(function () {
            last = now;
            fn.apply(context, args);
          }, delay);
        } else {
          last = now;
          fn.apply(context, args);
        }
      };
    }


    /* public methods
    -------------------------------*/
    return {
      selector_cache: selector_cache,
      debounce: debounce,
      throttle: throttle
    };

  })();