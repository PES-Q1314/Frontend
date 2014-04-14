'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
    'ngRoute',
    'myApp.filters',
    'myApp.directives',
    'myApp.controllers',
    'apiService',
    'ui.bootstrap'
]).
config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/home', {
            templateUrl: 'partials/home.html',
            controller: 'MyCtrl1'
        });
        $routeProvider.when('/about', {
            templateUrl: 'partials/about.html',
            controller: 'MyCtrl2'
        });
        $routeProvider.when('/contact', {
            templateUrl: 'partials/contact.html',
            controller: 'MyCtrl3'
        });
        $routeProvider.when('/listarOfertas', {
            templateUrl: 'partials/listarOfertas.html',
            controller: 'listarOfertas'
        });
        $routeProvider.otherwise({
            redirectTo: '/home'
        });
    }
]);