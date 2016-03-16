var app = angular.module("stat");

app.controller("UserController", ["$http", "$state", "$location", "dataSenderService", "playerSenderService", UserController]);

function UserController($http, $state, $location, dataSenderService, playerSenderService) {
  var vm = this;
  vm.loginExpanded = false;
  vm.signupExpanded = false;
  vm.currentUser;
  vm.players;
  vm.currentProject;
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

  vm.setUser = function() {
    vm.currentUser = dataSenderService.user();
    console.log(vm.currentUser);

  };
  vm.setPlayers = function() {
    vm.players = playerSenderService.players();
    console.log(vm.players);
  };
  vm.openProject = function(projectId, title) {
    vm.currentProject = title;
    //Setting this variable so it can be accessed in the promise no problemo
    var projectID = projectId;
    var projectTitle = title;
    $http({
      method: 'GET',
      url: 'http://localhost:3000/project',
      headers: {
        project_id: projectId
      }
    }).then(function(data) {
      var players = data.data.players;
      // console.log(players);
      for (var i = 0; i < players.length; i++) {
        var player = players[i];
        // console.log(player.stat_id);
        playerSenderService.setPlayer(player.player_id, player.user_id, projectTitle, player.player_name, player.color, projectID, player.stat_id, player.numerator, player.denominator, player.measurement);
      }
      vm.renderPlayers();
    });
  };

  //TODO: Create signupSubmit function n stuff

  vm.renderProfile = function() {
    $location.path('/main');
  };
  vm.renderPlayers = function() {
    $location.path('/players');
  };

}
