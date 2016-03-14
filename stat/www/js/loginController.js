var app = angular.module("stat");

app.controller("LoginController", ["$http", LoginController]);

function LoginController($http) {
  var vm = this;
  vm.loginExpanded = false;
  vm.signupExpanded = false;
  vm.expandLogin = function() {
    vm.signupExpanded = false;
    vm.loginExpanded = true;
  };
  vm.expandSignup = function() {
    vm.loginExpanded = false;
    vm.signupExpanded = true;
  };
  vm.loginSubmit = function(username, password) {

    vm.currentUser = {};
    $http({
      method: 'GET',
      url: 'http://localhost:3000/login',
      headers: {
        name: username,
        pass: password
      }
    }).then(function(data) {
      vm.currentUser = data.data;
    });
  };
  vm.currentUser = {};
}
