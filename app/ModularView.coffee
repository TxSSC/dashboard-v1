# ModularView is from
# https://gist.github.com/1655106
#

class ModularView extends Backbone.View

  delegateEvents: (events) ->
    super

    @globalEvents = @globalEvents or {}
    for event, handler of @globalEvents
      @options.pubSub.bind event, _.bind @[handler], @