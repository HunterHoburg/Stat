var app = angular.module('stat');
// var d3 = angular.module('')

app.service('dataSenderService', [dataSenderService]);
app.service('playerSenderService', [playerSenderService]);

function dataSenderService() {
  var user = {
    user_id: 0,
    email: '',
    username: '',
    color_1: '',
    color_2: '',
    projects: {}
  };
  this.setId = function(id, email, username, color_1, color_2) {
    user.user_id = id;
    user.email = email;
    user.username = username;
    user.color_1 = color_1;
    user.color_2 = color_2;
    // user.projects = projects;
    // console.log(user.projects);
  };
  this.setProjects = function(projectsObj) {
    user.projects = projectsObj;
  };
  this.user = function() {
    return user;
  };
}

function playerSenderService() {
  var players = [];

  this.setPlayer = function(player) {
    console.log(player);
      player.stats = [];
      players.push(player);
  };
  this.clearPlayers = function() {
    players = [];
  };

  this.setStats = function(stat) {
    for (var b = 0; b < players.length; b++) {
      if (stat.player_id === players[b].player_id) {
          players[b].stats.push(stat);
      }
      console.log(this.players);
    }
  };

  this.playerGet = function() {
    return players;
  };
  this.statGet = function(player) {
    console.log('players in service: ' + players);
    var stat = players.indexOf(player).stats;
    return stat;
  };
}

function graphService(data) {
    var data = {};
    console.log(data);
}

function signupService() {

}
