(function() {

  /**
   * Calendar Module
   *
   * Displays calendar events pulled from the Google Calendar
   * API. Calendar must be public so that the collection fetch
   * method can work. Google API Key and Calendar ID must be set
   * in the config.json file.
   */

  var Calendar = Backbone.Model.extend({});


  var CalendarCollection = Backbone.Collection.extend({

    url: function() {
      return "https://www.googleapis.com/calendar/v3/calendars/" + Config.google_calendar_id + "/events/?maxResults=6&singleEvents=true&orderBy=startTime&key=" + Config.google_api_key;
    },

    initialize: function() {
      var self = this;

      this.comparator = function(model) {
        return model.get("start").date;
      };

      this.fetch({
        success: function(collection, response) {
          self.trigger('fetch');
        }
      });

      // Fetch calendar events every 10 minutes
      setInterval(function() {
        self.fetch({
          success: function(collection, response) {
            self.trigger('update');
          }
        });
      }, 600000);

    },

    sync: function(method, model, options) {
      options.timeout = 10000;
      options.dataType = "jsonp";
      return Backbone.sync(method, model, options);
    },

    parse: function(response) {
      return response.items;
    }

  });


  var MainView = Backbone.View.extend({

    id: 'calendar',
    className: 'module small',

    initialize: function() {
      this.collection = new CalendarCollection();
      this.collection.on('fetch', this.render, this);
      this.collection.on('update', this.update, this);
    },

    render: function() {
      var self = this;

      this.collection.models.forEach(function(event) {
        var view = new EventView({id: event.id, model: event});
        self.$el.append(view.el);
      });

      return this.$el;
    },

    update: function() {
      $('.event', this.el).each(function(i) {
        $(this).remove();
      });

      this.render();
    }

  });


  var EventView = Backbone.View.extend({

    className: "event clearfix",

    initialize: function() {
      this.render(this.model);
      return this.el;
    },

    render: function(model) {
      var attributes = model.toJSON(),
          monthArray = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
          date = attributes.start.date.split('-');

      var data = {
        title: attributes.summary,
        month: monthArray[parseInt(date[1], 10) - 1], // parse the string number and read from monthArray
        day: date[2]
      };

      this.el.innerHTML = Templates.calendar.event.render(data);
    }
  });


  return MainView;

}).call(this);
