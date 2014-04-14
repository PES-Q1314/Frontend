'use strict';

/* Controllers */

var myApp = angular.module('myApp.controllers', []);
myApp.controller('MyCtrl1', [

        function() {

        }
    ]);
myApp.controller('MyCtrl2', [

        function() {

        }
]);
myApp.controller('MyCtrl3', [

        function() {

        }
    ]);
myApp.controller('listarOfertas', ['$scope', 'OfertaDeEmpresa', 'OfertaDeProyectoEmprendedor', 'OfertaDeDepartamento',
        function($scope, OfertaDeEmpresa, OfertaDeProyectoEmprendedor, OfertaDeDepartamento) {
            $scope.query = {tipooferta:{name:'Empresa'}, limit: 20, offset : 0};

            $scope.OfertasQuery = function(query){
                query = query || {tipooferta:{name:'Empresa'}, limit: 20, offset : 0};
                $scope.query = query;
                console.log($scope.query);
                if (query.tipooferta.name == $scope.tipos_oferta[0].name){
                    OfertaDeEmpresa.query(query, function(data){
                        $scope.ofertas = data.objects;
                        $scope.totalItems = data.meta.total_count;
                        $scope.limit = data.meta.limit;
                    });
                }else if(query.tipooferta.name == $scope.tipos_oferta[1].name){
                    OfertaDeDepartamento.query(query, function(data){
                        $scope.ofertas = data.objects;
                        $scope.totalItems = data.meta.total_count;
                        $scope.limit = data.meta.limit;
                    });
                }else if(query.tipooferta.name == $scope.tipos_oferta[2].name){
                    OfertaDeProyectoEmprendedor.query(query, function(data){
                        $scope.ofertas = data.objects;
                        $scope.totalItems = data.meta.total_count;
                        $scope.limit = data.meta.limit;
                    });
                }else{
                    console.log("Todas?");
                }

            };

            $scope.selectPage = function (page) {
                $scope.currentPage = page;
                $scope.query.offset = (page-1) * 20;
                $scope.OfertasQuery($scope.query);
            };

            $scope.tipos_oferta = [/*{name:'Todas'},*/{name:'Empresa'},{name:'Departamento'},{name:'Colaboración'}];
            $scope.query.tipooferta = $scope.tipos_oferta[0];
            $scope.selectPage(1);
        }
    ]);