var app = angular.module("stat");

app.controller("UserController", ["$http", "$state", "$scope", "$location", "$ionicModal", "dataSenderService", "playerSenderService", "$ionicHistory", UserController]);

function UserController($http, $state, $scope, $location, $ionicModal, dataSenderService, playerSenderService, $ionicHistory) {
  var vm = this;
  vm.loginExpanded = false;
  vm.signupExpanded = false;
  vm.currentUser;
  vm.players = [];
  vm.currentProjectTitle;
  vm.currentProjectId;
  vm.waiting = false;
  // vm.recentPages = [];
  vm.expandLogin = function() {
    vm.signupExpanded = false;
    vm.loginExpanded = true;
    $ionicModal.fromTemplateUrl('../www/views/signin.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      vm.modal = modal;
      vm.openModal();
    });
  };
  vm.expandSignup = function() {
    vm.loginExpanded = false;
    vm.signupExpanded = true;
  };

  vm.userData = function(user_id) {
    $http({
      method: 'GET',
      url: 'https://hidden-lake-99126.herokuapp.com/userdata',
      headers: {
        user_id: user_id
      }
    }).then(function(data) {
      // console.log(data);
      var projects = data.data;
      var p = {};
      // console.log(projects);
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

  vm.logOut = function() {
    $location.path('/index');
    $ionicHistory.clearCache();
    $ionicHistory.clearHistory();
    vm.currentUser = {};
    vm.currentProjectId = null;
    vm.currentProjectTitle = '';
    vm.players = [];
  };

  vm.signup = function() {
    $ionicModal.fromTemplateUrl('../www/views/signup.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      vm.modal = modal;
      vm.openModal();
    });
  };

  vm.nameFree = true;
  vm.nameVerify = function(name) {
    $http({
      method: 'GET',
      url: 'https://hidden-lake-99126.herokuapp.com/name',
      headers: {
        username: name
      }
    }).then(function(data) {
      // console.log(data);
      if (data.data === 'exists') {
        vm.nameFree = false;
      } else {
        vm.nameFree = true;
      }
    });
  };

  vm.signupSubmit = function(name, email1, email2, password1, password2, color) {
    // console.log(name, email, password, color);
    if (email1 === email2 && password1 === password2) {
      $http({
        method: 'POST',
        url: 'https://hidden-lake-99126.herokuapp.com/signup',
        data: {
          username: name,
          email: email1,
          password: password1,
          color_1: color
        }
      }).then(function(data) {
        // console.log(data);
        vm.closeModal();
        vm.loginSubmit(name, password1);
      });
    }
  };

  vm.loginSubmit = function(username, password) {
    console.log(username, password);
    if (username && password) {
    vm.waiting = true;
    $http({
      method: 'GET',
      url: 'https://hidden-lake-99126.herokuapp.com/login',
      headers: {
        name: username,
        pass: password
      }
    }).then(function(data) {
      // console.log(data);
      if (data.data === 'invalid') {
        vm.incorrectLogin();
      } else {
        var user = data.data[0];
        // console.log(user);
        // console.log(projects);
        dataSenderService.setId(user.user_id, user.email, user.username, user.color_1, user.color_2);
        vm.userData(user.user_id);
        vm.renderProfile();
        vm.closeModal();
        vm.waiting = false;
      }
    });
    }
  };

  vm.errorMessage = false;
  vm.incorrectLogin = function() {
    vm.errorMessage = true;
  };


  //FUNCTIONS FOR GETTING NORMALIZED DATA
  vm.setUser = function() {
    vm.resetProject();
    vm.currentUser = dataSenderService.user();
  };
  vm.setPlayers = function() {
    // console.log(vm.players);
    vm.players = playerSenderService.playerGet();
  };

  //Getting players' detailed info
  vm.playerLister = function(player) {
    console.log(player);
    $http({
      method: 'GET',
      url: 'https://hidden-lake-99126.herokuapp.com/playerstats',
      headers: {
        player_id: player.player_id
      }
    }).then(function(data) {
      // console.log(data.data.data);
      var stats = data.data.data;
      if (data.data.data[0]) {
        for (var i = 0; i < stats.length; i++) {
          vm.statLister(stats[i]);
        }
      } else {
        vm.setPlayers();
      }
    });
  };

  // Getting measurements, color, etc.
  vm.statLister = function(stat) {
    $http({
      method: 'GET',
      url: 'https://hidden-lake-99126.herokuapp.com/stats',
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
    // console.log(projectId, title);
    vm.currentProjectTitle = title;
    vm.currentProjectId = projectId;
      $http({
      method: 'GET',
      url: 'https://hidden-lake-99126.herokuapp.com/projects',
      headers: {
        project_id: projectId
      }
    }).then(function(data) {
      // console.log(data);
      for (var h = 0; h < data.data.players.length; h++) {
        playerSenderService.setPlayer(data.data.players[h]);
        console.log(data.data.players[h]);
        vm.playerLister(data.data.players[h]);
      }
      console.log(vm.currentUser);
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
    $ionicModal.fromTemplateUrl('../www/views/add-player.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      vm.modal = modal;
      vm.openModal();
    });
  };

  // Adding stats
  vm.player_id;
  vm.addStat = function(id) {
    vm.player_id = id;
    $ionicModal.fromTemplateUrl('../www/views/add-stat.html', {
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
  vm.addCounter = false;
  vm.counterToggle = function() {
    vm.addCounter = !vm.addCounter;
  };
  vm.aboutVisible = false;
  vm.splashAbout = function() {
    vm.aboutVisible = !vm.aboutVisible;
  };
  vm.goBack = function() {
    $ionicHistory.goBack();

  };

  //Adding projects
  vm.addProject = function() {
    $ionicModal.fromTemplateUrl('../www/views/add-project.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      vm.modal = modal;
      vm.openModal();
    });
  };

  //Modal for tutorials/about pages
  vm.about = function(subject) {
    $ionicModal.fromTemplateUrl('../www/views/' + subject + '.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      vm.modal = modal;
      vm.openModal();
    });
  };


  vm.submitStat = function(name, numerator, denominator, color, position, player_id) {
    console.log(name, numerator, denominator, color, position, player_id);
    if (!denominator) {
      denominator = 1;
    }
    $http({
      method: 'PUT',
      url: 'https://hidden-lake-99126.herokuapp.com/add',
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
      var stat = {
        measurement: name,
        numerator: parseInt(numerator),
        denominator: denominator,
        color: color,
        position: position,
        stat_id: data.data[0]
      };
      for (var u = 0; u < vm.players.length; u++) {
        if (player_id === vm.players[u].player_id) {
          vm.players[u].stats.push(stat);
          console.log(vm.players[u]);
        }
      }
    });
    vm.color = '';
    vm.player_id = '';
    vm.closeModal();
  };

  vm.submitPlayer = function(player_name, color) {
    $http({
      method: 'PUT',
      url: 'https://hidden-lake-99126.herokuapp.com/add',
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
      var player = {
        player_name: player_name,
        color: color,
        user_id: vm.currentUser.user_id,
        stats: [],
        project_id: vm.currentProjectId,
        title: vm.currentProjectTitle,
        global_stat_id: '',
        player_id: data.data[0]
      };
      vm.players.push(player);
      console.log(vm.players);
    });
    console.log(vm.players);
    vm.color = '';
    vm.save();
    vm.closeModal();
  };

  vm.submitProject = function(name, user_id, player_name, color) {
    vm.currentProjectTitle = name;
    $http({
      method: 'PUT',
      url: 'https://hidden-lake-99126.herokuapp.com/add',
      data: {
        type: 'project',
        title: name,
        user_id: user_id,
        player_name: player_name,
        color: color
      }
    }).then(function(data) {
      console.log(data.data.project_id);
      vm.currentProjectId = data.data.project_id;
      vm.openProject(data.data.project_id, name);
      vm.closeModal();
    });
    vm.color = '';
  };

  vm.statUp = function(stat) {
    var id = stat.stat_id;
    for (var i = 0; i < vm.players.length; i++) {
      for (var h = 0; h < vm.players[i].stats.length; h++) {
        if (vm.players[i].stats[h].stat_id === id) {
          vm.players[i].stats[h].numerator += 1;
        }
      }
    }
  };
  vm.statDown = function(stat) {
    var id = stat.stat_id;
    for (var i = 0; i < vm.players.length; i++) {
      for (var h = 0; h < vm.players[i].stats.length; h++) {
        if (vm.players[i].stats[h].stat_id === id) {
          vm.players[i].stats[h].numerator -= 1;
        }
      }
    }
  };
  vm.denomUp = function(stat) {
    var id = stat.stat_id;
    for (var i = 0; i < vm.players.length; i++) {
      for (var h = 0; h < vm.players[i].stats.length; h++) {
        if (vm.players[i].stats[h].stat_id === id) {
          vm.players[i].stats[h].denominator += 1;
        }
      }
    }
  };
  vm.denomDown = function(stat) {
    var id = stat.stat_id;
    for (var i = 0; i < vm.players.length; i++) {
      for (var h = 0; h < vm.players[i].stats.length; h++) {
        if (vm.players[i].stats[h].stat_id === id) {
          vm.players[i].stats[h].denominator -= 1;
        }
      }
    }
  };


  //Functions used for going back on pages, logging out, etc.
  vm.resetProject = function() {
    vm.players = [];
    playerSenderService.clearPlayers();
    vm.currentProjectId = '';
    vm.currentProjectTitle = '';
  };
  vm.resetUser = function() {
    vm.currentUser = {};
  };

  vm.save = function() {
    console.log(vm.players);
    $http({
      method: 'PUT',
      url: 'https://hidden-lake-99126.herokuapp.com/save',
      data: {
        project_id: vm.currentProjectId,
        user: vm.currentUser,
        players: vm.players
      }
    }).then(function(data) {
      console.log(data);
    });
  };

  // TODO: update server to test these

  vm.delete = function(type, id, option) {
    // console.log(type, id, option);
    if (type === 1) {
      type = 'stats';
      for (var i = 0; i < vm.players.length; i++) {
        for (var d = 0; d < vm.players[i].stats.length; d++) {
          if (id === vm.players[i].stats[d].stat_id) {
            vm.players[i].stats.splice(d, 1);
          }
        }
      }
    } else if (type === 2) {
      type = 'players';
      for (var k = 0; k < vm.players.length; k++) {
        if (id === vm.players[k].player_id) {
          vm.players.splice(k, 1);
        }
      }
      for (var h = 0; h < vm.currentUser.projects.length; h++) {
        if (vm.currentUser.projects[h] === id) {
          vm.currentUser.projects[h].numberPlayers -= 1;
        }
      }
    } else if (type === 3) {
      type = 'projects';
      vm.currentProjectId = null;
      vm.currentProjectTitle = '';
      for (var t = 0; t < vm.currentUser.projects.length; t++) {
        if (vm.currentUser.projects[t] === id) {
          delete vm.currentUser.projects[t];


          //TODO: Make sure that this is updating the number of players in the currentUser projects object correctly, finish other delete routes

        }
      }
      vm.renderProfile();
    } else if (type === 4) {
      type = 'users';

      // TODO: User account deletion stuff
    }
    console.log(type);
    console.log(id);
    console.log(option);
    $http({
      method: 'DELETE',
      url: 'https://hidden-lake-99126.herokuapp.com/delete',
      headers: {
        type: type,
        id: id,
        option: option
      }
    }).then(function(data) {
      console.log(data);
    });
  };
}
