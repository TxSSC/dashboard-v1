(function() {
  /*
   * The model for the lunch module
   * Polls the server every 10 seconds
   */
  var Lunch = Backbone.Model.extend({
    url: '/lunch-proxy/lunch',

    initialize: function() {
      this.poll();
    },

    poll: function() {
      var self = this;

      setInterval(function() {
        self.fetch();
      }, 30000);
    }

  });


  var MainView = Backbone.View.extend({

    tagName: 'div',
    id: 'lunch',
    className: 'module',

    initialize: function() {
      this.model = new Lunch();
      this.model.fetch();

      //Make sure to re-render on change
      this.model.on('change:day', this.render, this);
      this.model.on('change:entities', this.renderEntities, this);
    },

    render: function() {
      this.$el.html(Templates.lunch.base.render(this.model.toJSON()));
      this.renderEntities();

      return this;
    },

    renderEntities: function() {
      var self = this,
          things = this.model.get('entities');
          voters = this.model.get('votees');

      $('.ranking', this.$el).fadeOut(100, function() {
        $(this).empty();

        _.chain(things)
          .sortBy(function(thing) {
            return -thing.rating;
          }).each(function(thing) {
            $('.ranking', self.$el)
              .append(Templates.lunch.location.render(thing));
          });
      }).fadeIn(100);
      $('.votees', this.$el).fadeOut(100, function() {
        $(this).empty();

        //Render voters
        if((!self.model.isNew() && !voters.length) || (voters && !voters.length)) {
          $('.votees', self.$el).append($('<li class="shadow">No voters yet!</li>'));
        }
        else {
          _.each(voters, function(voter) {
          $('.votees', self.$el)
            .append($('<li class="shadow">' + voter + '</li>'));
          });
        }
      }).fadeIn(100);

      return this;
    }
  });


  return MainView;

}).call(this);
