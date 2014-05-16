'use strict';

/* Controllers */

var myApp = angular.module('myApp.controllers', []);

myApp.controller('login', ['$scope', '$rootScope', '$location', '$cookieStore', 'authlogin', 'appAuth',
    function($scope, $rootScope, $location, $cookieStore, authlogin, appAuth) {
        if (appAuth.isLoggedIn())
            $location.path('/home');

        $scope.login = function(user) {
            authlogin.login(user, function(data) {
                $cookieStore.put('login', data);
                $rootScope.userCredentials = data;
                appAuth.redirectToAttemptedUrl();
            });
        };
        $scope.logout = function() {
            $cookieStore.remove('login');
            delete $rootScope.userCredentials;
            delete $scope.userCredentials;
            $location.path('/login');
        };
    }
]);


myApp.controller('publicarOferta', ['$scope', '$location', 'OfertaDeEmpresa', 'OfertaDeProyectoEmprendedor', 'OfertaDeDepartamento', 'Especialidad', 'appAuth', 'BeneficiosLaborales', 'RequisitosIdioma', 'RequisitosExperienciaLaboral', 'RequisitosConocimientoTecnico', 'Idioma', 'SectorMercado', 'ConocimientoTecnico',
    function($scope, $location, OfertaDeEmpresa, OfertaDeProyectoEmprendedor, OfertaDeDepartamento, Especialidad, appAuth, BeneficiosLaborales, RequisitosIdioma, RequisitosExperienciaLaboral, RequisitosConocimientoTecnico, Idioma, SectorMercado, ConocimientoTecnico) {

        $scope.oferta = {};
        $scope.ct = {};
        $scope.idiomatoadd = {};
        $scope.experienciatoadd = {};
        $scope.requisitos_de_conocimiento_tecnico = {};
        $scope.requisitos_de_idioma = {};
        $scope.requisitos_de_experiencia = {};
        $scope.sectormercado = {};

        if (!appAuth.isLoggedIn()) {
            appAuth.saveAttemptUrl();
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
                $scope.oferta.titulo = "Test";
            };
        }

        function crearOfertaGenerico(servicio, beneficios, oferta, requisitos) {

            console.log("Oferta a insertar");
            console.log("--------------OFERTA--------------");
            console.log(oferta);
            console.log("------------BENEFICIOS------------");
            console.log(beneficios);
            console.log("------------REQUISITOS------------");
            console.log(requisitos);

            /*            BeneficiosLaborales.add(beneficios, function(data) {
                servicio.addNew(oferta, function(dataOferta) {
                    RequisitosConocimientoTecnico.add(requisitos.conocimiento, function(dataConocimiento) {

                    }, function(dataErrorRequisitos) {
                        //Error al crear los requisitos de conocimiento
                    });
                    RequisitosIdioma.add(requisitos.idioma, function(dataIdioma) {

                    }, function(dataErrorRequisitos) {
                        //Error al crear los requisitos de idioma
                    });
                    RequisitosExperienciaLaboral.add(requisitos.experiencia, function(dataExperiencia) {

                    }, function(dataErrorRequisitos) {
                        //Error al crear los requisitos laborales
                    });
                }, function(dataErrorOferta) {
                    //Error al crear la oferta
                });

            }, function(dataErrorBeneficios) {
                //Error al crear los beneficios
            });*/
        };

        /**
         * Crear oferta y editar los conocimientos tecnicos
         *
         **/
        $scope.crearOferta = function(oferta, beneficios) {
            var BeneficiostoAdd = {};
            var reqIdiomatoAdd = [];
            var reqExptoAdd = [];
            var reqContoAdd = [];
            var requisitos = {};
            for (var i = 0; i < beneficios.length; i++) {
                BeneficiostoAdd[beneficios[i]] = true;
            };

            for (var property in $scope.requisitos_de_idioma) {
                if ($scope.requisitos_de_idioma.hasOwnProperty(property)) {
                    reqIdiomatoAdd.push($scope.requisitos_de_idioma[property].resource_uri);
                }
            }

            for (var property in $scope.requisitos_de_experiencia) {
                if ($scope.requisitos_de_experiencia.hasOwnProperty(property)) {
                    reqExptoAdd.push($scope.requisitos_de_experiencia[property].resource_uri);
                }
            }

            for (var property in $scope.requisitos_de_conocimiento_tecnico) {
                if ($scope.requisitos_de_conocimiento_tecnico.hasOwnProperty(property)) {
                    reqContoAdd.push($scope.requisitos_de_conocimiento_tecnico[property].resource_uri);
                }
            }

            requisitos['idiomas'] = reqIdiomatoAdd;
            requisitos['experiencia'] = reqExptoAdd;
            requisitos['conocimiento'] = reqContoAdd;

            if ($scope.userCredentials.tipo == 'Profesor') {
                crearOfertaGenerico(OfertaDeDepartamento, BeneficiostoAdd, oferta, requisitos);
            } else if ($scope.userCredentials.tipo == 'Estudiante') {
                crearOfertaGenerico(OfertaDeProyectoEmprendedor, BeneficiostoAdd, oferta, requisitos);
            } else {
                crearOfertaGenerico(OfertaDeEmpresa, BeneficiostoAdd, oferta, requisitos);
            };
        };

        $scope.addConocimiento = function(newCon) {
            $scope.requisitos_de_conocimiento_tecnico[newCon.nombre.conocimiento] = {
                'nivel': newCon.nivel,
                'conocimiento': newCon.nombre.conocimiento,
                'resource_uri': newCon.nombre.resource_uri
            };
        };

        $scope.deleteConocimiento = function(delCon) {
            delete $scope.requisitos_de_conocimiento_tecnico[delCon.conocimiento];
        };

        $scope.addIdioma = function(newIdioma) {
            $scope.requisitos_de_idioma[newIdioma.nombre.idioma] = {
                'nivel': newIdioma.nivel,
                'idioma': newIdioma.nombre.idioma,
                'resource_uri': newIdioma.nombre.resource_uri
            };
        };

        $scope.deleteIdioma = function(delIdioma) {
            delete $scope.requisitos_de_idioma[delIdioma.idioma];
        };

        $scope.addExp = function(newExp) {
            $scope.requisitos_de_experiencia[newExp.sector.sector] = {
                'meses': newExp.meses,
                'sector': newExp.sector.sector,
                'resource_uri': newExp.sector.resource_uri
            };
        };

        $scope.deleteExp = function(delExp) {
            delete $scope.requisitos_de_experiencia[delExp.sector];
        };


        //calendar Button function
        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.opened = true;
        };

        $scope.tipos_contrato = [{
            id: 'practicas',
            name: 'Prácticas'
        }, {
            id: 'indefinido',
            name: 'Indefinido'
        }, {
            id: 'temporal',
            name: 'Temporal'
        }];

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

        $scope.niveles_conocimiento = [{
            id: 'medio',
            name: 'Medio'
        }, {
            id: 'avanzado',
            name: 'Avanzado'
        }, {
            id: 'experto',
            name: 'Experto'
        }];

        $scope.beneficiosLaborales = [{
            id: 'horario_flexible',
            name: 'Horario flexible'
        }, {
            id: 'vacaciones_ajustables',
            name: 'Vacaciones ajustables'
        }, {
            id: 'seguro_de_vida',
            name: 'Seguro de vida'
        }, {
            id: 'seguro_medico',
            name: 'Seguro médico'
        }, {
            id: 'posibilidad_de_ascenso',
            name: 'Posibilidad de ascenso'
        }, {
            id: 'transporte',
            name: 'Transporte'
        }, {
            id: 'primas',
            name: 'Primas'
        }, {
            id: 'comidas',
            name: 'Comidas'
        }, {
            id: 'trabajo_desde_casa',
            name: 'Trabajo desde casa'
        }];

        Especialidad.queryAll({
            'limit': 200
        }, function(data) {
            $scope.especialidades = data.objects;
        });

        Idioma.queryAll({
            'limit': 200
        }, function(data) {
            $scope.idiomas = data.objects;
            $scope.idiomatoadd.nombre = $scope.idiomas[0];
        });

        ConocimientoTecnico.queryAll({
            'limit': 200
        }, function(data) {
            $scope.conocimientotecnico = data.objects;
            $scope.ct.nombre = $scope.conocimientotecnico[0];
        });

        SectorMercado.queryAll({
            'limit': 200
        }, function(data) {
            $scope.sectormercado = data.objects;
            $scope.experienciatoadd.sector = $scope.sectormercado[0];
        });

        $scope.checked_beneficios = [];
        $scope.oferta.horario = $scope.tipos_horario[0].id;
        $scope.oferta.tipo_de_jornada = $scope.tipos_jornada[0].id;
        $scope.ct.nivel = $scope.niveles_conocimiento[0].id;
        $scope.idiomatoadd.nivel = $scope.niveles_conocimiento[0].id;
        $scope.oferta.tipo_de_contrato = $scope.tipos_contrato[0].id;

    }
]);

