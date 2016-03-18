var app = angular.module('stat');
var charts = 'chart.js';
app.controller('VizController', 'chart.js', VizController);


function VizController(charts) {
  var vm = this;
  // vm.mainStat = function()
  vm.charts = [];
  vm.mainStat = function(labels, data) {
    var chartData = {};
    chartData.labels = labels;
    chartData.data = data;
    return chartData;
  };
}
