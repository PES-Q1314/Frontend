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


appDirectives.directive('checkList', function() {
    return {
        scope: {
            list: '=checkList',
            value: '@'
        },
        link: function(scope, elem, attrs) {
            var handler = function(setup) {
                var checked = elem.prop('checked');
                var index = scope.list.indexOf(scope.value);
                if (checked && index == -1) {
                    if (setup) elem.prop('checked', false);
                    else scope.list.push(scope.value);
                } else if (!checked && index != -1) {
                    if (setup) elem.prop('checked', true);
                    else scope.list.splice(index, 1);
                }
            };

            var setupHandler = handler.bind(null, true);
            var changeHandler = handler.bind(null, false);

            elem.bind('change', function() {
                scope.$apply(changeHandler);
            });
            scope.$watch('list', setupHandler, true);
        }
    };
});