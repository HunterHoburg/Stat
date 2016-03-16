var app = angular.module("stat");

app.controller("LoginController", ["$http", "$state", "$location", "dataSenderService", "userSetter", LoginController]);

function LoginController($http, $state, $location, dataSenderService, userSetter) {
  var vm = this;
  vm.loginExpanded = false;
  vm.signupExpanded = false;
  vm.currentUser = [];
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
      // console.log(data.data);
      // vm.currentUser = data.data;
      // vm.userSetter(data.data);
      dataSenderService.setId(data.data.user_id);
      vm.renderProfile();
    });
  };

  //TODO: Create signupSubmit function n stuff

  vm.userSetter = function(user) {
    vm.currentUser.push(user);
  };
  vm.renderProfile = function(user) {
    $location.path('/main');
  }

}
