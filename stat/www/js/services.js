var app = angular.module('stat');

app.service('dataSenderService', [dataSenderService]);
app.service('playerSenderService', [playerSenderService]);

function dataSenderService() {
  var user = {
    user_id: 0,
    email: '',
    username: '',
    color_1: '',
    color_2: '',
    projects: []
  };
  this.setId = function(id, email, username, color_1, color_2, projects) {
    user.user_id = id;
    user.email = email;
    user.username = username;
    user.color_1 = color_1;
    user.color_2 = color_2;
    user.projects = projects;
    // console.log(user.projects);
  };
  this.user = function() {
    return user;
  };
}

function playerSenderService() {
  var players = [];

  this.setPlayer = function(playerId, userId, project, name, color, projectId, statid, numerator, denominator, measurement) {
    var player = {};
    player.player_id = playerId;
    player.user_id = userId;
    player.project_title = project;
    player.player_name = name;
    player.color = color;
    player.project_id = projectId;
    player.stat_id = statid;
    player.numerator = numerator;
    player.denominator = denominator;
    player.measurement = measurement;
    players.push(player);
  };

  this.players = function() {
    return players;
  };
}
