'use strict';

/* Controllers */

var myApp = angular.module('myApp.controllers', []);

myApp.controller('login', ['$scope', '$rootScope', '$location', '$cookieStore', 'authlogin', 'appAuth',
    function($scope, $rootScope, $location, $cookieStore, authlogin, appAuth) {

        if (appAuth.isLoggedIn())
            $location.path('/');

        $scope.login = function(user) {
            authlogin.login(user, function(data) {
                $cookieStore.put('login', data);
                $rootScope.userCredentials = data;
                appAuth.redirectToAttemptedUrl();
            });
        };
        $scope.logout = function() {
            $cookieStore.remove('login');
            delete $rootScope.usercredentials;
            delete $scope.userCredentials;
            $location.path('/login');
        };
    }
]);


myApp.controller('crearOferta', ['$scope', '$location', 'OfertaDeEmpresa', 'OfertaDeProyectoEmprendedor', 'OfertaDeDepartamento', 'Especialidad',
    function($scope, $location, OfertaDeEmpresa, OfertaDeProyectoEmprendedor, OfertaDeDepartamento, Especialidad) {

        if ($scope.userCredentials == undefined) {
            $location.path("/login");
        } else {
            if ($scope.userCredentials.tipo == 'Profesor') {
                $scope.titulo = "Oferta de departamento";
                $scope.showTfg = false;
                $scope.showUltimoCurso = true;
            } else if ($scope.userCredentials.tipo == 'Estudiante') {
                $scope.titulo = "Oferta de proyecto emprendedor";
                $scope.showTfg = false;
                $scope.showUltimoCurso = false;
            } else {
                $scope.titulo = "Oferta de empresa";
                $scope.showTfg = true;
                $scope.showUltimoCurso = true;
            };
        }

        /**
         * Crear oferta y editar los conocimientos tecnicos
         *
         **/
        $scope.oferta = {};
        $scope.crearOferta = function(oferta) {
            oferta.requisitos_de_idioma = [];
            oferta.requisitos_de_conocimiento_tecnico = [];
            oferta.requisitos_de_experiencia_laboral = [];
            if ($scope.userCredentials.tipo == 'Profesor') {
                OfertaDeDepartamento.addNew(oferta, function(data) {
                    console.log("Correcto");
                }, function(data) {
                    console.log("Incorrecto");
                    console.log(data);
                });
            } else if ($scope.userCredentials.tipo == 'Estudiante') {
                OfertaDeProyectoEmprendedor.addNew(oferta, function(data) {
                    console.log("Correcto");
                }, function(data) {
                    console.log("Incorrecto");
                    console.log(data);
                });
            } else {
                OfertaDeEmpresa.addNew(oferta, function(data) {
                    console.log("Correcto");
                }, function(data) {
                    console.log("Incorrecto");
                    console.log(data);
                });
            };
        };

        //calendar Button function
        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.opened = true;
        };

        $scope.tipos_jornada = [{
            id: 'parcial',
            name: 'Parcial'
        }, {
            id: 'total',
            name: 'Completa'
        }];

        $scope.tipos_horario = [{
            id: 'manyana',
            name: 'Mañana'
        }, {
            id: 'tarde',
            name: 'Tarde'
        }, {
            id: 'total',
            name: 'Indiferente'
        }];
        $scope.oferta.horario = $scope.tipos_horario[0].id;
        $scope.oferta.tipo_de_jornada = $scope.tipos_jornada[0].id;
        Especialidad.queryAll({
            'limit': 200
        }, function(data) {
            $scope.especialidades = data.objects;
        });
    }
]);

myApp.controller('detallesOferta', ['$scope', '$routeParams', 'OfertaDeEmpresa', 'OfertaDeProyectoEmprendedor', 'OfertaDeDepartamento', 'Conocimiento',
    function($scope, $routeParams, OfertaDeEmpresa, OfertaDeProyectoEmprendedor, OfertaDeDepartamento, Conocimiento) {
        $scope.loading = true;
        $scope.tipousuario = ' ';
        $scope.texto = '';

        function getData(data, tipo, texto) {
            $scope.oferta = data;
            $scope.tipousuario = tipo;
            $scope.textousuario = texto;
            $scope.loading = false;
        }

        if ($routeParams.tipoOferta == 'OfertaDeEmpresa') {
            OfertaDeEmpresa.query({
                id: $routeParams.idOferta
            }, function(data) {
                getData(data, 'empresa', 'Empresa ofertora');
            });
        } else if ($routeParams.tipoOferta == 'OfertaDeDepartamento') {
            OfertaDeDepartamento.query({
                id: $routeParams.idOferta
            }, function(data) {
                getData(data, 'profesor', 'Profesor ofertor');
            });
        } else {
            OfertaDeProyectoEmprendedor.query({
                id: $routeParams.idOferta
            }, function(data) {
                getData(data, 'estudiante', 'Estudiante ofertor');
            });
        };

        $scope.autorOferta = function(t) {
            var tmp = "";
            if (t != undefined) {
                tmp = t.split("/")[3];
            }
            return tmp;
        }

    }
]);

