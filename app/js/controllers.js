'use strict';

/* Controllers */

var myApp = angular.module('myApp.controllers', []);
myApp.controller('MyCtrl1', ['$scope', 'authlogin', '$cookieStore', '$http',
    function($scope, authlogin, $cookieStore, $http) {
        $scope.login = function(user) {
            authlogin.login(user, function(data) {
                console.log(data);
                $scope.datosUsuario = data;
            });
        };
        $scope.logout = function(user) {
            authlogin.logout(user, function(data) {
                console.log(data);
            });
        };
    }
]);


myApp.controller('crearOferta', ['$scope', 'OfertaDeEmpresa', 'OfertaDeProyectoEmprendedor', 'OfertaDeDepartamento',
    function($scope, OfertaDeEmpresa, OfertaDeProyectoEmprendedor, OfertaDeDepartamento) {

        $scope.crearOferta = function(oferta) {
            oferta.especialidades = ["/api/especialidad/1"];
            oferta.denuncias = [];
            oferta.requisitos_de_idioma = [];
            oferta.congelaciones = [];
            oferta.requisitos_de_conocimiento_tecnico = [];
            oferta.requisitos_de_experiencia_laboral = [];
            oferta.suscripciones = [];
            oferta.latitud = 41.4102793;
            oferta.longitud = 2.21318429999997;

            OfertaDeEmpresa.addNew(oferta, function(data) {
                //Correcto
                console.log("Correcto");
            }, function(data) {
                //Incorrecto
                console.log("Incorrecto");
                console.log(data);
            })
        }


        OfertaDeEmpresa.addNew({
            "descripcion": "Lorem Ipsum Dolor Sit Amet",
            "direccion": "Avinguda Diagonal 34, Barcelona, Spain",
            "email_de_contacto": "enric.margot@gmail.com",
            "especialidades": ["/api/especialidad/1"],
            "denuncias": [],
            "requisitos_de_idioma": [],
            "congelaciones": [],
            "requisitos_de_conocimiento_tecnico": [],
            "requisitos_de_experiencia_laboral": [],
            "suscripciones": [],
            "fecha_de_creacion": "2014-04-14T22:53:05.189272",
            "fecha_de_incorporacion": "2014-04-14",
            "fecha_de_ultima_modificacion": "2014-04-14T22:53:05.249665",
            "hay_posibilidad_de_tfg": false,
            "horario": "manyana",
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
        }, function(data) {
            console.log(data);
        });
    }
]);

myApp.controller('detallesOferta', ['$scope', '$routeParams', 'OfertaDeEmpresa', 'OfertaDeProyectoEmprendedor', 'OfertaDeDepartamento', 'Conocimiento',
    function($scope, $routeParams, OfertaDeEmpresa, OfertaDeProyectoEmprendedor, OfertaDeDepartamento, Conocimiento) {
        $scope.loading = true;
        $scope.tipousuario = ' ';
        $scope.texto = '';

        function getData(data, tipo, texto) {
            console.log(data);
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
            id: 'mañana',
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
        })
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