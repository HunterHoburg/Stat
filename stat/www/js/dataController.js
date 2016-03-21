var app = angular.module('stat');

app.controller("LineCtrl", ['$scope', '$timeout', 'graphDataService', function ($scope, $timeout, graphDataService) {
  var vm = this;
  // vm.data = graphDataService();
  vm.getData = function(stat) {
    // graphDataService(stat);
  };
  vm.options = {
    chart: {
      type: 'bulletChart',
      duration: 500
    }
  };
  vm.labels = ['kills', 'assists', 'wins', 'losses'];
  // vm.series = ['Series A', 'Series B'];
  // vm.data = [
  //   [65, 59, 80, 81, 56, 55, 40],
  //   [28, 48, 40, 19, 86, 27, 90]
  // ];
  vm.onClick = function (points, evt) {
    console.log(points, evt);
  };

  // Simulate async data update
  $timeout(function () {
    vm.data = [
      [28, 48, 40, 19, 86, 27, 90],
      [65, 59, 80, 81, 56, 55, 40]
    ];
  }, 3000);
}]);
