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
      return "https://www.googleapis.com/calendar/v3/calendars/" + Config.google_calendar_id + "/events/?maxResults=5&singleEvents=true&orderBy=startTime&key=" + Config.google_api_key;
    },

    initialize: function() {
      var self = this;

      this.fetch({
        success: function(model, response) {
          self.trigger('fetch');
        }
      });

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
    },

    render: function() {
      var self = this;

      this.collection.models.forEach(function(event) {
        var ev = self.renderEvent(event);
        self.$el.append(ev);
      });

      return this.$el;
    },

    renderEvent: function(event) {
      var attributes = event.toJSON(),
          monthArray = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
          date = attributes.start.date.split('-');

      var data = {
        title: attributes.summary,
        month: monthArray[parseInt(date[1], 10) - 1], // parse the string number and read from monthArray
        day: date[2]
      };

      return Templates.calendar.event.render(data);
    }

  });


  return MainView;

}).call(this);
