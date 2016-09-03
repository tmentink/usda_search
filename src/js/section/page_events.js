

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
        $(this).toggleClass(page.fa.fav + " " + page.fa.fav_o);

        var id = $(this).parent().attr("data-ndbno");
        var name = $(this).parent().attr("data-name");

        var objFav = {
          id: id,
          name: name
        };

        page.favorites.update(objFav);
      });

  }(myPage);