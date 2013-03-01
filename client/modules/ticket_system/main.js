(function() {

  /*
   * Our global module variables
   */

  var TICKET_HOST = Config.ticket_host,
      TICKET_TOKEN = Config.ticket_token,
      TICKET_USERS = Config.ticket_users,
      socket = io.connect('/tickets');

  /*
   * User Collection, calls fetch on initialize
   */
  var Users = Backbone.Collection.extend({
    url: 'http://' + TICKET_HOST + '/api/users/',

    initialize: function() {
      var self = this;

      this.fetch({
        success: function() {
          self.trigger('ready');
        }
      });
    },

    sync: function(method, model, options) {
      var newOptions = _.extend({
        beforeSend: function(xhr) {
          xhr.setRequestHeader("Accept", "application/json");
          xhr.setRequestHeader("X-Auth-Token", TICKET_TOKEN);
        }
      }, options);

      return Backbone.sync(method, model, newOptions);
    }
  });

  /*
   * Comment collection for each ticket
   */
  var Comments = Backbone.Collection.extend({
    sync: function(method, model, options) {
      var newOptions = _.extend({
        beforeSend: function(xhr) {
          xhr.setRequestHeader("Accept", "application/json");
          xhr.setRequestHeader("X-Auth-Token", TICKET_TOKEN);
        }
      }, options);

      return Backbone.sync(method, model, newOptions);
    }

  });

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
      return !this.get('read');
    },

    setCommentURL: function() {
      this.comments.url = 'http://' + TICKET_HOST + '/api/tickets/' + this.id + '/comments';
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
   *    'comment:new', userId: when the collection has added a new comment to a ticket
   *    'comment:remove', userId: when the collection has removed a comment from a ticket
   * }
   */
  var Tickets = Backbone.Collection.extend({
    model: Ticket,
    url: 'http://' + TICKET_HOST + '/api/tickets?status=open',

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
        self.add(data.body);
        self.trigger('ticket:new');
      });
      /*
       * Update a ticket on ticket:update event
       */
      socket.on('ticket:update', function(data) {
        self.updateTicket(data.body);
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

    sync: function(method, model, options) {
      var newOptions = _.extend({
        beforeSend: function(xhr) {
          xhr.setRequestHeader("Accept", "application/json");
          xhr.setRequestHeader("X-Auth-Token", TICKET_TOKEN);
        }
      }, options);

      return Backbone.sync(method, model, newOptions);
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
     * @return {Object} - { tickets: Number, comments: Number }
     */
    userCount: function(user) {
      var userImage,
          tickets = 0,
          comments = 0;

      /*
       * Filter by:
       * - if the ticket is open
       * - if the user created the ticket
       * - if the user is assigned to the ticket
       */
      this.each(function(ticket) {
        if(ticket.get('status') === 'open' && (ticket.get('user') === user.id ||
              ~ticket.get('assigned_to').indexOf(user.id))) {

          tickets += 1;
          comments += ticket.commentCount();
        }
      });

      return {
        tickets: tickets,
        comments: comments
      };
    },

    /*
     * get the number of new tickets
     * these are tickets that have been read
     *
     * @return {Number}
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
     * @event {comment:new} - triggers an event with userid of the new comment
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
     * @event {comment:remove} - triggers an event with userid of the removed comment
     */
    removeComment: function(ticketId, commentId) {
      var comment,
          ticket = this.get(ticketId);

      if(ticket) {
        comment = ticket.comments.get(commentId);
        ticket.comments.remove(commentId);
        this.trigger('comment:remove');
      }
    }
  });

  /*
   * Kinda like a controller
   */
  var TicketsController = Backbone.View.extend({
    id: 'tickets',
    className: 'module tall',

    initialize: function() {
      var self = this;

      this.users = new Users();
      this.tickets = new Tickets();
      this.readyFlag = false;

      //Assuming this will take longer than the user fetch
      this.tickets.on('ready', this.readyStatus, this);
      this.users.on('ready', this.readyStatus, this);

      /*
       * Update the comments for a user, or the ticket counts for all users
       */
      this.tickets.on('ticket:new ticket:update ticket:remove', this.calculateNew, this);
      this.tickets.on('ticket:new ticket:update ticket:remove', this.calculateUsers, this);
      this.tickets.on('comment:new comment:remove', this.calculateUsers, this);
    },

    render: function() {
      this.$el.html(Templates.ticket_system.base.render());
      this.calculateNew();
      var view = new UserListView({collection: this.users});
      this.$el.append(view.el);
    },

    /*
     * Check that both collections have been fetched, and
     * prune the users we aren't interested in
     */
    readyStatus: function() {
      if(this.readyFlag === true) {
        var self = this,
            remUsers = [],
            ticketUsers = TICKET_USERS;

        this.users.each(function(user) {
          if(ticketUsers && !~ticketUsers.indexOf(user.id)) {
            remUsers.push(user.id);
          }
        });
        /*
         * Prune the users
         */
        this.users.remove(remUsers);

        self.calculateUsers();
        self.render();
      }

      this.readyFlag = true;
    },

    /*
     * Calculate a users tickets and comments
     *
     * @bind {ticket:new}
     * @bind {ticket:update}
     * @bind {ticket:remove}
     * @bind {comment:new}
     * @bind {comment:remove}
     */
    calculateUsers: function() {
      var users = this.users,
          tickets = this.tickets;

      users.each(function(user) {
        user.set(tickets.userCount(user));
      });
    },

    /*
     * Update the new ticket count on ticket:new
     *
     * @bind {ticket:new}
     */
    calculateNew: function() {
      var newCount = this.tickets.newCount(),
          element = $('.js-new', this.$el);

      element.html(newCount);

      if(newCount !== 0) {
        if(!element.hasClass('red')) element.addClass('red');
      }
      else {
        if(element.hasClass('red')) element.removeClass('red');
      }
    }
  });

  /**
   * User List View
   */

  var UserListView = Backbone.View.extend({
    className: 'users_list',

    initialize: function() {
      this.render();
      return this.el;
    },

    render: function() {
      var self = this;

      this.collection.each(function(user) {
        var view = new UserView({
          id: user.id,
          model: user
        });

        self.$el.append(view.el);
      });
    }
  });

  /*
   * Our user subview that contains the logic to render a user
   *
   * @model {User}
   * @events {change:tickets}
   */
  var UserView = Backbone.View.extend({
    className: "user clearfix",

    initialize: function() {
      this.model.on('change:tickets', this.renderTicketUpdate, this);
      this.model.on('change:comments', this.renderCommentUpdate, this);
      this.render();
    },

    render: function() {
      this.$el.html(Templates.ticket_system.user.render(this.model.toJSON()));

      return this;
    },

    renderTicketUpdate: function() {
      var oldElement = $('.js-tickets', this.$el),
          newElement = oldElement.clone(true);

      /**
       * Remove animation classes if present
       */
      if(newElement.hasClass('anim-green')) {
        newElement.removeClass('anim-red');
      }
      if(newElement.hasClass('anim-green')) {
        newElement.removeClass('anim-red');
      }

      /**
       * Set the right animation if the count increased or decreased
       */
      if(this.model.get('tickets') > this.model.previous('tickets')) {
        newElement.addClass('anim-red');
      }
      else {
        newElement.addClass('anim-green');
      }

      newElement.html(this.model.get('tickets'));
      oldElement.before(newElement);
      oldElement.remove();
    },

    renderCommentUpdate: function() {
      var oldElement = $('.js-comments', this.$el),
          newElement = oldElement.clone(true);

      /**
       * Remove animation classes if present
       */
      if(newElement.hasClass('anim-green')) {
        newElement.removeClass('anim-green');
      }
      if(newElement.hasClass('anim-red')) {
        newElement.removeClass('anim-red');
      }

      /**
       * Set the right animation if the count increased or decreased
       */
      if(this.model.get('comments') < this.model.previous('comments')) {
        newElement.addClass('anim-red');
      }
      else {
        newElement.addClass('anim-green');
      }

      newElement.html(this.model.get('comments'));
      oldElement.before(newElement);
      oldElement.remove();
    }
  });


  /*
   * Return our main view
   */

  return TicketsController;

}).call(this);