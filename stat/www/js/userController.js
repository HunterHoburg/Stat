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
      // vm.playerLister();
    });
  };


  //FUNCTIONS FOR GETTING NORMALIZED DATA
  vm.setUser = function() {
    vm.currentUser = dataSenderService.user();


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

  vm.setPlayers = function() {
    vm.players = playerSenderService.playerGet();
  };

  vm.openProject = function(projectId, title) {
    vm.currentProjectTitle = title;
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


  // vm.historyAdd = function(page) {
  //   vm.recentPages.push(page);
  // };
  vm.renderProfile = function() {
    $location.path('/main');
    // vm.recentPages.push('/main');
    // vm.historyAdd('/main');
  };
  vm.renderPlayers = function() {
    $location.path('/players');
    playerSenderService.playerGet();
    // vm.recentPages.push('/players');
    // vm.historyAdd('/players');
  };
  // vm.goBack = function() {
  //   console.log(vm.recentPages);
  //   $location.path(vm.recentPages.pop());
  // };


  // Adding stats
  vm.addStat = function(stat) {
    console.log(stat);
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
  }

  vm.changeStat = function() {
    // console.log(stat.measurement);
    console.log('test');
  };

}
