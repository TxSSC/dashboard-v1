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
  var Weather = namespace.module();

  Weather.Models.Yahoo = Backbone.Model.extend({
    url: '/weather-proxy/forecastjson?w=12792267',

    initialize: function() {
      var self = this;

      this.fetch();

      //Fetch the weather every 15 minutes
      setInterval(function() {
        self.fetch();
        self.trigger('change');
      }, 9000000);
    }

  });


  Weather.Views.Main = namespace.ModuleView.extend({

    template: "app/modules/weather/templates/base.html",

    tagName: 'div',
    id: 'weather',
    className: 'module module-small',

    initialize: function() {
      this.model = new Weather.Models.Yahoo();

      this.on('rendered', this.renderBody, this);
      this.model.on('change', this.renderUpdate, this);
    },

    renderBody: function(data) {
      var self = this,
          model = this.model;
          imgTmpl = '<img src="' + model.get('condition').image + '" />',
          conditionTmpl = Hogan.compile('<ul> \
            <li>{{location.city}}</li><li>Wind speed: {{wind.speed}}</li> \
            <li>Condition: {{condition.text}}</li><li>Temp: {{condition.temperature}}&deg;</li> \
            </ul>'),
          castTmpl = Hogan.compile('<div class="day"> <h1>{{day}}</h1><ul> \
            <li><b>Condition:</b> {{condition}}</li> \
            <li><b>High:</b> {{high_temperature}}&deg;</li> \
            <li><b>Low:</b> {{low_temperature}}&deg;</li> \
            </ul></div>');

      $('.weather', this.$el).fadeOut(200, function() {

        $('.condition', self.$el).html(imgTmpl);
        $('.condition', self.$el).append(conditionTmpl.render(model.toJSON()));

        _.each(model.get('forecast'), function(day) {
          $('.forecast', self.$el).append(castTmpl.render(day));
        });

      }).fadeIn(200);


      return this;
    },

    renderUpdate: function() {
      var self = this,
          model = this.model;
          imgTmpl = '<img src="' + model.get('condition').image + '" />',
          castTmpl = Hogan.compile('<div class="day"> <h1>{{day}}</h1><ul>\
            <li><b>Condition:</b> {{condition}}</li> \
            <li><b>High:</b> {{high_temperature}}&deg;</li> \
            <li><b>Low:</b> {{low_temperature}}&deg;</li> \
            </ul></div>');

      //Change condition if it was changed
      if(model.hasChanged('condition')) {
        $('.weather', this.$el).fadeOut(200, function() {
          $('.condition', this.$el).html(imgTmpl);
        }).fadeIn(200);
      }
      //Change forecast if updated
      if(model.hasChanged('forecast')) {
        $('.forecast', this.$el).fadeOut(200, function() {
          var elem = $(this);
          elem.empty();

          _.each(model.get('forecast'), function(day) {
            elem.append(castTmpl.render(day));
          });

        }).fadeIn(200);
      }

      return this;
    }

  });

  //Register the view and return
  namespace.Register.registerView(Weather.Views.Main);
  return Weather;

});
