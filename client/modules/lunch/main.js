(function() {
  /*
   * The model for the lunch module
   * Polls the server every 10 seconds
   */
  var Lunch = Backbone.Model.extend({
    initialize: function() {
      var self = this,
          socket = io.connect('http://localhost/lunch');

      //This looks like a bad idea
      socket.on('day:new', function(data) {
        self.set(data);
      });
      socket.on('day:update', function(data) {
        self.set(data);
      });
    }
  });


  var MainView = Backbone.View.extend({

    tagName: 'div',
    id: 'lunch',
    className: 'module small',

    initialize: function() {
      this.model = new Lunch();

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
          spacingTop: 0,
          spacingRight: 0,
          spacingBottom: 0,
          spacingLeft: 0,
          marginRight: 40
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
              'font-size': '16px',
              'font-weight': 'normal'
            }
          }
        },
        yAxis: {
          min: 0,
          max: 8,
          allowDecimals: false,
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
            'font-size': '18px'
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