(function() {
  /*
   * Our weather model
   */
  var Weather = Backbone.Model.extend({
    url: '/weather-proxy/forecastjson?w=12792267',

    initialize: function() {
      var self = this;

      this.fetch();

      //Fetch the weather every 15 minutes
      setInterval(function() {
        self.fetch();
      }, 9000000);
    }

  });


  var MainView = Backbone.View.extend({

    tagName: 'div',
    id: 'weather',
    className: 'module',

    initialize: function() {
      this.model = new Weather();

      this.model.on('change', this.renderUpdate, this);
    },

    render: function() {
      this.$el.html(Templates.weather.base.render());

      return this;
    },

    renderBody: function(data) {
      var self = this,
          model = this.model;

      $('.condition', this.$el).html(imgTmpl);
      $('.condition', this.$el).append(Templates.weather.conditions.render(model.toJSON()));

      _.each(model.get('forecast'), function(day) {
        $('.forecast', self.$el).append(Templates.weather.forecast.render(day));
      });

      return this;
    },

    renderUpdate: function() {
      var self = this,
          model = this.model;

      //Change condition if it was changed
      if(model.hasChanged('condition')) {
        $('.weather', this.$el).fadeOut(200, function() {
          $('.condition', this.$el).html(Templates.weather.conditions.render(model.toJSON()));

        }).fadeIn(200);
      }
      //Change forecast if updated
      if(model.hasChanged('forecast')) {
        $('.forecast', this.$el).fadeOut(200, function() {
          var elem = $(this);
          elem.empty();

          _.each(model.get('forecast'), function(day) {
            elem.append(Templates.weather.forecast.render(day));
          });

        }).fadeIn(200);
      }

      return this;
    }

  });


  return MainView;

}).call(this);
