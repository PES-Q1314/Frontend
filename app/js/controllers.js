'use strict';

/* Controllers */

var myApp = angular.module('myApp.controllers', []);
myApp.controller('MyCtrl1', [function() {}]);


myApp.controller('crearOferta', ['$scope', 'OfertaDeEmpresa', 'OfertaDeProyectoEmprendedor', 'OfertaDeDepartamento',
    function($scope, OfertaDeEmpresa, OfertaDeProyectoEmprendedor, OfertaDeDepartamento) {

    }
]);

myApp.controller('detallesOferta', ['$scope', '$routeParams', 'OfertaDeEmpresa', 'OfertaDeProyectoEmprendedor', 'OfertaDeDepartamento', 'Conocimiento',
    function($scope, $routeParams, OfertaDeEmpresa, OfertaDeProyectoEmprendedor, OfertaDeDepartamento, Conocimiento) {
    if ($routeParams.tipoOferta == 'empresa'){
        OfertaDeEmpresa.query({id : $routeParams.idOferta}, function (data) {
            $scope.oferta = data;
        });
    } else if ($routeParams.tipoOferta == 'departamento'){
        OfertaDeDepartamento.query({id : $routeParams.idOferta}, function (data) {
            $scope.oferta = data;
        });
    } else {
        OfertaDeProyectoEmprendedor.query({id : $routeParams.idOferta}, function (data) {
                $scope.oferta = data;
            });
    };

}]);

myApp.controller('listarOfertas', ['$scope', 'OfertaDeEmpresa', 'OfertaDeProyectoEmprendedor', 'OfertaDeDepartamento',
    function($scope, OfertaDeEmpresa, OfertaDeProyectoEmprendedor, OfertaDeDepartamento) {
        $scope.query = {tipooferta:{name:'Empresa'}, limit: 20, offset : 0};

        $scope.OfertasQuery = function(query){
            query = query || {tipooferta:{name:'Empresa'}, limit: 20, offset : 0};
            $scope.query = query;
            if (query.tipooferta.name == $scope.tipos_oferta[0].name){
                OfertaDeEmpresa.queryAll(query, function(data){
                    $scope.ofertas = data.objects;
                    $scope.tipo = 'empresa';
                    $scope.totalItems = data.meta.total_count;
                    $scope.limit = data.meta.limit;
                });
            }else if(query.tipooferta.name == $scope.tipos_oferta[1].name){
                OfertaDeDepartamento.queryAll(query, function(data){
                    $scope.ofertas = data.objects;
                    $scope.tipo = 'departamento';
                    $scope.totalItems = data.meta.total_count;
                    $scope.limit = data.meta.limit;
                });
            }else if(query.tipooferta.name == $scope.tipos_oferta[2].name){
                OfertaDeProyectoEmprendedor.queryAll(query, function(data){
                    $scope.ofertas = data.objects;
                    $scope.tipo = 'colaboracion';
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
        $scope.tipos_jornada = ['','Parcial','Completa'];
        $scope.query.tipooferta = $scope.tipos_oferta[1];
        $scope.query.tipos_jornada = $scope.tipos_jornada[0];
        $scope.selectPage(1);
    }
    ]);