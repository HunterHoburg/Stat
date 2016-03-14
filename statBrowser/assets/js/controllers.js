'use strict';


var app = angular.module('stattest');

app.controller('MainController', ['$http', MainController]);

function MainController ($http) {
  var vm = this;
  vm.userGetter = function(userName, password) {
    vm.currentUser = {};
    $http({
      method: 'GET',
      url: 'http://localhost:3000/login',
      headers: {
        name: userName,
        pass: password
      }
    }).then(function(data) {
      vm.currentUser = data.data;
    });
  };
  vm.currentUser = {};
}
