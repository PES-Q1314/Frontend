'use strict';

/* Services */
var apiService = angular.module('apiService', ['ngResource']);

apiService.factory('OfertaDeEmpresa', ['$resource',
    function($resource) {
        return $resource('http://bolsa-de-empleo-upc.herokuapp.com/api/ofertadeempresa', {}, {
            query: {
                method: 'GET',
                isArray: false
            }
        });
    }
]);

apiService.factory('OfertaDeDepartamento', ['$resource',
    function($resource) {
        return $resource('http://bolsa-de-empleo-upc.herokuapp.com/api/ofertadedepartamento', {}, {
            query: {
                method: 'GET',
                isArray: false
            }
        });
    }
]);

apiService.factory('OfertaDeProyectoEmprendedor', ['$resource',
    function($resource) {
        return $resource('http://bolsa-de-empleo-upc.herokuapp.com/api/ofertadeproyectoemprendedor', {}, {
            query: {
                method: 'GET',
                isArray: false
            }
        });
    }
]);