$(document).ready () ->
  window.Dashboard = { Views: [], Models: [], Collections: [] }

  container = $('#main')

  container.masonry({ isAnimated: true })

  Object.keys(modules).forEach (module) ->
    if typeof modules[module] is 'function'
      newView = new modules[module]()
      Dashboard.Views.push newView
      container.append newView.render().el

  container.masonry('reload');