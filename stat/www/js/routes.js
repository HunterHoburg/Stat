'use strict';

angular.module("stat")
.config(function($stateProvider, $urlRouterProvider) {
$urlRouterProvider.otherwise('/');
$stateProvider
    .state('splash', {
      url: '/',
      templateUrl: 'views/main.html',
      cache: false
      // controller: 'LoginController as LC'
    })
    .state('main', {
      url: '/main',
      templateUrl: 'views/projects.html',
      cache: false
      // controller: 'MenuController as MC'
    })
    .state('players', {
      url: '/players',
      templateUrl: 'views/players.html',
      cache: false
    });
});
