var app = angular.module("stat");

app.controller("UserController", ["$http", "$state", "$scope", "$location", "$ionicModal", "dataSenderService", "playerSenderService", UserController]);

function UserController($http, $state, $scope, $location, $ionicModal, dataSenderService, playerSenderService) {
  var vm = this;
  vm.loginExpanded = false;
  vm.signupExpanded = false;
  vm.currentUser;
  vm.players = [];
  vm.currentProjectTitle;
  vm.recentPages = [];
  vm.expandLogin = function() {
    vm.signupExpanded = false;
    vm.loginExpanded = true;
  };
  vm.expandSignup = function() {
    vm.loginExpanded = false;
    vm.signupExpanded = true;
  };
  vm.loginSubmit = function(username, password) {
    $http({
      method: 'GET',
      url: 'http://localhost:3000/login',
      headers: {
        name: username,
        pass: password
      }
    }).then(function(data) {
      var user = data.data.data;
      var projects = data.data.projects;
      projects.forEach(function(element) {
        element.numberPlayers = 1;
      });
      projects.reduce(function(a, b) {
        if (a.title === b.title) {
          b.numberPlayers = a.numberPlayers + 1;
          projects.splice(projects.indexOf(a), 1);
        }
      });
      dataSenderService.setId(user.user_id, user.email, user.username, user.color_1, user.color_2, projects);
      vm.renderProfile();
    });
  };


  //FUNCTIONS FOR GETTING NORMALIZED DATA
  vm.setUser = function() {
    vm.currentUser = dataSenderService.user();
    // console.log(vm.currentUser);

  };
  vm.setPlayers = function() {
    // console.log(vm.players);
    vm.players = playerSenderService.playerGet();
  };


  //Getting players' detailed info
  vm.playerLister = function(player) {
    $http({
      method: 'GET',
      url: 'http://localhost:3000/playerstats',
      headers: {
        player_id: player.player_id
      }
    }).then(function(data) {
      var stats = data.data.data;
      // console.log('got stats: ' + stats);
      // player.stats = stats;
      for (var i = 0; i < stats.length; i++) {
        playerSenderService.setStats(stats[i], undefined);
      }
    });
  };

  // Getting measurements, color, etc.
  vm.statLister = function(stat) {
    // console.log(stat);
    $http({
      method: 'GET',
      url: 'http://localhost:3000/stats',
      headers: {
        stat_id: stat.stat_id
      }
    }).then(function(data) {
      var statUpdate = data.data.data;
      // console.log(statUpdate);
      playerSenderService.setStats(stat, statUpdate[0]);
    });
  };

  // Getting numerator and denominator
  vm.statDetails = function(stat) {
    $http({
      method: 'GET',
      url: 'http://localhost:3000/measurements',
      headers: {
        stat_id: stat.stat_id
      }
    }).then(function(data) {
      // console.log(data.data.data);
      var update = data.data.data;
      playerSenderService.setStats(stat, update[0]);
    });
  };

  vm.setPlayers = function() {
    vm.players = playerSenderService.playerGet();
  };

  vm.test = function() {
    // console.log(vm.players);
  };

  vm.openProject = function(projectId, title) {
    vm.currentProjectTitle = title;
    //Setting this variable so it can be accessed in the promise no problemo

      $http({
      method: 'GET',
      url: 'http://localhost:3000/projects',
      headers: {
        project_id: projectId
      }
    }).then(function(data) {
      playerSenderService.setPlayer(data.data.players);
    });

    vm.renderPlayers();
  };

  // Graph stuff
  vm.graphMaker = function(value) {
    console.log(value);
    var chart = {
      type: 'bulletChart',
      transitionDuration: 500
    };
    var data = {
      "title": "Revenue",
            "subtitle": "US$, in thousands",
            "ranges": [150,225,300],
            "measures": [220],
            "markers": [250]
    };
    // var color = data.color;
    // // return {
    // //   data: data,
    // //   color: color
    // // }
    // var chart = d3.select("#" + value.stat_id)
    //   .attr("data", data)
    //   .attr("width", "50%")
    //   .data(data.series);
    // console.log(chart);
    vm.currentGraph.options = chart;
    vm.currentGraph.data = data;
    console.log(vm.currentGraph);
  };
  vm.currentGraph = {};
  //TODO: Create signupSubmit function n stuff

  // Adding stats
  vm.addStat = function() {
  console.log('adding a stat');
  };

  vm.historyAdd = function(page) {
    vm.recentPages.push(page);
  };
  vm.renderProfile = function() {
    $location.path('/main');
    // vm.recentPages.push('/main');
    vm.historyAdd('/main');
  };
  vm.renderPlayers = function() {
    $location.path('/players');
    playerSenderService.playerGet();
    // vm.recentPages.push('/players');
    vm.historyAdd('/players');
  };
  vm.goBack = function() {
    console.log(vm.recentPages);
    $location.path(vm.recentPages.pop());
  };













}
