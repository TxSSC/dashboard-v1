# View factory from
# http://thurloat.com/2012/01/21/backbonejs-readable-modular-testable-views
#

class ViewFactory

  constructor: ->
    @eventBus = _.extend {}, Backbone.Events
    @registry =
      factory: @

  #Global event registry
  register: (key, value) ->
    @registry[key] = value

  create: (ViewClass, options) ->
    options = options or {}
    passedOptions = _.extend options, @registry, pubSub: @pubSub
    view = ViewClass
    view.prototype.eventBus = @eventBus
    new view(passedOptions)