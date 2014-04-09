'use strict';

/* Services */
var ofertasServices = angular.module('ofertasServices', ['ngResource']);

ofertasServices.factory('Ofertas', ['$resource',
    function($resource) {
        return $resource('phones/:phoneId.json', {}, {
            query: {
                method: 'GET',
                params: {
                    phoneId: 'phones'
                },
                isArray: true
            }
        });
    }
]);