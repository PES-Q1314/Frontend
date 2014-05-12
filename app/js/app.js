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

myApp.value('redirectToUrlAfterLogin', {
    url: '/'
});

myApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'partials/login.html',
            controller: 'login'
        });
        $routeProvider.when('/buscarOfertas', {
            templateUrl: 'partials/oferta/buscarOfertas.html',
            controller: 'buscarOfertas'
        });
        $routeProvider.when('/publicarOferta', {
            templateUrl: 'partials/oferta/publicarOferta.html',
            controller: 'publicarOferta'
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
        $routeProvider.when('/home', {
            templateUrl: 'partials/home.html',
            controller: 'home'
        });
        $routeProvider.otherwise({
            redirectTo: '/home'
        });
    }
]);

myApp.config(['$sceDelegateProvider',
    function($sceDelegateProvider) {
        $sceDelegateProvider.resourceUrlWhitelist(['self', 'http://bolsa-de-empleo-upc.herokuapp.com/api/**']);
    }
]);

myApp.config(['$httpProvider',
    function($httpProvider) {
        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
        $httpProvider.defaults.withCredentials = true;
    }
]);

myApp.config(function($httpProvider) {
    $httpProvider.responseInterceptors.push('securityInterceptor');
}).provider('securityInterceptor', function() {
    this.$get = function($location, $q, $injector, $cookieStore, $rootScope) {
        return function(promise) {
            var appAuth = $injector.get('appAuth');
            return promise.then(null, function(response) {
                if (response.status === 401) {
                    $cookieStore.remove('login');
                    appAuth.saveAttemptUrl();
                    $location.path('/login');
                }
                return $q.reject(response);
            });
        };
    };
});

myApp.run(function($location, $rootScope, $cookieStore, appAuth) {
    if (!appAuth.isLoggedIn()) {
        appAuth.saveAttemptUrl();
        $location.path('/login');
    } else {
        $rootScope.userCredentials = $cookieStore.get('login');
    }
});