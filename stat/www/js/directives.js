// // angular.module('stat')
// //   .directive('barChart', ['d3Service', function(d3Service) {
// //     return {
// //       link: function(scope, element, attrs) {
// //         d3Service.d3().then(function(d3) {
// //           console.log('d3');
// //         });
// //       },
// //       restrict: 'EA',
// //       scope: {
// //         data: '='
// //       }
// //     };
// //   }])
// //
// //   .directive('d3Bars', ['d3Service', function(d3Service) {
// //     return {
// //       restrict: 'EA',
// //       scope: {
// //         data: '='
// //       },
// //       link: function(scope, element, attrs) {
// //         d3Service.d3().then(function(d3) {
// //           var margin = parseInt(attrs.margin) || 20;
// //           var barHeight = parseInt(attrs.barHeight) || 20;
// //           var barPadding = parseInt(attrs.barPadding) || 5;
// //           var svg = d3.select(element[0])
// //               .append("svg")
// //               .style('width', '100%');
// //
// //           window.onresize = function() {
// //             scope.$apply();
// //
// //           scope.render = function(data) {
// //             svg.selectAll('*').remove();
// //
// //             if (!data) {
// //               return;
// //             }
// //
// //             var width = d3.select(ele[0]).node().offsetWidth - margin;
// //             var height = scope.data.length * (barHeight + barPadding);
// //             var color = d3.scale.category20();
// //             var xScale = d3.scale.linear().domain([0, d3.max(data, function(d) {
// //               return d.numerator;
// //             })])
// //               .range([0, width]);
// //
// //             svg.attr('height', height);
// //
// //             svg.selectAll('rect')
// //               .data(data).enter()
// //                 .append('rect')
// //                 .attr('height', barHeight)
// //                 .attr('width', 140)
// //                 .attr('x', Math.round(margin/2))
// //                 .attr('y', function(d, i) {
// //                   return i * (barHeight + barPadding);
// //                 })
// //                 .attr('fill', function(d) {
// //                   return color(d.numerator);
// //                 })
// //                 .transition()
// //                   .duration(1000)
// //                   .attr('width', function(d) {
// //                     return xScale(d.score);
// //                   });
// //           };
// //           };
// //         });
// //       }};
// //   }]);
//


// TODO: D3 stuff

angular.module('stat')
  .directive('barsChart', function($parse) {
    var directiveDefinitionObject = {
      restrict: 'E',
      replace: false,
      scope: {
        data: '=chartData'
      },
      link: function(scope, element, attrs) {
        var chart = d3.select(element[0]);

        chart.append("div").attr("class", "chart").selectAll('div').data(scope.data).enter().append("div").transition().ease("elastic").style("width", function(d) {return d + "%";
      }).text(function(d) {
        return d + "%";
      });
      }
    };
    return directiveDefinitionObject;
  });
