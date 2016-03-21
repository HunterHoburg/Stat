var app = angular.module('stat');
// var d3 = angular.module('')

app.service('dataSenderService', [dataSenderService]);
app.service('playerSenderService', [playerSenderService]);
app.service('graphDataService', [graphDataService]);

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

  this.setPlayer = function(player) {
    for (var i = 0; i < player.length; i++) {
      player[i].stats = [];
      players.push(player[i]);
    }
  };

  this.setStats = function(stat, update, measurement) {
    for (var b = 0; b < players.length; b++) {
      if (stat.player_id === players[b].player_id) {
        if (!update) {
          players[b].stats.push(stat);
        } else if (stat.stat_id === update.stat_id) {
          for (var key in update) {
            stat[key] = update[key]
          }
          for (var c = 0; c < players[b].stats.length; c++) {
            if (players[b].stats[c].stat_id === stat.stat_id) {
              for (var key2 in stat) {
                players[b].stats[c][key2] = stat[key2];
                // console.log(players[b].stats);
              }
            }
          }
        }
      }
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

function graphDataService(value) {
  // console.log(value);
  // var data = {};
  // data.title = value.measurement;
  // data.markers = value.numerator;
  // return {
  //   data: data
  }
function graphService(data) {
    var data = {};
    console.log(data);
}

function signupService() {

}
