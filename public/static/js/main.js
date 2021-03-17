//AOS.init({
//  duration: 800,
//  easing: "slide",
//  once: true,
//});

console.debug("main.js...");
jQuery(document).ready(function($) {
  "use strict";

  var siteMenuClone = function() {
    $(".js-clone-nav").each(function() {
      var $this = $(this);
      $this
        .clone()
        .attr("class", "site-nav-wrap")
        .appendTo(".site-mobile-menu-body");
    });

    setTimeout(function() {
      var counter = 0;
      $(".site-mobile-menu .has-children").each(function() {
        var $this = $(this);

        $this.prepend('<span class="arrow-collapse collapsed">');

        $this.find(".arrow-collapse").attr({
          "data-toggle": "collapse",
          "data-target": "#collapseItem" + counter,
        });

        $this.find("> ul").attr({
          class: "collapse",
          id: "collapseItem" + counter,
        });

        counter++;
      });
    }, 1000);

    $("body").on("click", ".arrow-collapse", function(e) {
      var $this = $(this);
      if (
        $this
          .closest("li")
          .find(".collapse")
          .hasClass("show")
      ) {
        $this.removeClass("active");
      } else {
        $this.addClass("active");
      }
      e.preventDefault();
    });

    $(window).resize(function() {
      var $this = $(this),
        w = $this.width();

      if (w > 768) {
        if ($("body").hasClass("offcanvas-menu")) {
          $("body").removeClass("offcanvas-menu");
        }
      }
    });

    $("body").on("click", ".js-menu-toggle", function(e) {
      var $this = $(this);
      e.preventDefault();

      if ($("body").hasClass("offcanvas-menu")) {
        $("body").removeClass("offcanvas-menu");
        $this.removeClass("active");
      } else {
        $("body").addClass("offcanvas-menu");
        $this.addClass("active");
      }
    });

    // click outisde offcanvas
    $(document).mouseup(function(e) {
      var container = $(".site-mobile-menu");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        if ($("body").hasClass("offcanvas-menu")) {
          $("body").removeClass("offcanvas-menu");
        }
      }
    });
  };
  siteMenuClone();
  
  var siteStellar = function() {
    $(window).stellar({
      responsive: true,
      parallaxBackgrounds: true,
      parallaxElements: true,
      horizontalScrolling: false,
      hideDistantElements: false,
      scrollProperty: "scroll",
    });
  };
  siteStellar();

  var siteCountDown = function() {
    if ($("#date-countdown").length > 0) {
      $("#date-countdown").countdown("2020/10/10", function(event) {
        var $this = $(this).html(
          event.strftime(
            "" +
              '<span class="countdown-block"><span class="label">%w</span> weeks </span>' +
              '<span class="countdown-block"><span class="label">%d</span> days </span>' +
              '<span class="countdown-block"><span class="label">%H</span> hr </span>' +
              '<span class="countdown-block"><span class="label">%M</span> min </span>' +
              '<span class="countdown-block"><span class="label">%S</span> sec</span>'
          )
        );
      });
    }
  };
  siteCountDown();

  var siteDatePicker = function() {
    if ($(".datepicker").length > 0) {
      $(".datepicker").datepicker();
    }
  };
  siteDatePicker();
});
