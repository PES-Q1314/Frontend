'use strict';

/* Services */
var apiService = angular.module('apiService', ['ngResource']);

apiService.factory('authlogin', ['$resource', function($resource){
        return $resource('http://bolsa-de-empleo-upc.herokuapp.com/api/systemuser/login', {}, {
            login: {
                method: 'POST'
            }
        })
}]);


apiService.factory('OfertaDeEmpresa', ['$resource',
    function($resource) {
        return $resource('http://bolsa-de-empleo-upc.herokuapp.com/api/ofertadeempresa/:id', {}, {
            queryAll: {
                method: 'GET',
                params:{id:''},
                isArray: false
            },
            query: {
                method: 'GET',
                params:{id:'@id'},
                isArray: false
            }
        })
    }
]);

apiService.factory('OfertaDeDepartamento', ['$resource',
    function($resource) {
        return $resource('http://bolsa-de-empleo-upc.herokuapp.com/api/ofertadedepartamento/:id', {}, {
            query: { method: 'GET', params:{id:'@id'}, isArray: false },
            queryAll: { method: 'GET', params:{id:''}, isArray: false }
        })
    }
]);

apiService.factory('OfertaDeProyectoEmprendedor', ['$resource',
    function($resource) {
        return $resource('http://bolsa-de-empleo-upc.herokuapp.com/api/ofertadeproyectoemprendedor/:id', {}, {
            queryAll: {
                method: 'GET',
                params:{id:''},
                isArray: false
            },
            query: {
                method: 'GET',
                params:{id:'@id'},
                isArray: false
            }
        })
    }
]);

apiService.factory('Conocimiento', ['$resource',
    function($resource) {
        return $resource('http://bolsa-de-empleo-upc.herokuapp.com/api/conocimientotecnico/:id', {}, {
            query: { method: 'GET', params:{id:'@id'}, isArray: false },
            queryAll: { method: 'GET', params:{id:''}, isArray: false },
            add: { method: 'POST', params:{id:''}}
        })
    }
]);