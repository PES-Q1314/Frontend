'use strict';

/* Controllers */

var myApp = angular.module('myApp.controllers', []);
myApp.controller('MyCtrl1', ['$scope', 'authlogin', '$cookieStore', '$http', 
    function($scope, authlogin, $cookieStore, $http) {
        $scope.login = function(user){
	        authlogin.login(user, function(data){
	            console.log(data);
	            $scope.datosUsuario = data;
	        });
        };

        $scope.logout = function(user){
	        authlogin.logout(user, function(data){
	            console.log(data);
	        });
        };

}]);




myApp.controller('crearOferta', ['$scope', 'OfertaDeEmpresa', 'OfertaDeProyectoEmprendedor', 'OfertaDeDepartamento',
    function($scope, OfertaDeEmpresa, OfertaDeProyectoEmprendedor, OfertaDeDepartamento) {
    	OfertaDeEmpresa.addNew({
    "autor": "/api/empresa/7",
    "descripcion": "Lorem Ipsum Dolor Sit Amet",
    "direccion": "Avinguda Diagonal 34, Barcelona, Spain",
    "email_de_contacto": "enric.margot@gmail.com",
    "especialidades": [
        {
            "resource_uri": "/api/especialidad/1"
        }
    ],
    "denuncias" : [],
    "requisitos_de_idioma" : [],
    "congelaciones" : [],
    "requisitos_de_conocimiento_tecnico" : [],
    "requisitos_de_experiencia_laboral" : [],
    "suscripciones" : [],
    "fecha_de_creacion": "2014-04-14T22:53:05.189272",
    "fecha_de_incorporacion": "2014-04-14",
    "fecha_de_ultima_modificacion": "2014-04-14T22:53:05.249665",
    "hay_posibilidad_de_tfg": false,
    "horario": "mañana",
    "latitud": 41.4102793,
    "longitud": 2.21318429999997,
    "meses_de_duracion": 4,
    "numero_de_puestos_vacantes": 4,
    "persona_de_contacto": "Enric Margot",
    "puesto": "Community Manager",
    "salario_mensual": 600,
    "tipo_de_jornada": "total",
    "titulo": "Oferta de Empresa 1",
    "ultimo_curso_academico_superado": 1
}, function(data){
	console.log(data);
});
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

myApp.controller('listarOfertas', ['$scope', 'OfertaDeEmpresa', 'OfertaDeProyectoEmprendedor', 'OfertaDeDepartamento', 'Oferta',
    function($scope, OfertaDeEmpresa, OfertaDeProyectoEmprendedor, OfertaDeDepartamento, Oferta) {
        $scope.query = {tipooferta:{name:'Todas'}, limit: 20, offset : 0};

        $scope.OfertasQuery = function(query){
            query = query || {tipooferta:{name:'Todas'}, limit: 20, offset : 0};
            $scope.query = query;
            if (query.tipooferta.name == $scope.tipos_oferta[1].name){
                OfertaDeEmpresa.queryAll(query, function(data){
                    $scope.ofertas = data.objects;
                    $scope.tipo = 'empresa';
                    $scope.totalItems = data.meta.total_count;
                    $scope.limit = data.meta.limit;
                });
            }else if(query.tipooferta.name == $scope.tipos_oferta[2].name){
                OfertaDeDepartamento.queryAll(query, function(data){
                    $scope.ofertas = data.objects;
                    $scope.tipo = 'departamento';
                    $scope.totalItems = data.meta.total_count;
                    $scope.limit = data.meta.limit;
                });
            }else if(query.tipooferta.name == $scope.tipos_oferta[3].name){
                OfertaDeProyectoEmprendedor.queryAll(query, function(data){
                    $scope.ofertas = data.objects;
                    $scope.tipo = 'colaboracion';
                    $scope.totalItems = data.meta.total_count;
                    $scope.limit = data.meta.limit;
                });
            }else{
                Oferta.queryAll(query, function(data){
                    $scope.ofertas = data.objects;
                    $scope.tipo = 'Todas';
                    $scope.totalItems = data.meta.total_count;
                    $scope.limit = data.meta.limit;
                });
            }

        };

        $scope.autorOferta = function(t) {
            var tmp = "";
            if (t != undefined){
                tmp = t.split("/")[3];
            }
            return tmp;
        }

        $scope.selectPage = function (page) {
            $scope.currentPage = page;
            $scope.query.offset = (page-1) * 20;
            $scope.OfertasQuery($scope.query);
        };

        $scope.tipos_oferta = [{name:'Todas'},{name:'Empresa'},{name:'Departamento'},{name:'Colaboración'}];
        $scope.tipos_jornada = ['','Parcial','Completa'];
        $scope.query.tipooferta = $scope.tipos_oferta[0];
        $scope.query.tipos_jornada = $scope.tipos_jornada[0];
        $scope.selectPage(1);
    }
    ]);


myApp.controller('perfilEmpresa', ['$scope', '$routeParams', 'Empresa',
    function($scope, $routeParams, Empresa) {
        Empresa.query({id : $routeParams.id}, function (data){
            $scope.empresa = data;
        });
}]);