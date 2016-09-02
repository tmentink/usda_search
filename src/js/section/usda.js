

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