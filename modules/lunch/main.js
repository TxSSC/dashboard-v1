define([
  "namespace",

  //Libs
  "use!backbone",
  "use!hogan"

  //Modules

  //Plugins
],

function(namespace, Backbone, Hogan) {

  // Create the new lunch module
  var Lunch = namespace.module();

  /*
   * The model for the lunch module
   * Polls the server every 10 seconds
   */
  Lunch.Model = Backbone.Model.extend({
    url: '/lunch-proxy/lunch',

    initialize: function() {
      this.poll();
    },

    poll: function() {
      var self = this;

      setInterval(function() {
        self.fetch();
      }, 10000);
    }

  });


  Lunch.Views.Main = namespace.ModuleView.extend({
    /*
     * TODO: Make this more elegant
     * ex. - templates/templ.html
     */
    template: "app/modules/lunch/templates/lunch.html",

    tagName: 'div',
    id: 'lunch',
    className: 'module module-small',

    initialize: function() {
      this.model = new Lunch.Model();
      this.model.fetch();

      //Make sure to re-render on change
      this.model.on('change:day', this.render, this);

      //Render entities on rendered event
      this.on('rendered', this.bindRender, this);
    },

    bindRender: function() {
      //Bind to the change event to re-render items
      this.model.on('change', this.renderEntities, this);
      this.renderEntities();
    },

    renderEntities: function() {
      var self = this,
          template = Hogan.compile('<li>{{name}} - {{rating}}</li>'),
          things = this.model.get('entities');
          voters = this.model.get('votees');

      $('.ranking', this.$el).fadeOut(100, function() {
        $(this).empty();

        _.chain(things)
          .sortBy(function(thing) {
            return -thing.rating;
          }).each(function(thing, idx) {
            $('.ranking', self.$el)
              .append(template.render(thing))
              .hide().fadeIn(100);
          });
      });
      $('.votees', this.$el).fadeOut(200, function() {
        $(this).empty();

        //Render voters
        _.each(voters, function(voter) {
          $('.votees', self.$el)
            .append($('<li>' + voter + '</li>')).fadeIn(100);
        });
      });

      return this;
    }

  });

  //Register the view and return
  namespace.Register.registerView(Lunch.Views.Main);
  return Lunch;

});