myApp.controller('listarOfertas', ['$scope', 'OfertaDeEmpresa', 'OfertaDeProyectoEmprendedor', 'OfertaDeDepartamento', 'Oferta', 'Especialidad',
    function($scope, OfertaDeEmpresa, OfertaDeProyectoEmprendedor, OfertaDeDepartamento, Oferta, Especialidad) {

        //calendar Button function
        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.opened = true;
        };

        //ng-Show checkbox TFG
        $scope.tfgShow = function(query) {
            if (query.tipooferta.name != "Empresa") {
                delete query.hay_posibilidad_de_tfg;
                return false;
            }
            return true;
        };

        //ng-Show checkbox ultimocursoacademico
        $scope.ultCurso = function(query) {
            if (query.tipooferta.name != "Empresa" && query.tipooferta.name != "Departamento") {
                delete query.ultimo_curso_academico_superado;
                return false;
            }
            return true;
        };

        //Pagination data funtion
        function pagCalculation(data) {
            $scope.ofertas = data.objects;
            $scope.totalItems = data.meta.total_count;
            $scope.limit = data.meta.limit;
            $scope.loading = false;
            $scope.sinResultados = $scope.ofertas.length == 0;
        }

        //Filter Query
        $scope.OfertasQuery = function(query) {
            $scope.loading = true;
            $scope.sinResultados = false;
            query = query || {
                tipooferta: {
                    name: 'Todas'
                },
                limit: 20,
                offset: 0
            };
            $scope.query = query;
            if (query.fecha_de_incorporacion__gte != undefined) {
                var dateObj = query.fecha_de_incorporacion__gte;
                query.fecha_de_incorporacion__gte = dateObj.getFullYear() + '-' + (dateObj.getMonth() + 1) + '-' + dateObj.getDate();
            }

            if (query.tipooferta.name == $scope.tipos_oferta[1].name) {
                OfertaDeEmpresa.queryAll(query, function(data) {
                    pagCalculation(data);
                });
            } else if (query.tipooferta.name == $scope.tipos_oferta[2].name) {
                OfertaDeDepartamento.queryAll(query, function(data) {
                    pagCalculation(data);
                });
            } else if (query.tipooferta.name == $scope.tipos_oferta[3].name) {
                OfertaDeProyectoEmprendedor.queryAll(query, function(data) {
                    pagCalculation(data);
                });
            } else {
                Oferta.queryAll(query, function(data) {
                    pagCalculation(data);
                });
            }

        };

        //pagination function
        $scope.selectPage = function(page) {
            $scope.currentPage = page;
            $scope.query.offset = (page - 1) * 20;
            $scope.OfertasQuery($scope.query);
        };

        // Inicilizaciones filtros
        $scope.query = {
            tipooferta: {
                name: 'Todas'
            },
            limit: 20,
            offset: 0
        };
        $scope.tipos_oferta = [{
            name: 'Todas'
        }, {
            name: 'Empresa'
        }, {
            name: 'Departamento'
        }, {
            name: 'Colaboración'
        }];
        $scope.tipos_jornada = [{
            id: 'parcial',
            name: 'Parcial'
        }, {
            id: 'total',
            name: 'Total'
        }];
        $scope.tipos_horario = [{
            id: 'manyana',
            name: 'Mañana'
        }, {
            id: 'tarde',
            name: 'Tarde'
        }, {
            id: 'total',
            name: 'Total'
        }];
        Especialidad.queryAll({
            'limit': 200
        }, function(data) {
            $scope.especialidades = data.objects;
        });
        $scope.query.tipooferta = $scope.tipos_oferta[0];
        $scope.selectPage(1);
    }
]);


myApp.controller('perfilEmpresa', ['$scope', '$routeParams', 'Empresa',
    function($scope, $routeParams, Empresa) {
        Empresa.query({
            id: $routeParams.id
        }, function(data) {
            $scope.empresa = data;
        });
    }
]);

myApp.controller('perfilProfesor', ['$scope', '$routeParams', 'Profesor',
    function($scope, $routeParams, Profesor) {
        Profesor.query({
            id: $routeParams.id
        }, function(data) {
            $scope.profesor = data;
        });
    }
]);

myApp.controller('perfilEstudiante', ['$scope', '$routeParams', 'Estudiante',
    function($scope, $routeParams, Estudiante) {
        Estudiante.query({
            id: $routeParams.id
        }, function(data) {
            $scope.estudiante = data;
        });
    }
]);