

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