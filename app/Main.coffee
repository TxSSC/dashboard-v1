$(document).ready () ->
  window.Dashboard = { Views: [], Models: [], Collections: [] }

  Object.keys(modules).forEach (module) ->
    console.log modules[module]
    if typeof modules[module] is 'object' and modules[module].View
      newView = new modules[module].View()
      Dashboard.Views.push newView
      newView.render (el) ->
        $(body).append el