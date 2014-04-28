'use strict';

/* Filters */

var myApp = angular.module('myApp.filters', []);

myApp.filter('interpolate', ['version',
    function(version) {
        return function(text) {
            return String(text).replace(/\%VERSION\%/mg, version);
        };
    }
]);

myApp.filter('capitalize', function() {
    return function(input) {
        return input.substring(0, 1).toUpperCase() + input.substring(1);
    }
});