(function() {
  /*
   * The model for the lunch module
   * Polls the server every 10 seconds
   */
  var Lunch = Backbone.Model.extend({
    url: '/lunch-proxy/lunch',

    initialize: function() {
      var self = this;

      this.poll();
      this.fetch({
        success: function() {
          self.trigger('fetch');
        }
      });
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

      this.model.on('fetch', this.render, this);
    },

    render: function() {
      this.$el.html(Templates.lunch.base.render(this.model.toJSON()));
      if(!this.plot) this.renderPlot();

      //Make sure to re-render on change
      this.model.on('change:day', this.render, this);
      this.model.on('change:entities', this.renderPlot, this);

      return this;
    },

    packageData: function() {
      var data,
          self = this;

      data = this.model.get('entities').map(function(entity) {
        return { name: entity.name, data: [ entity.rating ] };
      });

      return data;
    },

    renderPlot: function() {
      var self = this;

      this.plot = new Highcharts.Chart({
        credits: {
          enabled: false
        },
        chart: {
          type: 'column',
          renderTo: $('.chart', self.$el).get(0),
          plotShadow: false,
          backgroundColor: 'transparent',
          width: 220,
          height: 160,
          spacingTop: 0,
          spacingRight: 0,
          spacingBottom: 0,
          spacingLeft: 0
        },
        title: {
          text: self.model.get('day'),
          style: {
            color: '#EEE'
          }
        },
        colors: [
          '#50b432',
          '#058DC7'
        ],
        xAxis: {
          categories: [],
          showFirstLabel: false,
          title: {
            text: 'Location',
            style: {
              'color': '#AAA',
              'font-size': '14px',
              'font-weight': 'normal'
            }
          }
        },
        yAxis: {
          min: 0,
          max: 8,
          title: {
            text: 'Rating',
            style: {
              'color': '#AAA',
              'font-size': '14px',
              'font-weight': 'normal'
            }
          }
        },
        legend: {
          layout: 'vertical',
          backgroundColor: '#EFEFEF',
          align: 'left',
          verticalAlign: 'top',
          x: 100,
          y: 30,
          floating: true,
          shadow: true
        },
        tooltip: {
          formatter: function() {
            return this.y + ' votes';
          }
        },
        plotOptions: {
          column: {
            pointPadding: 0.2,
            borderWidth: 0
          }
        },
        series: self.packageData()
      });

      return this;
    }
  });


  return MainView;

}).call(this);
