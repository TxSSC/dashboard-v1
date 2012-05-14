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
    url: 'http://' + LUNCH_HOST + '/day/today',

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

    id: 'lunch',
    className: 'module small',

    initialize: function() {
      this.model = new Lunch();

      this.model.on('fetch', this.render, this);
      this.model.on('change:day', this.render, this);
      this.model.on('change:locations', this.renderPlot, this);
    },

    render: function() {
      this.renderPlot();

      return this;
    },

    packageData: function() {
      var data,
          self = this;

      data = this.model.get('locations').map(function(location) {
        return { name: location.name, data: [ location.rating ] };
      });

      return data;
    },

    renderPlot: function() {
      var plot,
          self = this;

      var weekday = self.model.get('day').substring(0,3),
          day = self.model.get('day').substring(8,11);

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
          spacingTop: 15,
          spacingRight: 40,
          spacingBottom: 8,
          spacingLeft: 8
        },
        title: {
          text: '',
          style: {
            'font-family': '"Helvetica Neue", Helvetica, Arial, sans-serif',
            'font-weight': 'bold',
            'color': '#D3D4D4',
            'font-size': '24px',
            'text-align': 'center',
            'padding': '0.3em 0',
            'text-shadow' : 'none',
            'border-bottom': '1px solid #151617'
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
              'font-family': '"Helvetica Neue", Helvetica, Arial, sans-serif',
              'color': '#D3D4D4',
              'font-size': '16px',
              'font-weight': 'normal'
            }
          },
          lineColor: '#444',
          tickColor: '#444',
          tickWidth: 0
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
              'font-family': '"Helvetica Neue", Helvetica, Arial, sans-serif',
              'color': '#D3D4D4',
              'font-size': '16px',
              'font-weight': 'normal'
            }
          },
          gridLineColor: '#444',
          lineColor: '#444'
        },
        legend: {
          layout: 'vertical',
          backgroundColor: '#EFEFEF',
          align: 'left',
          verticalAlign: 'top',
          x: 54,
          y: 35,
          floating: true,
          shadow: true,
          itemStyle: {
            'color': '#222',
            'font-size': '14px',
            'line-height': '1.2em',
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