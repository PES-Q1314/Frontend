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
]).config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
]);