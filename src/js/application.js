

/*=================================
  config.js
  =================================*/
  var myPage = (function(page) {
    "use strict";

    /* font awesome namespace
    -------------------------------*/
    page.fa = {
      filled: "fa fa-heart",
      outline: "fa fa-heart-o"
    };

    return page;

  })(myPage || {});


/*=================================
  utility.js
  =================================*/

  !(function (root) {
    "use strict";

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

    /* selector_cache
    -------------------------------*/
    if (root.jQuery) {
      var selector_cache = function() {
        var elementCache = {};

        var get_from_cache = function( selector, $ctxt, reset ) {
          if ( "boolean" === typeof $ctxt ) {
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
    }

    /* public methods
    -------------------------------*/
    root.utility = {
      debounce: debounce,
      throttle: throttle
    };

    if (selector_cache) {
      root.$cache = new selector_cache();
    } 

  })(this);


/*=================================
  favorites.js
  =================================*/
  var myPage = (function(page) {
    "use strict";

    /* database functions
    -------------------------------*/
    var _getFavorites = function() {
      var strFav = localStorage.getItem("usda.favorites");
      // nothing in localStorage
      if (strFav == null) {
        return [];
      }

      // convert json string into array
      strFav = JSON.parse(strFav);
      var arrFav = $.map(strFav, function(el) { return el });
      return arrFav;
    }

    var _setFavorites = function(arrFav) {
      localStorage.setItem("usda.favorites", JSON.stringify(arrFav));
    }


    /* public functions
    -------------------------------*/
    var exists = function(id) {
      var arrFav = _getFavorites();

      for(var i = 0, end = arrFav.length; i< end; i++) {
        // check if id matches
        if (arrFav[i].id == id) {
          return true;
        }
      }

      // id not found in array
      return false;
    }

    var update = function(objFav) {
      var arrFav = _getFavorites();

      // remove favorite then store array
      for (var i = 0, end = arrFav.length; i < end; i++) {
        if (arrFav[i].id == objFav.id) {
          arrFav.splice(i, 1);
          _setFavorites(arrFav);
          return -1;
        }
      }

      // add favorite then store array
      arrFav.push(objFav);
      _setFavorites(arrFav);
      return 1;
    }


    /* create favorites namespace
    -------------------------------*/
    page.favorites = {
      exists: exists,
      update: update
    };

    return page;

  })(myPage || {});


/*=================================
  usda.js
  =================================*/
  var myPage = (function(page) {
    "use strict";

    /* variables
    -------------------------------*/
    var usda_api = {
      key: "hd8s8xQRSVIJ2H8CZfCDbZvDtuBus8RUyPwsxruG",
      searchURL: "http://api.nal.usda.gov/ndb/search/?format=json",
      nutrientURL: "http://api.nal.usda.gov/ndb/nutrients/?format=json"
    };

    var nutrients = {
      protein: "203",
      fat: "204",
      carbs: "205",
      fiber: "291"
    };


    /* url functions
    -------------------------------*/
    var _getSearchURL = function(query) {
      var URL = usda_api.searchURL;
      URL += "&api_key=" + usda_api.key;
      URL += "&q=" + query;

      return URL;
    }

    var _getNutrientURL = function(id) {
      var URL = usda_api.nutrientURL;
      URL += "&api_key=" + usda_api.key;
      URL += "&nutrients=" + nutrients.protein;
      URL += "&nutrients=" + nutrients.fat;
      URL += "&nutrients=" + nutrients.carbs;
      URL += "&nutrients=" + nutrients.fiber;
      URL += "&ndbno=" + id;

      return URL;
    }


    /* html functions
    -------------------------------*/
    var _getResultsHTML = function(data) {
      var HTML = "";
      
      // loop through data and build HTML
      $.each(data["list"]["item"], function (i, obj) {
        var foodName, foodID, icon;
        $.each(obj, function (key, value) {
          switch(key) {
            case "name":
              foodName = value;
              break;
            case "ndbno":
              foodID = value;
              break;
          }
        });

        // set icon class 
        icon = page.fa.outline;
        if (page.favorites.exists(foodID)) {
          icon = page.fa.filled;
        }

        // concat string
        HTML += "<div class='searchItem' data-ndbno='" + foodID + "' data-name='" + foodName + "'>";
        HTML += foodName + "<i class='favorite " + icon + "'></i>";
        HTML += "</div>"
      });

      return HTML;
    }

    var _getNutrientHTML = function(data) {

    }

    var _getErrorHTML = function() {
      return "<div style='text-align:center;'>No results found</div>"
    }


    /* ajax calls
    -------------------------------*/
    var search = function(query) {
      $.ajax({
        type: "GET",
        url: _getSearchURL(query),
        success: function (data) {
          $cache("#results").html(_getResultsHTML(data));
        },
        error: function (xhr, error) {
          //console.debug(xhr); console.debug(error);
          $cache("#results").html(_getErrorHTML());
        }
      });
    }

    var getNutrients = function(id) {
      $.ajax({
        type: "GET",
        url: _getNutrientURL(id),
        success: function (data) {
          console.log('success');
        },
        error: function (xhr, error) {
          //console.debug(xhr); console.debug(error);
        }
      });
    }


    /* create usda namespace
    -------------------------------*/
    page.usda = {
      search: search,
      getNutrients: getNutrients
    };

    return page;

  })(myPage || {});


/*=================================
  page_events.js
  =================================*/
  !function(page) {
    "use strict";

    /* txtSearch
    -------------------------------*/
    $cache("#txtSearch").on("keypress", function(e) {
      // pressed enter key
      if (e.keyCode === 13) {
        e.preventDefault();

        // search usda database
        var query = $cache("#txtSearch").val();
        page.usda.search(query);

        // remove focus
        $cache("#txtSearch").blur();
      }
    });


    /* results
    -------------------------------*/
    $cache("#results")
      // fetch nutrient data
      .on("click", ".searchItem", function() {
        var id = $(this).attr('data-ndbno');
        page.usda.getNutrients(id);
      })

      // toggle favorite
      .on("click", ".favorite", function(e) {
        e.stopPropagation();
        $(this).toggleClass(page.fa.filled + " " + page.fa.outline);

        var id = $(this).parent().attr("data-ndbno");
        var name = $(this).parent().attr("data-name");

        var objFav = {
          id: id,
          name: name
        };

        page.favorites.update(objFav);
      });

  }(myPage);