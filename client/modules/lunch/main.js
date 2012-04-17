(function() {
  /**
   * Our global module variables
   */
  var LUNCH_HOST = Config.lunch_host,
      socket = io.connect('/lunch');

  /*
   * The model for the lunch module
   * Polls the server every 10 seconds
   */
  var Lunch = Backbone.Model.extend({
    url: 'http://' + LUNCH_HOST + '/lunch',

    initialize: function() {
      var self = this;

      //This looks like a bad idea
      socket.on('day:new', function(data) {
        self.set(data);
      });
      socket.on('day:update', function(data) {
        self.set(data);
      });

      this.fetch({
        success: function() {
          self.trigger('fetch');
        }
      });
    }
  });


  var MainView = Backbone.View.extend({

    tagName: 'div',
    id: 'lunch',
    className: 'module small',

    initialize: function() {
      this.model = new Lunch();

      this.model.on('fetch', this.render, this);
      this.model.on('change:day', this.render, this);
      this.model.on('change:entities', this.renderPlot, this);
    },

    render: function() {
      this.renderPlot();

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
      var plot,
          self = this;

      plot = new Highcharts.Chart({
        credits: {
          enabled: false
        },
        chart: {
          type: 'column',
          renderTo: self.$el.get(0),
          plotShadow: false,
          backgroundColor: 'transparent',
          alignTicks: false,
          spacingTop: 8,
          spacingRight: 40,
          spacingBottom: 8,
          spacingLeft: 8
        },
        title: {
          text: self.model.get('day'),
          style: {
            color: '#DDD',
            'font-size': '22px'
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
              'font-size': '16px',
              'font-weight': 'normal'
            }
          }
        },
        yAxis: {
          min: 0,
          max: 8,
          allowDecimals: false,
          labels: {
            style: {
              'text-shadow': 'none'
            }
          },
          title: {
            text: 'Rating',
            style: {
              'color': '#AAA',
              'font-size': '16px',
              'font-weight': 'normal'
            }
          }
        },
        legend: {
          layout: 'vertical',
          backgroundColor: '#EFEFEF',
          align: 'left',
          verticalAlign: 'top',
          x: 54,
          y: 28,
          floating: true,
          shadow: true,
          itemStyle: {
            'color': '#444',
            'font-size': '18px',
            'text-shadow': 'none'
          }
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