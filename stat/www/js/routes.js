'use strict';

angular.module("stat")
.config(function($stateProvider, $urlRouterProvider) {
$urlRouterProvider.otherwise('/');
$stateProvider
    .state('splash', {
      url: '/',
      templateUrl: 'views/main.html'
      // controller: 'LoginController as LC'
    })
    // .state('/main', {
    //   template: 'views/projects.html',
    //   controller: 'MenuController as MC'
    // });
});
