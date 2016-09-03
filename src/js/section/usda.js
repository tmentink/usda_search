

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
        }); // end of inner loop

        // set icon class 
        icon = page.fa.fav_o;
        if (page.favorites.exists(foodID)) {
          icon = page.fa.fav;
        }

        // concat html string
        HTML += "<div class='searchItem' data-ndbno='" + foodID + "' data-name='" + foodName + "'>";
        HTML += foodName + "<i class='favorite " + icon + "'></i>";
        HTML += "</div>"

      }); // end of outer loop

      return HTML;
    }


    var _getNutrientHTML = function(data) {
      // format the header
      var header = data["report"]["foods"][0]["name"];
      if (header.length > 40) {
        header = header.slice(0,40) + "...";
      }
      
      // append header and severing size
      $cache("#nutrient-header").html(header);
      $cache("#nutrient-serving").html("Serving Size: " + data["report"]["foods"][0]["measure"]);

      // loop through data and build html
      var HTML = "";
      $.each(data["report"]["foods"][0]["nutrients"], function (i, obj) {
        var nutrientName, nutrientValue;
        $.each(obj, function (key, value) {
          switch(key) {
            case "nutrient":
              switch(value) {
                case "Total lipid (fat)":
                  nutrientName = "Fat";
                  break;

                case "Carbohydrate, by difference":
                  nutrientName = "Carbs";
                  break;

                case "Fiber, total dietary":
                  nutrientName = "Fiber";
                  break;

                default:
                  nutrientName = value;
                  break;
              }
              break;

            case "value":
              if (isNaN(value)) {
                nutrientValue = "";
              }
              else {
                nutrientValue = parseFloat(value).toFixed(1) + " g";
              }
              break;

          } // end of switch
        }); // end of inner loop

        // concat html string
        HTML += "<div>" + nutrientName + ": " + nutrientValue + "</div>";

      });   // end of outer loop

      return HTML;
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
          if (data["report"]["foods"].length > 0) {
            // build results html
            $cache("#nutrient-list").html(_getNutrientHTML(data));
          }
          else {
            // show no results
            $cache("#nutrient-list").html(_getErrorHTML());
          }

          // open the nutrient modal
          $cache("[data-remodal-id=modal]").remodal().open();
        },
        error: function (xhr, error) {
          //console.debug(xhr); console.debug(error);v
          
          // open the nutrient modal with error message
          $cache("#nutrient-list").html(_getErrorHTML());
          $cache("[data-remodal-id=modal]").remodal().open();
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