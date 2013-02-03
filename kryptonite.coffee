(($) ->
  "use strict"
  $.kryptonite = (url, opt) ->
    options = if (typeof opt is "object") then opt else {}
    options.success = opt if typeof opt is "function"
    if typeof url is "string"
      options.url = url
    else
      options = url
    options.dataType = "kryptonite"
    $.ajax options

  $.kryptonite.handle = (response) ->
    log.start()
    $els = $($.parseHTML(response))

    $els.filter("[data-selector]").each (i, el) ->
      $el = $(el)
      selector = $el.attr("data-selector")
      action = $el.attr("data-action") or $.kryptonite.options.defaultAction
      action = $.kryptonite.options.alias[action] if $.kryptonite.options.alias[action]?
      content = $el.html()
      content = $.kryptonite.uncomment(content) if $.kryptonite.options.uncomment

      # deliberately execute 'selector' multiple times, because
      # elements might get removed or replaced in between
      $(selector).trigger "before:kryptonite", action
      log.action(selector, action, content)
      $(selector)[action] content
      $(selector).trigger "after:kryptonite", action

    $els.filter("[data-eval]").each (i, el) ->
      script = $(el).data("eval")
      log.eval(script)
      $.globalEval script

    response

  $.kryptonite.options =
    debug: false
    uncomment: true
    alias:
      replace: "replaceWith"
      replaceContent: "html"
    defaultAction: "replaceContent"

  # register to jQuery's ajax chain
  $.ajaxSetup converters:
    "text kryptonite": $.kryptonite.handle

  # uncomments a html string if its completly comment wrapped
  $.kryptonite.uncomment = (string) ->
    result = string.match /^\s*<!--(((?!-->).)*)-->\s*$/
    if result then result[1] else string

  # logging
  log =
    action: (selector, action, content) ->
      if $.kryptonite.debug
        console.log "---"
        console.log "selector '#{selector}' -> #{$(selector).size()} matches"
        if $(selector).size() > 0
          console.log.apply console, $(selector)
          console.log "$('#{selector}').#{action}('#{content}');"
    eval: (script) ->
      if $.kryptonite.debug
        console.log "---"
        console.log "evaluating script '#{script}'"
    start: ->
      console.log ">>> kryptonite start" if $.kryptonite.debug
    end: ->
      console.log "<<< kryptonite end" if $.kryptonite.debug

)(jQuery)