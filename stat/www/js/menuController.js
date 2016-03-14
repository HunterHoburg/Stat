'use strict';

var app = angular.module("stat");

app.controller('MenuController', ['$http', MenuController]);

function MenuController ($http) {
  var vm = this;
  vm.players = {
    hunter: {
      name: 'Hunter',
      class: 'Barbarian',
      weapon: 'Spear',
      details: false,
      id: 1
    },
    kevin: {
      name: 'Kevin',
      class: 'Rogue',
      weapon: 'Short Sword',
      details: false,
      id: 2
    },
    connor: {
      name: 'Connor',
      class: 'Knight',
      weapon: 'Long Sword and Shield',
      details: false,
      id: 3
    }
  };
  vm.playerId = null;
  vm.playerExpanded = false;
  vm.expandPlayer = function(id) {
    vm.playerId = id;
    console.log(vm.playerId);
  }
}
