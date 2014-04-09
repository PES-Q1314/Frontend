'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
    .controller('MyCtrl1', [

        function() {

        }
    ])
    .controller('MyCtrl2', [

        function() {

        }
    ])
    .controller('MyCtrl3', [

        function() {

        }
    ]).controller('MyCtrl4', ['$scope', 'Ofertas',
        function($scope, Ofertas) {
            $scope.ofertas = Ofertas.query();
        }
    ]);