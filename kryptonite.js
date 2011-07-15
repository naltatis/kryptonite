(function($) {
  $.kryptonite = function (url, opt) {
    options = (typeof opt === "object") ? opt : {};
    if (typeof opt === "function") {
      options.success = opt;
    }
    if (typeof url === "string") {
      options.url = url;
    } else {
      options = url;
    }
    options.dataType = "kryptonite";
    $.ajax(options);
  };
  
  $.kryptonite.uncomment = function (string) {
    return string.replace(/^\s*<!--/, '').replace(/(-->\s*$)/, '');
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
      var content = $.kryptonite.uncomment($el.html());
      //console.log(selector, action, content);
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