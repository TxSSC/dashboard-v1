(function() {
  // Create the new lunch module
  var Tickets = { Models: {}, Views: {}, Collections: {} };

  /*
   * Dummy model for users
   */
  Tickets.Models.User = Backbone.Model.extend({});
  Tickets.Collections.Users = Backbone.Collection.extend({
    model: Tickets.Models.User,
    url: '/ticket-proxy/api/users',

    initialize: function() {
      var self = this;

      this.fetch({
        success: function() {
          self.trigger('fetch');
        }
      });

      this.poll();
    },

    poll: function() {
      var self = this;

      setInterval(function() {
        self.fetch();
      }, 30000);
    }

  });

  /*
   * Dummy ticket model, just used to hold dataz
   */
  Tickets.Models.Ticket = Backbone.Model.extend({});

  /*
   * The collection for the ticket module
   * Polls the server every 10 seconds
   */
  Tickets.Collections.Tickets = Backbone.Collection.extend({
    model: Tickets.Models.Ticket,
    url: '/ticket-proxy/api/tickets',

    initialize: function() {
      var self = this;

      this.fetch({
        success: function() {
          self.trigger('fetch');
        }
      });

      this.poll();
    },

    poll: function() {
      var self = this;

      setInterval(function() {
        self.fetch();
      }, 10000);
    }

  });


  Tickets.Views.Main = Backbone.View.extend({

    tagName: 'div',
    id: 'tickets',
    className: 'module',

    initialize: function() {
      this.tickets = new Tickets.Collections.Tickets();
      this.users = new Tickets.Collections.Users();

      //Rerender on fetch
      this.tickets.on('fetch', this.checkCollectionStatus, this);
      this.users.on('fetch', this.checkCollectionStatus, this);

      this.users.on('reset', this.renderBody, this);
      this.tickets.on('reset', this.renderBody, this);
    },

    //If both collections have been fetched render
    checkCollectionStatus: function() {
      if(!this._collectionStatus) {
        this._collectionStatus = true;
      }
      else {
        this.renderBody();
      }
    },

    render: function() {
      this.$el.html(Templates.ticket_system.base.render());

      return this;
    },

    renderBody: function() {
      var self = this;

      $('.stats tbody').empty();

      this.users.each(function(user) {

        var obj = {
          user: user.get('name')
        };
        obj.created = self.tickets.filter(function(ticket) {
          return ticket.get('user').id === user.id &&
                    ticket.get('status') === 'open';
        }).length;

        obj.assigned = self.tickets.filter(function(ticket) {
          return _.include(ticket.get('assigned_to'), user.id);
        }).length;

        obj.closed = self.tickets.filter(function(ticket) {
          return ticket.get('user').id === user.id &&
                    ticket.get('status') === 'closed';
        }).length;

        obj.total = obj.created + obj.assigned + obj.closed;


        $('.stats tbody', self.$el).append(Templates.ticket_system.row.render(obj));
      });


      return this;
    }

  });


  return Tickets.Views.Main;

}).call(this);