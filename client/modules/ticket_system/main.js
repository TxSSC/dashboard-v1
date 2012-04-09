(function() {
  /*
   * Our module socket connection
   */
  var socket = io.connect('http://localhost/tickets');

  // /*
  //  * Base ticket activity model
  //  */
  // var TicketActivityItem = Backbone.Model.extend({});
  // /*
  //  * Ticket activity collection, caches to localstorage
  //  * as events come in
  //  * Sorted by `ticket.timestamp`
  //  */
  // var TicketActivity = Backbone.Collection.extend({
  //   model: TicketActivityItem,
  //   localStorage: new Backbone.LocalStorage('ticket-activity'),

  //   initialize: function() {
  //     var self = this;

  //     //Bind to ticket
  //     socket.on('ticket:new', function(data) {
  //       self.newTicket(data);
  //     });
  //     //Bind to ticket update
  //     socket.on('ticket:update', function(data) {
  //       self.updateTicket(data);
  //     });
  //     socket.on('ticket:remove', function(data){
  //       self.removeTicket(data);
  //     });

  //   },

  //   comparator: function(model) {
  //     return model.timestamp;
  //   },

  //   newTicket: function(data) {
  //     var self = this;


  //   }
  // });


  /*
   * Base User model
   */
  var User = Backbone.Model.extend({});

  /*
   * User Collection, calls fetch on initialize
   */
  var Users = Backbone.Collection.extend({
    model: User,
    url: '/ticket-system/api/users/',

    initialize: function() {
      var self = this;
      this.fetch({
        success: function() {
          self.trigger('fetch');
        }
      });
    }
  });


  /*
   * Base comment model
   */
  var Comment = Backbone.Model.extend({});
  /*
   * Comment collection for each ticket
   */
  var Comments = Backbone.Collection.extend({ model: Comment });

  /*
   * Base ticket model
   */
  var Ticket = Backbone.Model.extend({
    initialize: function() {
      var self = this;
      this.comments = new Comments();
      this.setCommentURL();

      this.on('change', function() {
        self.setCommentURL();
      });
    },

    /*
     * Is this a new ticket?
     */
    newStatus: function() {
      return this.get('read') && this.get('read') === false;
    },

    setCommentURL: function() {
      this.comments.url = '/ticket-system/api/tickets/' + this.id + '/comments';
    },

    commentCount: function() {
      return this.comments.length;
    }
  });

  /*
   * Ticket list collection, fetched via Backbone.sync on page
   * and updated with socket events
   *
   * @events
   * {
   *    'ready': when the collection have fetched all tickets and comments
   *    'ticket:new': when the collection has a new ticket
   *    'ticket:update': when the collection has updated a ticket
   *    'ticket:remove': when the collection has removed a ticket
   *    'comment:new': when the collection has added a new comment to a ticket
   *    'comment:remove': when the collection has removed a comment from a ticket
   * }
   */
  var Tickets = Backbone.Collection.extend({
    model: Ticket,
    url: '/ticket-system/api/tickets/',

    initialize: function() {
      var self = this;

      /*
       * set the number of comment collections fetched
       */
      this.readyCount = 0;

      this.fetch({
        success: function() {
          self.fetchComments();
        }
      });

      this.on('add', this.fetchComments, this);

      /*
       * add a new ticket on ticket:new event
       */
      socket.on('ticket:new', function(data) {
        self.add(data);
        self.trigger('ticket:new');
      });
      /*
       * Update a ticket on ticket:update event
       */
      socket.on('ticket:update', function(data) {
        self.updateTicket(data);
      });
      /*
       * Remove a ticket on ticket:remove event
       */
      socket.on('ticket:remove', function(id) {
        self.removeTicket(id);
      });

      /*
       * add a comment on comment:new
       */
      socket.on('comment:new', function(data) {
        self.addComment(data.ticket, data.body);
      });

      /*
       * remove a comment on comment:remove
       */
      socket.on('comment:remove', function(data) {
        self.removeComment(data.ticket, data.comment);
      });

    },

    /*
     * Fetch all the comments for each ticket
     */
    fetchComments: function(model) {
      var self = this;

      if(model) {
        model.comments.fetch();
      }
      else {
        this.each(function(ticket) {
          ticket.comments.fetch({
            success: function() {
              self.checkStatus();
            }
          });
        });
      }
    },

    /*
     * If ticket collection and all ticket comments have been fetched,
     * fire a ready event.
     */
    checkStatus: function() {
      if(this.readyCount === this.length - 1) {
        this.trigger('ready');
      }

      this.readyCount++;
    },

    /*
     * Update a ticket that should be in the collection
     * with `data`
     *
     * @param {data} - the data that was recieved from the ticket:new event
     */
    updateTicket: function(data) {
      var model = this.get(data.id);

      if(model) {
        model.set(model.parse(data));
        this.trigger('ticket:update');
      }
    },

    /*
     * Remove the ticket from the collection with id `id`
     *
     * @param {id} - the id of the ticket to remove from the collection
     */
    removeTicket: function(id) {
      var ticket = this.get(id);

      if(ticket) {
        this.remove(id);
        this.trigger('ticket:remove');
      }
    },

    /*
     * Count the number of tickets a specified user has
     *
     * @param {userid} - backbone.model, the user to tally
     * @return { tickets: int, comments: int }
     */
    userCount: function(user) {
      var userImage,
          tickets = 0,
          comments = 0;

      this.each(function(ticket) {
        if(ticket.get('user').id === user.id &&
              ticket.get('status') === 'open') {
          tickets += 1;
        }

        comments += ticket.comments.filter(function(comment) {
          return comment.get('user').id === user.id;
        }).length;
      });

      return {
        image: user.get('avatar'),
        tickets: tickets,
        comments: comments
      };
    },

    /*
     * get the number of new tickets
     * these are tickets that have been read
     */
    newCount: function() {
      var newCount = this.filter(function(ticket) {
        return ticket.newStatus();
      }).length;

      return newCount;
    },

    /*
     * Add a comment to the specified ticket
     *
     * @param {ticketId} - ticket to add the comment to
     * @param {comment} - comment object to add
     */
    addComment: function(ticketId, comment) {
      var ticket = this.get(ticketId);

      if(ticket) {
        ticket.comments.add(comment);
        this.trigger('comment:new');
      }
    },

    /*
     * remove a comment from the specifed `ticket`
     *
     * @param {ticketId} - ticket id of the comment
     * @param {commentId} - comment id to remove
     */
    removeComment: function(ticketId, commentId) {
      var ticket = this.get(ticketId);

      if(ticket) {
        ticket.comments.remove(commentId);
        this.trigger('comment:remove');
      }
    }
  });


  var TicketListView = Backbone.View.extend({
    id: 'tickets',
    className: 'module small',

    initialize: function() {
      var self = this;

      this.users = new Users();

      this.tickets = new Tickets();

      //Assuming this will take longer than the user fetch
      this.tickets.on('ready', function() {
        self.render();
      });

      this.tickets.on('ticket:new ticket:update ticket:remove', this.render, this);
      this.tickets.on('comment:new comment:remove', this.render, this);
    },

    render: function() {
      var data = {
        numNew: this.tickets.newCount()
      };

      this.$el.html(Templates.ticket_system.base.render(data));
      this.renderUsers();

      return this;
    },

    renderUsers: function() {
      var tickets = this.tickets,
          element = $('.ticket-count-list', this.$el);

      this.users.each(function(user) {
        element.append(Templates.ticket_system.user.render(tickets.userCount(user)));
      });

      return this;
    }
  });


  var MainView = Backbone.View.extend({
    id: 'tickets',
    className: 'module',
    events: {
      "click .swap-view": "swapView"
    },

    initialize: function() {
      this.currentView = new TicketView();
      this.secondaryView = new TicketActivity();


      this.render();
    },

    swapView: function(e) {
      var ref,
          self = this;

      e.preventDefault();

      this.$el.fadeOut(200, function() {
        self.$el.html(self.secondaryView.$el);
        ref = self.secondaryView;
        self.secondaryView = self.currentView;
        self.currentView = ref;

        self.fadeIn(200);
      });
    }

  });


  //return MainView;
  return TicketListView;

}).call(this);