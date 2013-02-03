
(function($) {
  "use strict";

  var log;
  $.kryptonite = function(url, opt) {
    var options;
    options = typeof opt === "object" ? opt : {};
    if (typeof opt === "function") {
      options.success = opt;
    }
    if (typeof url === "string") {
      options.url = url;
    } else {
      options = url;
    }
    options.dataType = "kryptonite";
    return $.ajax(options);
  };
  $.kryptonite.handle = function(response) {
    var $els;
    log.start();
    $els = $($.parseHTML(response));
    $els.filter("[data-selector]").each(function(i, el) {
      var $el, action, content, selector;
      $el = $(el);
      selector = $el.attr("data-selector");
      action = $el.attr("data-action") || $.kryptonite.options.defaultAction;
      if ($.kryptonite.options.alias[action] != null) {
        action = $.kryptonite.options.alias[action];
      }
      content = $el.html();
      if ($.kryptonite.options.uncomment) {
        content = $.kryptonite.uncomment(content);
      }
      $(selector).trigger("before:kryptonite", action);
      log.action(selector, action, content);
      $(selector)[action](content);
      return $(selector).trigger("after:kryptonite", action);
    });
    $els.filter("[data-eval]").each(function(i, el) {
      var script;
      script = $(el).data("eval");
      log["eval"](script);
      return $.globalEval(script);
    });
    return response;
  };
  $.kryptonite.options = {
    debug: false,
    uncomment: true,
    alias: {
      replace: "replaceWith",
      replaceContent: "html"
    },
    defaultAction: "replaceContent"
  };
  $.ajaxSetup({
    converters: {
      "text kryptonite": $.kryptonite.handle
    }
  });
  $.kryptonite.uncomment = function(string) {
    var result;
    result = string.match(/^\s*<!--(((?!-->).)*)-->\s*$/);
    if (result) {
      return result[1];
    } else {
      return string;
    }
  };
  return log = {
    action: function(selector, action, content) {
      if ($.kryptonite.debug) {
        console.log("---");
        console.log("selector '" + selector + "' -> " + ($(selector).size()) + " matches");
        if ($(selector).size() > 0) {
          console.log.apply(console, $(selector));
          return console.log("$('" + selector + "')." + action + "('" + content + "');");
        }
      }
    },
    "eval": function(script) {
      if ($.kryptonite.debug) {
        console.log("---");
        return console.log("evaluating script '" + script + "'");
      }
    },
    start: function() {
      if ($.kryptonite.debug) {
        return console.log(">>> kryptonite start");
      }
    },
    end: function() {
      if ($.kryptonite.debug) {
        return console.log("<<< kryptonite end");
      }
    }
  };
})(jQuery);
