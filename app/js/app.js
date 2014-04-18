'use strict';


// Declare app level module which depends on filters, and services
var myApp = angular.module('myApp', [
    'ngRoute',
    'myApp.filters',
    'myApp.directives',
    'myApp.controllers',
    'apiService',
    'ui.bootstrap',
    'ngCookies'
]);

myApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/home', {
            templateUrl: 'partials/home.html',
            controller: 'MyCtrl1'
        });
        $routeProvider.when('/listarOfertas', {
            templateUrl: 'partials/listarOfertas.html',
            controller: 'listarOfertas'
        });
        $routeProvider.when('/crearOferta', {
            templateUrl: 'partials/crearOferta.html',
            controller: 'crearOferta'
        });
        $routeProvider.when('/detallesOferta/:tipoOferta/:idOferta', {
            templateUrl: 'partials/detallesOferta.html',
            controller: 'detallesOferta'
        });
        $routeProvider.otherwise({
            redirectTo: '/home'
        });
    }
]);

myApp.config(['$sceDelegateProvider', function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist(['self', 'http://bolsa-de-empleo-upc.herokuapp.com/api/**']);
}]);

myApp.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    $httpProvider.defaults.withCredentials = true;
}]);