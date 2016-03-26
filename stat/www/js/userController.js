var app = angular.module("stat");

app.controller("UserController", ["$http", "$state", "$scope", "$location", "$ionicModal", "dataSenderService", "playerSenderService", UserController]);

function UserController($http, $state, $scope, $location, $ionicModal, dataSenderService, playerSenderService) {
  var vm = this;
  vm.loginExpanded = false;
  vm.signupExpanded = false;
  vm.currentUser;
  vm.players = [];
  vm.currentProjectTitle;
  vm.currentProjectId;
  vm.recentPages = [];
  vm.expandLogin = function() {
    vm.signupExpanded = false;
    vm.loginExpanded = true;
  };
  vm.expandSignup = function() {
    vm.loginExpanded = false;
    vm.signupExpanded = true;
  };

  vm.userData = function(user_id) {
    $http({
      method: 'GET',
      url: 'http://localhost:3000/userdata',
      headers: {
        user_id: user_id
      }
    }).then(function(data) {
      console.log(data);
      var projects = data.data;
      var p = {};
      console.log(projects);
      projects.forEach(function(element) {
        element.numberPlayers = 1;
      });

      for (var i = 0; i < projects.length; i++) {
        var id = projects[i].project_id;
        // console.log('id: ' + id);
        if (p[id]) {
          p[id].numberPlayers += projects[i].numberPlayers;
        } else {
          p[id] = {};
          p[id].numberPlayers = projects[i].numberPlayers;
          p[id].title = projects[i].title;
          p[id].project_id = projects[i].project_id;
        }
      }
      // console.log(p);
      // return p;
      dataSenderService.setProjects(p);
    });
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
      // console.log(data);
      var user = data.data[0];
      // console.log(user);
      // console.log(projects);
      dataSenderService.setId(user.user_id, user.email, user.username, user.color_1, user.color_2);
      vm.userData(user.user_id);
      vm.renderProfile();
    });
  };


  //FUNCTIONS FOR GETTING NORMALIZED DATA
  vm.setUser = function() {
    vm.currentUser = dataSenderService.user();
    console.log(vm.currentUser);
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
      for (var i = 0; i < stats.length; i++) {
        vm.statLister(stats[i]);
      }
    });
  };

  // Getting measurements, color, etc.
  vm.statLister = function(stat) {
    $http({
      method: 'GET',
      url: 'http://localhost:3000/stats',
      headers: {
        stat_id: stat.stat_id
      }
    }).then(function(data) {
      var statUpdate = data.data.data;
      console.log(statUpdate);
      playerSenderService.setStats(stat);
      vm.setPlayers();
    });
  };

  vm.openProject = function(projectId, title) {
    console.log(projectId, title);
    vm.currentProjectTitle = title;
    vm.currentProjectId = projectId;
      $http({
      method: 'GET',
      url: 'http://localhost:3000/projects',
      headers: {
        project_id: projectId
      }
    }).then(function(data) {

      for (var h = 0; h < data.data.players.length; h++) {
        playerSenderService.setPlayer(data.data.players[h]);
        vm.playerLister(data.data.players[h]);
      }
    });
    vm.renderPlayers();
  };

  vm.currentGraph = {};

  //TODO: Create signupSubmit function n stuff

  vm.renderProfile = function() {
    $location.path('/main');
  };
  vm.renderPlayers = function() {
    $location.path('/players');
    // playerSenderService.playerGet();
  };

  // Adding players
  vm.addPlayer = function() {
    $ionicModal.fromTemplateUrl('../views/add-player.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      vm.modal = modal;
      vm.openModal();
    });
  };

  // Adding stats
  vm.addStat = function() {
    $ionicModal.fromTemplateUrl('../views/add-stat.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      vm.modal = modal;
      vm.openModal();
    });
  };
  vm.openModal = function() {
    vm.modal.show();
  };
  vm.closeModal = function() {
    vm.modal.hide();
  };
  // $scope.$on('$destroy', function() {
  //   $scope.modal.remove();
  // });
  // $scope.$on('modal.hidden', function() {
  //
  // });
  // $scope.$on('modal.removed', function() {
  //
  // });
  vm.addCounter = false;
  vm.counterToggle = function() {
    vm.addCounter = !vm.addCounter;
  };


  vm.submitStat = function(name, numerator, denominator, color, position, player_id) {
    console.log(name, numerator, denominator, color, position, player_id);

    //TODO: either make an http request for adding stats, or allow users to 'save' stats
    $http({
      method: 'PUT',
      url: 'http://localhost:3000/add',
      data: {
        name: name,
        numerator: numerator,
        denominator: denominator,
        color: color,
        position: position,
        type: 'stat',
        player_id: player_id
      }
    }).then(function(data) {
      console.log(data);
    });
    var stat = {
      measurement: name,
      numerator: numerator,
      denominator: denominator,
      color: color,
      position: position
    };
    for (var u = 0; u < vm.players.length; u++) {
      if (player_id === vm.players[u].player_id) {
        vm.players[u].stats.push(stat);
        console.log(vm.players[u]);
      }
    }
    vm.color = '';
    vm.player_id = '';
    vm.closeModal();
  };

  vm.submitPlayer = function(player_name, color) {
    $http({
      method: 'PUT',
      url: 'http://localhost:3000/add',
      data: {
        player_name: player_name,
        color: color,
        type: 'player',
        user_id: vm.currentUser.user_id,
        title: vm.currentProjectTitle,
        project_id: vm.currentProjectId
      }
    }).then(function(data) {
      console.log(data);
    });
    var player = {
      player_name: player_name,
      color: color,
      user_id: vm.currentUser.user_id,
      stats: [],
      project_id: vm.currentProjectId,
      title: vm.currentProjectTitle,
      global_stat_id: ''
    };
    vm.players.push(player);
    console.log(vm.players);
    vm.color = '';
    vm.closeModal();
  };

  vm.changeStat = function() {
    // console.log(stat.measurement);
    console.log('test');
  };

}
