angular.module('soundboard',['ngRoute','ngTouch'])
       .config(function($routeProvider){
          $routeProvider.when('/', {
            templateUrl: 'templates/board.html',
            controller:  'BoardCtrl'
          });
/*
    Just one board 
          $routeProvider.when('/', {
            templateUrl: 'templates/boards.html',
            controller:  'BoardCtrl'
          });
*/
       });