myApp.controller('detallesOferta', ['$scope', '$location', '$routeParams', 'OfertaDeEmpresa', 'OfertaDeProyectoEmprendedor', 'OfertaDeDepartamento', 'ConocimientoTecnico', 'appAuth',

    function($scope, $location, $routeParams, OfertaDeEmpresa, OfertaDeProyectoEmprendedor, OfertaDeDepartamento, Conocimiento, appAuth) {

        var beneficiosLaboralesText = {
            'horario_flexible': 'Horario flexible',
            'vacaciones_ajustables': 'Vacaciones ajustables',
            'seguro_de_vida': 'Seguro de vida',
            'seguro_medico': 'Seguro médico',
            'posibilidad_de_ascenso': 'Posibilidad de ascenso',
            'transporte': 'Transporte',
            'primas': 'Primas',
            'comidas': 'Comidas',
            'trabajo_desde_casa': 'Trabajo desde casa'
        };
        $scope.getBeneficioText = function(key) {
            return beneficiosLaboralesText[key];
        };

        function getData(data, tipo, texto) {
            $scope.oferta = data;
            $scope.tipousuario = tipo;
            $scope.textousuario = texto;
            $scope.loading = false;
            delete $scope.oferta.beneficios_laborales.resource_uri;
            delete $scope.oferta.beneficios_laborales.id;
        };

        if (!appAuth.isLoggedIn()) {
            appAuth.saveAttemptUrl();
            $location.path("/login");
        } else {
            $scope.loading = true;
            $scope.tipousuario = ' ';
            $scope.texto = '';



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
    }
]);

myApp.controller('buscarOfertas', ['$scope', '$location', 'OfertaDeEmpresa', 'OfertaDeProyectoEmprendedor', 'OfertaDeDepartamento', 'Oferta', 'Especialidad', 'appAuth',
    function($scope, $location, OfertaDeEmpresa, OfertaDeProyectoEmprendedor, OfertaDeDepartamento, Oferta, Especialidad, appAuth) {

        //Pagination data funtion
        function pagCalculation(data) {
            $scope.ofertas = data.objects;
            $scope.totalItems = data.meta.total_count;
            console.log($scope.totalItems);
            $scope.limit = data.meta.limit;
            $scope.numPages = data.meta.total_count / data.meta.limit;
            $scope.loading = false;
            $scope.sinResultados = $scope.ofertas.length == 0;
        }

        if (!appAuth.isLoggedIn()) {
            appAuth.saveAttemptUrl();
            $location.path("/login");
        } else {
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
    }
]);


myApp.controller('perfilEmpresa', ['$scope', '$location', '$routeParams', 'Empresa', 'appAuth',
    function($scope, $location, $routeParams, Empresa, appAuth) {
        if (!appAuth.isLoggedIn()) {
            appAuth.saveAttemptUrl();
            $location.path("/login");
        } else {
            Empresa.query({
                id: $routeParams.id
            }, function(data) {
                $scope.empresa = data;
            });
        }
    }
]);

myApp.controller('perfilProfesor', ['$scope', '$location', '$routeParams', 'Profesor', 'appAuth',
    function($scope, $location, $routeParams, Profesor, appAuth) {
        if (!appAuth.isLoggedIn()) {
            appAuth.saveAttemptUrl();
            $location.path("/login");
        } else {
            Profesor.query({
                id: $routeParams.id
            }, function(data) {
                $scope.profesor = data;
            });
        }
    }
]);

myApp.controller('perfilEstudiante', ['$scope', '$location', '$routeParams', 'Estudiante', 'appAuth',
    function($scope, $location, $routeParams, Estudiante, appAuth) {
        if (!appAuth.isLoggedIn()) {
            appAuth.saveAttemptUrl();
            $location.path("/login");
        } else {
            Estudiante.query({
                id: $routeParams.id
            }, function(data) {
                $scope.estudiante = data;
            });
        }
    }
]);

myApp.controller('home', ['$scope', '$location', 'appAuth',
    function($scope, $location, appAuth) {
        if (!appAuth.isLoggedIn()) {
            appAuth.saveAttemptUrl();
            $location.path("/login");
        } else {

        }
    }
]);