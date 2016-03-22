angular.module('stat')
   //camel cased directive name
   //in your HTML, this will be named as bars-chart
   .directive('barsChart', function ($parse) {
     //explicitly creating a directive definition variable
     //this may look verbose but is good for clarification purposes
     //in real life you'd want to simply return the object {...}
     var directiveDefinitionObject = {
         //We restrict its use to an element
         //as usually  <bars-chart> is semantically
         //more understandable
         restrict: 'E',
         //this is important,
         //we don't want to overwrite our directive declaration
         //in the HTML mark-up
         replace: false,
         link: function (scope, element, attrs) {
           //converting all data passed thru into an array


           var data = attrs.chartData.split(',');

           //in D3, any selection[0] contains the group
           //selection[0][0] is the DOM node
           //but we won't need that this time
           var chart = d3.select(element[0]);
           //to our original directive markup bars-chart
           //we add a div with out chart stling and bind each
           //data entry to the chart
            chart.append("div").attr("class", "chart")
             .selectAll('div')
             .data(data).enter().append("div")
             .transition().ease("elastic")
             .style("width", function(d) { return d + "%"; })
             .text(function(d) { return d + "%"; });
           //a little of magic: setting it's width based
           //on the data value (d)
           //and text all with a smooth transition
         }
      };
      return directiveDefinitionObject;
   })

  // .directive('barChart', function() {
  //   var chart = {
  //   restrict: 'E',
  //   replace: false,
  //   link: function(scope, element, attrs) {
  //     var numer = attrs.chartNum.split(',');
  //     var denom = attrs.chartDenom.split(',');
  //     var measure = attrs.chartMeasure.split(',');
  //     var viz = d3.select(element[0]);
  //     var stack = d3.layout.stack();
  //     var bars = ['', ''];
  //     if (denom <= 1) {
  //       return;
  //     } else {
  //       bars[0] = (numer / denom) * 100;
  //       bars[1] = (denom / numer) * 100;
  //     }
  //     // var layers = d3.layout.stack()(bars.map(function(c) {
  //     //   return {numer, denom};
  //     // }));
  //
  //     viz.append('div').attr('class', 'chart').selectAll('div').data(measure).enter().append('div').attr('ng-click', 'UC.changeStat()').transition().ease('elastic').style('width', function() {
  //       return bars[1] + "%";
  //     }).text(function(d) { return d;
  //     });
  //     }
  //   };
  //   return chart;
  // });

  .directive('barChart', function() {
    var chart = {
    restrict: 'E',
    replace: true,
    template: '<div class="chart"></div>',
    transclude: true,
    link: function(scope, element, attrs) {
      var numer = attrs.chartNum.split(',');
      var denom = attrs.chartDenom.split(',');
      var measure = attrs.chartMeasure.split(',');
      var viz = d3.select(element[0]);
      var stack = d3.layout.stack();
      var bars = ['', ''];
      if (denom <= 1) {
        return;
      } else {
        bars[0] = (numer / denom) * 100;
        bars[1] = (denom / numer) * 100;
        bars[2] = ((denom + numer) / (denom)) * 100;
      }
      // var layers = d3.layout.stack()(bars.map(function(c) {
      //   return {numer, denom};
      // }));

      viz.selectAll('div').data(measure).enter().append('div').attr('ng-click', 'UC.changeStat()').transition().ease('elastic').style('width', function() {
        return bars[1] + "%";
      }).text(function(d) { return d;
      });
      }
    };
    return chart;
  });
