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
            templateUrl: 'partials/oferta/listarOfertas.html',
            controller: 'listarOfertas'
        });
        $routeProvider.when('/crearOferta', {
            templateUrl: 'partials/oferta/crearOferta.html',
            controller: 'crearOferta'
        });
        $routeProvider.when('/detallesOferta/:tipoOferta/:idOferta', {
            templateUrl: 'partials/oferta/detallesOferta.html',
            controller: 'detallesOferta'
        });
        $routeProvider.when('/empresa/:id/', {
            templateUrl: 'partials/perfiles/empresa.html',
            controller: 'perfilEmpresa'
        });
        $routeProvider.when('/estudiante/:id/', {
            templateUrl: 'partials/perfiles/estudiante.html',
            controller: 'perfilEstudiante'
        });
        $routeProvider.when('/profesor/:id/', {
            templateUrl: 'partials/perfiles/profesor.html',
            controller: 'perfilProfesor'
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