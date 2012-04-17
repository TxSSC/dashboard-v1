(function() {
  /**
   * Our global module variables
   */
  var STALKER_URL = Config.stalker_api_url,
      socket = io.connect('/stalker');

  /**
   * Stalker Module
   *
   */
  var Stalker = Backbone.Model.extend({
    idAttribute: "_id"
  });


  var StalkerCollection = Backbone.Collection.extend({
    model: Stalker,
    url: STALKER_URL + '/users/',

    initialize: function() {
      var self = this;

      this.fetch({
        success: function(collection, response) {
          self.trigger('fetch');
        }
      });

      /*
       * add a new stalker on stalker:new event
       */
      socket.on('user:save', function(data) {
        self.add(data);
      });
      /*
       * Update a stalker on stalker:update event
       */
      socket.on('user:update', function(data) {
        self.updateStalker(data);
      });
    },

    /*
     * Update a stalker that should be in the collection
     * with `data`
     *
     * @param {data} - the data that was recieved from the stalker:new event
     */
    updateStalker: function(data) {
      var model = this.get(data._id);

      if(model) {
        model.set(model.parse(data));
      }
    }
  });


  var MainView = Backbone.View.extend({

    id: 'stalker',
    className: 'module tall',

    initialize: function() {
      this.collection = new StalkerCollection();
      this.collection.on('fetch', this.render, this);
      this.collection.on('add', this.add, this);
    },

    render: function() {
      var self = this;

      this.el.innerHTML = Templates.stalker.base.render();

      this.collection.models.forEach(function(stalker) {
        var view = new StalkerView({id: stalker.id, model: stalker});
        self.$el.append(view.el);
      });

      return this.$el;
    },

    add: function(stalker) {
      var view = new StalkerView({id: stalker.id, model: stalker});
      this.$el.append(view.el);
    }

  });


  var StalkerView = Backbone.View.extend({

    className: "stalker clearfix",

    initialize: function() {
      this.render(this.model);
      this.model.on('change:location', this.update, this);
      return this.el;
    },

    render: function(model) {
      var attributes = model.toJSON();

      var data = {
        name: attributes.name,
        avatar: attributes.avatar,
        location: attributes.location
      };

      this.el.innerHTML = Templates.stalker.stalker.render(data);
    },

    update: function() {
      $('.location', this.$el).html(this.model.get('location'));
    }
  });


  return MainView;

}).call(this);
