(function($) {
  $.kryptonite = function (url, options) {
    if (typeof url === "string") {
      options = options || {};
      options.url = url;
    } else {
      options = url;
    }
    options.dataType = "kryptonite";
    $.ajax(options);
  };
  
  $.kryptonite.handle = function (response) {
    var $els = $(response);
    $els.filter('section').each(function (i, el) {
      var $el = $(el);
      var selector = $el.attr('data-selector');
      var action = $el.attr('data-action') || $.kryptonite.options.defaultAction;
      if ($.kryptonite.options.alias[action] !== undefined) {
        action = $.kryptonite.options.alias[action];
      }
      var content = $el.html();
      $(selector)[action](content);
    });
    $els.filter('script').each(function (i, $el) {
      $("body").append($el);
    });
    return response;
  };
  
  $.kryptonite.options = {
    alias: {
      'replace': 'replaceWith',
      'replaceContent': 'html'
    },
    defaultAction: 'replaceContent'
  };

  $.ajaxSetup({
    converters: {
      "text kryptonite": $.kryptonite.handle
    }
  });
}(jQuery));