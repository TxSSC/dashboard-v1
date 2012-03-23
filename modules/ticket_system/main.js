(function() {
  /*
   * Dummy model for users
   */
  var User = Backbone.Model.extend({});
  var Users = Backbone.Collection.extend({
    model: User,
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
  var Ticket = Backbone.Model.extend({});

  /*
   * The collection for the ticket module
   * Polls the server every 10 seconds
   */
  var Tickets = Backbone.Collection.extend({
    model: Ticket,
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
      }, 30000);
    }

  });


  var MainView = Backbone.View.extend({

    tagName: 'div',
    id: 'tickets',
    className: 'module',

    initialize: function() {
      this.tickets = new Tickets();
      this.users = new Users();

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
      this.renderBody();

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


  return MainView;

}).call(this);