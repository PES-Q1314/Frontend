'use strict';

/* Directives */
var appDirectives = angular.module('myApp.directives', []);

appDirectives.directive('restrict', function($cookieStore) {
    return {
        restrict: 'A',
        prioriry: 100000,
        scope: false,
        link: function() {},
        compile: function(element, attr, linker) {
            var accessDenied = true;
            var user = $cookieStore.get('login');
            if (user != undefined) {
                var attributes = attr.access.split(" ");
                for (var i in attributes) {
                    if (user.tipo == attributes[i]) {
                        accessDenied = false;
                    }
                }
                if (accessDenied) {
                    element.remove();
                }
            }
        }
    }
});