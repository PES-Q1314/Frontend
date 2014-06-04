'use strict';

/* Controllers */

var myApp = angular.module('myApp.controllers');

myApp.controller('login', ['$scope', '$rootScope', '$location', '$cookieStore', 'authlogin', 'appAuth', 'errorMessages',
    function($scope, $rootScope, $location, $cookieStore, authlogin, appAuth, errorMessages) {
        $scope.loading = false;
        if (appAuth.isLoggedIn()) {
            $scope.loginPath = false;
        }
        $scope.loginPath = true;
        $scope.login = function(user) {
            $scope.loading = true;
            authlogin.login(user, function(data) {
                $scope.loading = false;
                $cookieStore.put('login', data);
                $rootScope.userCredentials = data;
                appAuth.redirectToAttemptedUrl();

            }, function() {
                $scope.loading = false;
                $scope.errorMessages = {
                    'type': 'alert-danger',
                    'msn': 'Usuario/contraseña incorrecto'
                };
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

myApp.controller('menuController', ['$scope', '$rootScope', '$location',
    function($scope, $rootScope, $location) {
        $scope.isActive = function(viewLocation) {
            return viewLocation === $location.path();
        };
    }
]);

myApp.controller('publicarOferta', ['$scope', '$location', 'OfertaDeEmpresa', 'OfertaDeProyectoEmprendedor', 'OfertaDeDepartamento', 'Especialidad', 'appAuth', 'BeneficiosLaborales', 'RequisitosIdioma', 'RequisitosExperienciaLaboral', 'RequisitosConocimientoTecnico', 'Idioma', 'SectorMercado', 'ConocimientoTecnico', 'VectoresDeDatos', 'errorMessages',
    function($scope, $location, OfertaDeEmpresa, OfertaDeProyectoEmprendedor, OfertaDeDepartamento, Especialidad, appAuth, BeneficiosLaborales, RequisitosIdioma, RequisitosExperienciaLaboral, RequisitosConocimientoTecnico, Idioma, SectorMercado, ConocimientoTecnico, VectoresDeDatos, errorMessages) {

        $scope.errorMessages = errorMessages.getProperty();
        errorMessages.setProperty({});

        $scope.oferta = {};
        $scope.ct = {};
        $scope.idiomatoadd = {};
        $scope.experienciatoadd = {};
        $scope.requisitos_de_conocimiento_tecnico = {};
        $scope.requisitos_de_idioma = {};
        $scope.requisitos_de_experiencia = {};
        $scope.sectormercado = {};

        if (!appAuth.isLoggedIn()) {
            $location.path("/login");
        } else {
            $scope.buttonText = "Publicar oferta";
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
            }
        }

        $scope.isUnchanged = function(user) {
            return angular.equals(user, $scope.master);
        };

        function crearOfertaGenerico(servicio, beneficios, oferta, requisitos) {
            var c;

            servicio.addNew(oferta, function(dataOferta) {

                beneficios.id = dataOferta.beneficios_laborales.id;
                BeneficiosLaborales.edit(beneficios, function(dataBeneficios) {});
                for (c in requisitos.conocimiento) {
                    if (requisitos.conocimiento.hasOwnProperty(c)) {
                        var d = {
                            oferta: dataOferta.resource_uri,
                            conocimiento: requisitos.conocimiento[c].resource_uri,
                            nivel: requisitos.conocimiento[c].nivel
                        };
                        RequisitosConocimientoTecnico.add(d, function(d) {});
                    }
                }

                for (c in requisitos.experiencia) {
                    if (requisitos.experiencia.hasOwnProperty(c)) {
                        var d = {
                            oferta: dataOferta.resource_uri,
                            sector: requisitos.experiencia[c].resource_uri,
                            meses: requisitos.experiencia[c].meses
                        };
                        RequisitosExperienciaLaboral.add(d, function(d) {});
                    }
                }

                for (c in requisitos.idiomas) {
                    if (requisitos.idiomas.hasOwnProperty(c)) {
                        var d = {
                            oferta: dataOferta.resource_uri,
                            idioma: requisitos.idiomas[c].resource_uri,
                            nivel: requisitos.idiomas[c].nivel
                        };
                        RequisitosIdioma.add(d, function(d) {});
                    }
                }

                errorMessages.setProperty({
                    'type': 'alert-success',
                    'msn': 'Oferta creada correctamente'
                });
                $location.path("/misOfertas");

            }, function() {
                errorMessages.setProperty({
                    'type': 'alert-danger',
                    'msn': 'Error al crear la oferta, intentelo de nuevo'
                });
            });
            $scope.errorMessages = errorMessages.getProperty();
            errorMessages.setProperty({});
        }

        /**
         * Crear oferta y editar los conocimientos tecnicos
         *
         **/
        $scope.crearOferta = function(oferta, beneficios) {
            var BeneficiostoAdd = {};
            var requisitos = {};
            for (var i = 0; i < beneficios.length; i++) {
                BeneficiostoAdd[beneficios[i]] = true;
            }

            requisitos['idiomas'] = $scope.requisitos_de_idioma;
            requisitos['experiencia'] = $scope.requisitos_de_experiencia;
            requisitos['conocimiento'] = $scope.requisitos_de_conocimiento_tecnico;

            if ($scope.userCredentials.tipo == 'Profesor') {
                crearOfertaGenerico(OfertaDeDepartamento, BeneficiostoAdd, oferta, requisitos);
            } else if ($scope.userCredentials.tipo == 'Estudiante') {
                crearOfertaGenerico(OfertaDeProyectoEmprendedor, BeneficiostoAdd, oferta, requisitos);
            } else {
                crearOfertaGenerico(OfertaDeEmpresa, BeneficiostoAdd, oferta, requisitos);
            }
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
            if (angular.isNumber(newExp.meses) && newExp.meses != 0) {
                $scope.requisitos_de_experiencia[newExp.sector.sector] = {
                    'meses': newExp.meses,
                    'sector': newExp.sector.sector,
                    'resource_uri': newExp.sector.resource_uri
                };
            }
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

        $scope.tipos_contrato = VectoresDeDatos.tiposDeContrato();
        $scope.tipos_jornada = VectoresDeDatos.tiposDeJornada();
        $scope.tipos_horario = VectoresDeDatos.tiposDeHorario();
        $scope.niveles_conocimiento = VectoresDeDatos.nivelesDeConocimiento();
        $scope.beneficiosLaborales = VectoresDeDatos.beneficiosLaborales();
        $scope.ultimoCurso = VectoresDeDatos.ultimo_curso_academico_superado();
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
        $scope.oferta.ultimo_curso_academico_superado = $scope.ultimoCurso[4].id;

    }
]);

myApp.controller('detallesOferta', ['$scope', '$location', '$routeParams', '$modal', 'Especialidad', 'OfertaDeEmpresa', 'OfertaDeProyectoEmprendedor', 'OfertaDeDepartamento', 'ConocimientoTecnico', 'appAuth', 'VectoresDeDatos', 'errorMessages',

    function($scope, $location, $routeParams, $modal, Especialidad, OfertaDeEmpresa, OfertaDeProyectoEmprendedor, OfertaDeDepartamento, Conocimiento, appAuth, VectoresDeDatos, errorMessages) {

        var beneficiosLaboralesText = VectoresDeDatos.beneficiosLaboralesText();
        var ultimocursoText = VectoresDeDatos.ultimo_curso_academico_superado_key();
        var horarioText = VectoresDeDatos.horarios_key();
        var tipoContratoText = VectoresDeDatos.tipocontrato_key();
        var tipoDeJornadaText = VectoresDeDatos.tipojornada_key();
        $scope.tipos_contrato = VectoresDeDatos.tiposDeContrato();
        $scope.tipos_jornada = VectoresDeDatos.tiposDeJornada();
        $scope.tipos_horario = VectoresDeDatos.tiposDeHorario();
        $scope.niveles_conocimiento = VectoresDeDatos.nivelesDeConocimiento();
        $scope.beneficiosLaborales = VectoresDeDatos.beneficiosLaborales();
        $scope.ultimoCurso = VectoresDeDatos.ultimo_curso_academico_superado();
        $scope.checked_beneficios = [];
        $scope.requisitos_de_conocimiento_tecnico = {};
        $scope.requisitos_de_idioma = {};
        $scope.requisitos_de_experiencia = {};

        $scope.open = function(id) {
            $scope.motivo = "";
            var modalInstance = $modal.open({
                templateUrl: 'partials/modals/denunciarElementoModal.html',
                controller: 'ModalInstanceCtrl'
            });
            modalInstance.result.then(function(result) {
                $scope.errorMessages = {
                    'type': 'alert-info',
                    'msn': 'Denuncia registrada correctamente'
                };
            }, function(result) {});
        };

        $scope.getBeneficioText = function(key) {
            return beneficiosLaboralesText[key];
        };

        $scope.getUltimoCursoKey = function(key) {
            return ultimocursoText[key];
        };

        $scope.getHorarioText = function(key) {
            return horarioText[key];
        };

        $scope.getTipoContratoText = function(key) {
            return tipoContratoText[key];
        };

        $scope.getTipoJornadaText = function(key) {
            return tipoDeJornadaText[key];
        };

        $scope.getPosibilidadTFG = function(key) {
            return (key ? 'Si' : 'No');
        };

        function getData(data, tipo, texto) {
            $scope.oferta = data;
            $scope.tipousuario = tipo;
            $scope.textousuario = texto;
            $scope.loading = false;
            $scope.checked_beneficios = [];

            for (var property in data.beneficios_laborales) {
                if (data.beneficios_laborales.hasOwnProperty(property)) {
                    if (data.beneficios_laborales[property] === true) {
                        $scope.checked_beneficios.push(property);
                    }
                }
            }

            for (var i = 0; i < data.requisitos_de_conocimiento_tecnico.length; i++) {
                $scope.requisitos_de_conocimiento_tecnico[data.requisitos_de_conocimiento_tecnico[i].conocimiento.conocimiento] = {
                    'conocimiento': data.requisitos_de_conocimiento_tecnico[i].conocimiento.conocimiento,
                    'nivel': data.requisitos_de_conocimiento_tecnico[i].nivel,
                    'resource_uri': data.requisitos_de_conocimiento_tecnico[i].conocimiento.resource_uri
                };
            }

            for (var i = 0; i < data.requisitos_de_idioma.length; i++) {
                $scope.requisitos_de_idioma[data.requisitos_de_idioma[i].idioma.idioma] = {
                    'idioma': data.requisitos_de_idioma[i].idioma.idioma,
                    'nivel': data.requisitos_de_idioma[i].nivel,
                    'resource_uri': data.requisitos_de_idioma[i].idioma.resource_uri
                };
            }

            for (var i = 0; i < data.requisitos_de_experiencia_laboral.length; i++) {
                $scope.requisitos_de_experiencia[data.requisitos_de_experiencia_laboral[i].sector.sector] = {
                    'sector': data.requisitos_de_experiencia_laboral[i].sector.sector,
                    'meses': data.requisitos_de_experiencia_laboral[i].meses,
                    'resource_uri': data.requisitos_de_experiencia_laboral[i].sector.resource_uri
                };
            }

            if (data.estado_de_la_suscripcion == 'no suscrito') {
                $scope.buttonTextA = 'Suscribirse';
                $scope.buttonTextB = 'Suscribirse';
                $scope.suscrito = false;
            } else {
                $scope.buttonTextA = "Ya estás suscrito";
                $scope.buttonTextB = 'Anular';
                $scope.suscrito = true;
            }
            $scope.buttonText = $scope.buttonTextA;
        }

        if (!appAuth.isLoggedIn()) {
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
                $scope.showTfg = true;
                $scope.showUltimoCurso = true;
            } else if ($routeParams.tipoOferta == 'OfertaDeDepartamento') {
                OfertaDeDepartamento.query({
                    id: $routeParams.idOferta
                }, function(data) {
                    getData(data, 'profesor', 'Profesor ofertor');
                });
                $scope.showTfg = false;
                $scope.showUltimoCurso = true;
            } else {
                OfertaDeProyectoEmprendedor.query({
                    id: $routeParams.idOferta
                }, function(data) {
                    getData(data, 'estudiante', 'Estudiante ofertor');
                });
                $scope.showTfg = false;
                $scope.showUltimoCurso = false;
            };

            $scope.autorOferta = function(t) {
                var tmp = "";
                if (t != undefined) {
                    tmp = t.split("/")[3];
                }
                return tmp;
            };

            $scope.esEstudiante = function(autorOferta) {
                return ($scope.userCredentials.tipo == 'Estudiante' && $scope.userCredentials.id != $scope.autorOferta(autorOferta));
            }

            $scope.suscripcion = function(id, suscrito) {
                var servicio;
                if ($routeParams.tipoOferta == 'OfertaDeEmpresa') {
                    servicio = OfertaDeEmpresa;
                } else if ($routeParams.tipoOferta == 'OfertaDeDepartamento') {
                    servicio = OfertaDeDepartamento;
                } else {
                    servicio = OfertaDeProyectoEmprendedor;
                }

                if (suscrito) {
                    servicio.dessuscribirse({
                        'id': id
                    }, function() {
                        $scope.buttonTextA = 'Suscribirse';
                        $scope.buttonTextB = 'Suscribirse';
                        $scope.suscrito = false;
                        $scope.buttonText = $scope.buttonTextA;
                    });
                } else {
                    servicio.suscribirse({
                        'id': id
                    }, function() {
                        $scope.buttonTextA = "Ya estás suscrito";
                        $scope.buttonTextB = 'Anular';
                        $scope.suscrito = true;
                        $scope.buttonText = $scope.buttonTextA;
                    });
                }
            }
        }
    }
]);

myApp.controller('buscarOfertas', ['$scope', '$location', 'OfertaDeEmpresa', 'OfertaDeProyectoEmprendedor', 'OfertaDeDepartamento', 'Oferta', 'Especialidad', 'appAuth', 'VectoresDeDatos',
    function($scope, $location, OfertaDeEmpresa, OfertaDeProyectoEmprendedor, OfertaDeDepartamento, Oferta, Especialidad, appAuth, VectoresDeDatos) {

        //Pagination data funtion
        function pagCalculation(data) {
            $scope.ofertas = data.objects;
            $scope.totalItems = data.meta.total_count;
            $scope.limit = data.meta.limit;
            $scope.numPages = data.meta.total_count / data.meta.limit;
            $scope.loading = false;
            $scope.sinResultados = $scope.ofertas.length == 0;
        }

        if (!appAuth.isLoggedIn()) {
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

            $scope.getHorarioText = function(text) {
                return VectoresDeDatos.horarios_key()[text];
            };

            //Filter Query
            $scope.OfertasQuery = function(query) {
                $scope.loading = true;
                $scope.sinResultados = false;
                query = query || {
                    tipooferta: {
                        name: 'Todas'
                    },
                    limit: 10,
                    offset: 0,
                    order_by: 'id'
                };
                $scope.query = query;
                var dateObj;
                if (query.fecha_de_incorporacion__gte != undefined) {
                    dateObj = query.fecha_de_incorporacion__gte;
                    query.fecha_de_incorporacion__gte = dateObj.getFullYear() + '-' + (dateObj.getMonth() + 1) + '-' + dateObj.getDate();
                }
                delete query.especialidades;
                if (query.tipooferta.name == $scope.tipos_oferta[1].name) {
                    OfertaDeEmpresa.queryAll(query, function(data) {
                        query.fecha_de_incorporacion__gte = dateObj;
                        pagCalculation(data);
                    });
                } else if (query.tipooferta.name == $scope.tipos_oferta[2].name) {
                    OfertaDeDepartamento.queryAll(query, function(data) {
                        query.fecha_de_incorporacion__gte = dateObj;
                        pagCalculation(data);
                    });
                } else if (query.tipooferta.name == $scope.tipos_oferta[3].name) {
                    OfertaDeProyectoEmprendedor.queryAll(query, function(data) {
                        query.fecha_de_incorporacion__gte = dateObj;
                        pagCalculation(data);
                    });
                } else {
                    Oferta.queryAll(query, function(data) {
                        query.fecha_de_incorporacion__gte = dateObj;
                        pagCalculation(data);
                    });
                }

            };

            //pagination function
            $scope.selectPage = function(page) {
                $scope.currentPage = page;
                $scope.query.offset = (page - 1) * 10;
                $scope.OfertasQuery($scope.query);
            };

            // Inicilizaciones filtros
            $scope.query = {
                tipooferta: {
                    name: 'Todas'
                },
                activa: true,
                limit: 10,
                offset: 0,
                order_by: 'id'
            };
            $scope.tipos_oferta = VectoresDeDatos.tiposDeOferta();
            $scope.tipos_jornada = VectoresDeDatos.tiposDeJornada();
            $scope.tipos_horario = VectoresDeDatos.tiposDeHorario();
            $scope.ultimo_curso_academico_superado = VectoresDeDatos.ultimo_curso_academico_superado();
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

myApp.controller('ModalInstanceCtrl', ['$scope', '$modalInstance',
    function($scope, $modalInstance, $parent) {
        $scope.ok = function() {
            $modalInstance.close($scope.motivo);
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    }
]);

myApp.controller('misOfertas', ['$scope', '$location', '$routeParams', '$modal', 'OfertaDeEmpresa', 'OfertaDeProyectoEmprendedor', 'OfertaDeDepartamento', 'appAuth', 'errorMessages',
    function($scope, $location, $routeParams, $modal, OfertaDeEmpresa, OfertaDeProyectoEmprendedor, OfertaDeDepartamento, appAuth, errorMessages) {

        $scope.errorMessages = errorMessages.getProperty();
        errorMessages.setProperty({});

        function eliminarGen(servicio, id, motivo) {
            servicio.update({
                'id': id
            }, {
                'motivo': motivo,
                'fecha_de_eliminacion': new Date()
            }, function() {
                $scope.getPagedDataAsyncActiva($scope.pagingOptionsActiva.pageSize, $scope.pagingOptionsActiva.currentPage);
                $scope.getPagedDataAsyncPasada($scope.pagingOptionsPasada.pageSize, $scope.pagingOptionsPasada.currentPage);
            });
        }

        function eliminar(id, motivo) {
            if ($scope.userCredentials.tipo == 'Profesor') {
                eliminarGen(OfertaDeDepartamento, id, motivo);
            } else if ($scope.userCredentials.tipo == 'Estudiante') {
                eliminarGen(OfertaDeProyectoEmprendedor, id, motivo);
            } else {
                eliminarGen(OfertaDeEmpresa, id, motivo);
            }
        }

        $scope.open = function(id) {
            $scope.motivo = "";
            var modalInstance = $modal.open({
                templateUrl: 'partials/modals/eliminarOfertaModalConfirmation.html',
                controller: 'ModalInstanceCtrl'
            });
            modalInstance.result.then(function(result) {
                eliminar(id.entity.id, result);
            }, function(result) {});
        };

        function getOfertasActivas(limit, offset) {
            var servicio;
            $scope.loadingActivas = true;
            if ($scope.userCredentials.tipo == 'Profesor') {
                servicio = OfertaDeDepartamento;
            } else if ($scope.userCredentials.tipo == 'Estudiante') {
                servicio = OfertaDeProyectoEmprendedor;
            } else {
                servicio = OfertaDeEmpresa;
            }
            servicio.queryAll({
                'usuario__id': $scope.userCredentials.id,
                'limit': limit,
                'offset': offset,
                'activa': true,
                'order_by': '-fecha_de_creacion'
            }, function(data) {
                $scope.setPagingDataActiva(data.objects, data.meta.total_count);
                $scope.ofertasActivas = data.objects;
                $scope.loadingActivas = false;
                $(window).resize();
            });
        }

        function getOfertasPasadas(limit, offset) {
            var servicio;
            $scope.loadingPasadas = true;
            if ($scope.userCredentials.tipo == 'Profesor') {
                servicio = OfertaDeDepartamento;
            } else if ($scope.userCredentials.tipo == 'Estudiante') {
                servicio = OfertaDeProyectoEmprendedor;
            } else {
                servicio = OfertaDeEmpresa;
            }
            servicio.queryAll({
                'usuario__id': $scope.userCredentials.id,
                'limit': limit,
                'offset': offset,
                'activa': false,
                'order_by': '-fecha_de_creacion'
            }, function(data) {
                $scope.setPagingDataPasada(data.objects, data.meta.total_count);
                $scope.ofertasPasadas = data.objects;
                $scope.loadingPasadas = false;

                for (var i = 0; i < $scope.ofertasPasadas.length; i++) {
                    var oferta = $scope.ofertasPasadas[i];
                    if (oferta.fecha_de_eliminacion != null) {
                        $scope.ofertasPasadas[i].baja_oferta = oferta.fecha_de_eliminacion;
                        $scope.ofertasPasadas[i].motivo = 'Eliminada';
                        $scope.ofertasPasadas[i].mod = false;
                    } else if (oferta.esta_congelado) {
                        $scope.ofertasPasadas[i].baja_oferta = oferta.fecha_de_creacion;
                        $scope.ofertasPasadas[i].motivo = 'Congelada';
                        $scope.ofertasPasadas[i].mod = true;
                    } else {
                        $scope.ofertasPasadas[i].baja_oferta = oferta.fecha_de_creacion;
                        $scope.ofertasPasadas[i].motivo = 'API';
                        $scope.ofertasPasadas[i].mod = (i % 2 == 0);
                    }
                }
                $(window).resize();

            });
        };

        $scope.totalServerItemsActiva = 0;
        $scope.totalServerItemsPasada = 0;
        $scope.pagingOptionsActiva = {
            pageSizes: [10],
            pageSize: 10,
            currentPage: 1
        };

        $scope.pagingOptionsPasada = {
            pageSizes: [10],
            pageSize: 10,
            currentPage: 1
        };

        $scope.getTableStyleActiva = function() {
            var rowHeight = 35;
            var headerHeight = 45;
            if ($scope.myDataActiva == undefined) {
                return "";
            } else {
                return {
                    height: (($scope.myDataActiva.length + 2) * rowHeight + headerHeight) + "px"
                };
            }
        };

        $scope.getTableStylePasada = function() {
            var rowHeight = 35;
            var headerHeight = 45;
            if ($scope.myDataPasada == undefined) {
                return "";
            } else {
                return {
                    height: (($scope.myDataPasada.length + 2) * rowHeight + headerHeight) + "px"
                };
            }
        };

        $scope.setPagingDataActiva = function(data, total) {
            $scope.myDataActiva = data;
            $scope.totalServerItemsActiva = total;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        };

        $scope.setPagingDataPasada = function(data, total) {
            $scope.myDataPasada = data;
            $scope.totalServerItemsPasada = total;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        };

        $scope.getPagedDataAsyncActiva = function(pageSize, page) {
            getOfertasActivas(pageSize, ((page - 1) * pageSize));
        };

        $scope.getPagedDataAsyncPasada = function(pageSize, page) {
            getOfertasPasadas(pageSize, ((page - 1) * pageSize));
        };

        $scope.tieneSuscripciones = function(row) {
            return row.entity.suscripciones.length == 0;
        }

        $scope.versuscripciones = function(row) {
            $location.path("/suscripcionesOferta/" + row.entity.id);
        }

        $scope.getPagedDataAsyncActiva($scope.pagingOptionsActiva.pageSize, $scope.pagingOptionsActiva.currentPage);

        $scope.getPagedDataAsyncPasada($scope.pagingOptionsPasada.pageSize, $scope.pagingOptionsPasada.currentPage);

        $scope.$watch('pagingOptionsActiva', function(newVal, oldVal) {
            if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
                $scope.getPagedDataAsyncActiva($scope.pagingOptionsActiva.pageSize, $scope.pagingOptionsActiva.currentPage);
            }
        }, true);

        $scope.$watch('pagingOptionsPasada', function(newVal, oldVal) {
            if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
                $scope.getPagedDataAsyncPasada($scope.pagingOptionsPasada.pageSize, $scope.pagingOptionsPasada.currentPage);
            }
        }, true);

        $scope.accionesOfertasActiva = '<button type="button" class="btn miniButtons btn-xs btn-info" ng-click="versuscripciones(row)" ng-disabled="tieneSuscripciones(row)" >Suscripciones</button><button type="button" class="btn miniButtons btn-xs btn-primary" ng-click="modificar(row)" >Modificar</button><button type="button" class="btn miniButtons btn-xs btn-danger" ng-click="open(row)">Eliminar</button>';

        $scope.accionesOfertasPasada = '<button type="button" ng-if="row.entity.mod" class="btn miniButtons btn-xs btn-primary" ng-click="modificar(row)" >Modificar</button><button ng-if="!row.entity.mod" type="button" class="btn miniButtons btn-xs btn-success" ng-click="restablecer(row)">Restablecer</button>';



        $scope.linkTitulo = '<div class="ngCellText ng-scope col1 colt1" ng-class="col.colIndex()"><a href="#/detallesOferta/{{ row.entity.tipo }}/{{ row.entity.id }}">{{row.entity.titulo}}</a></div>';


        $scope.modificar = function modificar(row) {
            $location.path(/modificarOferta/ + row.entity.id);
        };

        function restablecerGen(servicio, id) {
            servicio.update({
                'id': id
            }, {
                'motivo': '',
                'fecha_de_eliminacion': null
            }, function() {
                $scope.getPagedDataAsyncActiva($scope.pagingOptionsActiva.pageSize, $scope.pagingOptionsActiva.currentPage);
                $scope.getPagedDataAsyncPasada($scope.pagingOptionsPasada.pageSize, $scope.pagingOptionsPasada.currentPage);
            });
        }

        $scope.restablecer = function restablecer(row) {
            if ($scope.userCredentials.tipo == 'Profesor') {
                restablecerGen(OfertaDeDepartamento, row.entity.id);
            } else if ($scope.userCredentials.tipo == 'Estudiante') {
                restablecerGen(OfertaDeProyectoEmprendedor, row.entity.id);
            } else {
                restablecerGen(OfertaDeEmpresa, row.entity.id);
            }
        };

        $scope.gridOptionsActiva = {
            data: 'myDataActiva',
            enablePaging: true,
            showFooter: true,
            totalServerItems: 'totalServerItemsActiva',
            pagingOptions: $scope.pagingOptionsActiva,
            enableSorting: false,
            enableRowSelection: false,
            i18n: 'es',
            columnDefs: [{
                cellTemplate: $scope.linkTitulo,
                displayName: 'Titulo'
            }, {
                field: 'fecha_de_creacion',
                displayName: 'Fecha Alta',
                cellFilter: 'date:\'dd/MM/yyyy\''
            }, {
                displayName: 'Acciones',
                cellTemplate: $scope.accionesOfertasActiva,
                width: '40%'
            }]
        };

        $scope.gridOptionsPasada = {
            data: 'myDataPasada',
            enablePaging: true,
            showFooter: true,
            totalServerItems: 'totalServerItemsPasada',
            pagingOptions: $scope.pagingOptionsPasada,
            enableSorting: false,
            enableRowSelection: false,
            i18n: 'es',
            columnDefs: [{
                cellTemplate: $scope.linkTitulo,
                displayName: 'Titulo',
                width: '30%'
            }, {
                field: 'fecha_de_creacion',
                displayName: 'Alta oferta',
                cellFilter: 'date:\'dd/MM/yyyy\'',
                width: '15%'
            }, {
                field: 'baja_oferta',
                displayName: 'Baja Oferta',
                cellFilter: 'date:\'dd/MM/yyyy\'',
                width: '15%'
            }, {
                field: 'motivo',
                displayName: 'Motivo'
            }, {
                displayName: 'Acciones',
                cellTemplate: $scope.accionesOfertasPasada,
                width: '15%'
            }]
        };

        if (!appAuth.isLoggedIn()) {
            $location.path("/login");
        }


    }
]);

myApp.controller('suscripcionesOferta', ['$scope', '$location', '$routeParams', '$modal', 'Suscripcion', 'Oferta', 'appAuth', 'errorMessages',
    function($scope, $location, $routeParams, $modal, Suscripcion, Oferta, appAuth, errorMessages) {


        $scope.errorMessages = errorMessages.getProperty();
        errorMessages.setProperty({});

        function getDatosOferta() {
            Oferta.query({
                'id': $routeParams.idOferta
            }, function(data) {
                $scope.oferta = data;
            });
        };


        function getSuscripcionesTodas() {
            $scope.loadingActivas = true;
            Suscripcion.queryAll({
                'limit': 500,
                'offset': 0,
                'modelo_oid': $routeParams.idOferta
            }, function(data) {
                $scope.myDataActiva = [];
                $scope.myDataPasada = [];
                var numActivas = 0;
                var numPasadas = 0;
                for (var i = 0; i < data.objects.length; i++) {
                    if (data.objects[i].suscriptor_oid != $scope.userCredentials.id) {
                        if (data.objects[i].estado == 'pendiente') {
                            if ((numActivas >= (($scope.pagingOptionsActiva.currentPage - 1) * 10)) && (numActivas < ($scope.pagingOptionsActiva.currentPage * 10))) {
                                data.objects[i].comp = Math.round(Math.random() * 100) + '%';
                                $scope.myDataActiva.push(data.objects[i]);
                            }
                            numActivas++;
                        } else {
                            if ((numPasadas >= (($scope.pagingOptionsPasada.currentPage - 1) * 10)) && (numPasadas < ($scope.pagingOptionsPasada.currentPage * 10))) {
                                data.objects[i].comp = Math.round(Math.random() * 100) + '%';
                                $scope.myDataPasada.push(data.objects[i]);
                            }
                            numPasadas++;
                        }
                    }
                }
                $scope.setPagingDataActiva(numActivas);
                $scope.setPagingDataPasada(numPasadas);
                $scope.loadingActivas = false;
                $(window).resize();
            });
        };

        $scope.totalServerItemsActiva = 0;
        $scope.totalServerItemsPasada = 0;
        $scope.pagingOptionsActiva = {
            pageSizes: [10],
            pageSize: 10,
            currentPage: 1
        };
        $scope.pagingOptionsPasada = {
            pageSizes: [10],
            pageSize: 10,
            currentPage: 1
        };

        $scope.getTableStyleActiva = function() {
            var rowHeight = 35;
            var headerHeight = 45;
            if ($scope.myDataActiva == undefined) {
                return "";
            } else {
                return {
                    height: (($scope.myDataActiva.length + 2) * rowHeight + headerHeight) + "px"
                };
            }
        };

        $scope.getTableStylePasada = function() {
            var rowHeight = 35;
            var headerHeight = 45;
            if ($scope.myDataPasada == undefined) {
                return "";
            } else {
                return {
                    height: (($scope.myDataPasada.length + 2) * rowHeight + headerHeight) + "px"
                };
            }
        };

        $scope.setPagingDataActiva = function(total) {
            $scope.totalServerItemsActiva = total;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        };

        $scope.setPagingDataPasada = function(total) {
            $scope.totalServerItemsPasada = total;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        };

        $scope.getSuscripciones = function(pageSize, page) {
            getSuscripcionesTodas();
        };

        $scope.getSuscripciones($scope.pagingOptionsActiva.pageSize, $scope.pagingOptionsActiva.currentPage);

        $scope.getSuscripciones($scope.pagingOptionsPasada.pageSize, $scope.pagingOptionsPasada.currentPage);

        $scope.$watch('pagingOptionsActiva', function(newVal, oldVal) {
            if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
                $scope.getSuscripciones($scope.pagingOptionsActiva.pageSize, $scope.pagingOptionsActiva.currentPage);
            }
        }, true);

        $scope.$watch('pagingOptionsPasada', function(newVal, oldVal) {
            if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
                $scope.getSuscripciones($scope.pagingOptionsPasada.pageSize, $scope.pagingOptionsPasada.currentPage);
            }
        }, true);

        $scope.detalles = function detalles(row) {
            $location.path("/detallesSuscripcion/" + row.entity.id + "/" + row.entity.suscriptor_oid);
        }

        $scope.accionesSuscripcionActiva = '<button type="button" class="btn miniButtons btn-xs btn-info" ng-click="detalles(row)">Detalles</button>';

        $scope.gridOptionsActiva = {
            data: 'myDataActiva',
            enablePaging: true,
            showFooter: true,
            totalServerItems: 'totalServerItemsActiva',
            pagingOptions: $scope.pagingOptionsActiva,
            enableSorting: false,
            enableRowSelection: false,
            i18n: 'es',
            columnDefs: [{
                field: 'suscriptor.nombre',
                displayName: 'Estudiante'
            }, {
                field: 'comp',
                displayName: 'Comp.'
            }, {
                field: 'oferta.fecha',
                displayName: 'Suscrito en',
                cellFilter: 'date:\'dd/MM/yyyy\''
            }, {
                displayName: 'Acciones',
                cellTemplate: $scope.accionesSuscripcionActiva
            }]
        };

        $scope.gridOptionsPasada = {
            data: 'myDataPasada',
            enablePaging: true,
            showFooter: true,
            totalServerItems: 'totalServerItemsPasada',
            pagingOptions: $scope.pagingOptionsPasada,
            enableSorting: false,
            enableRowSelection: false,
            i18n: 'es',
            columnDefs: [{
                field: 'suscriptor.nombre',
                displayName: 'Estudiante'
            }, {
                field: 'comp',
                displayName: 'Comp.'
            }, {
                field: 'oferta.fecha',
                displayName: 'Fecha',
                cellFilter: 'date:\'dd/MM/yyyy\''
            }, {
                field: 'estado',
                displayName: 'Decisión'
            }]
        };

        if (!appAuth.isLoggedIn()) {
            $location.path("/login");
        } else {
            getDatosOferta();
        }



    }
]);

myApp.controller('detalleSuscripcion', ['$scope', '$location', '$routeParams', 'Estudiante', 'Suscripcion', 'VectoresDeDatos', 'errorMessages', 'appAuth',
    function($scope, $location, $routeParams, Estudiante, Suscripcion, VectoresDeDatos, errorMessages, appAuth) {

        $scope.resolver = function(estado, estudiante) {
            Suscripcion.update({
                'id': $routeParams.idSuscripcion
            }, {
                'estado': estado
            }, function(data) {
                var msn = 'Suscripcion ' + estado + ' correctamente';
                if (estado == 'aceptada') {
                    msn += ' - ' + estudiante.nombre + ' - ' + estudiante.email;
                }
                errorMessages.setProperty({
                    'type': 'alert-success',
                    'msn': msn
                });
                $location.path("/misOfertas");
            })
        }


        $scope.conocimientos_tecnicos = {};
        $scope.idiomas = {};
        $scope.experiencia_laboral = {};

        if (!appAuth.isLoggedIn()) {
            $location.path("/login");
        } else {
            $scope.loading = true;
            Estudiante.query({
                'id': $routeParams.idEstudiante
            }, function(data) {
                $scope.estudiante = data;
                $scope.loading = false;

                if (data.busca_trabajo) {
                    $scope.estudiante.busca_empleo = "Busca empleo"
                } else {
                    $scope.estudiante.busca_empleo = "No busca empleo"
                }

                for (var i = 0; i < data.conocimientos_tecnicos.length; i++) {
                    $scope.conocimientos_tecnicos[data.conocimientos_tecnicos[i].conocimiento.conocimiento] = {
                        'conocimiento': data.conocimientos_tecnicos[i].conocimiento.conocimiento,
                        'nivel': data.conocimientos_tecnicos[i].nivel,
                        'resource_uri': data.conocimientos_tecnicos[i].conocimiento.resource_uri
                    };
                }

                for (var i = 0; i < data.idiomas.length; i++) {
                    $scope.idiomas[data.idiomas[i].idioma.idioma] = {
                        'idioma': data.idiomas[i].idioma.idioma,
                        'nivel': data.idiomas[i].nivel,
                        'resource_uri': data.idiomas[i].idioma.resource_uri
                    };
                }

                for (var i = 0; i < data.experiencia_laboral.length; i++) {
                    $scope.experiencia_laboral[data.experiencia_laboral[i].sector.sector] = {
                        'sector': data.experiencia_laboral[i].sector.sector,
                        'meses': data.experiencia_laboral[i].meses,
                        'resource_uri': data.experiencia_laboral[i].sector.resource_uri
                    };
                }
            });
        }

    }
]);


myApp.controller('modificarOferta', ['$scope', '$location', '$routeParams', 'OfertaDeEmpresa', 'OfertaDeProyectoEmprendedor', 'OfertaDeDepartamento', 'Especialidad', 'appAuth', 'BeneficiosLaborales', 'RequisitosIdioma', 'RequisitosExperienciaLaboral', 'RequisitosConocimientoTecnico', 'Idioma', 'SectorMercado', 'ConocimientoTecnico', 'VectoresDeDatos', 'errorMessages',
    function($scope, $location, $routeParams, OfertaDeEmpresa, OfertaDeProyectoEmprendedor, OfertaDeDepartamento, Especialidad, appAuth, BeneficiosLaborales, RequisitosIdioma, RequisitosExperienciaLaboral, RequisitosConocimientoTecnico, Idioma, SectorMercado, ConocimientoTecnico, VectoresDeDatos, errorMessages) {

        $scope.oferta = {};
        $scope.ct = {};
        $scope.idiomatoadd = {};
        $scope.experienciatoadd = {};
        $scope.requisitos_de_conocimiento_tecnico = {};
        $scope.requisitos_de_idioma = {};
        $scope.requisitos_de_experiencia = {};
        $scope.sectormercado = {};

        function getOfertaAModificar(service) {
            service.get({
                id: $routeParams.idOferta
            }, function(data) {
                $scope.oferta = data;
                $scope.checked_beneficios = [];
                var especialidades = [];
                for (var property in data.beneficios_laborales) {
                    if (data.beneficios_laborales.hasOwnProperty(property)) {
                        if (data.beneficios_laborales[property] === true) {
                            $scope.checked_beneficios.push(property);
                        }
                    }
                };

                for (var i = 0; i < data.especialidades.length; i++) {
                    especialidades.push(data.especialidades[i].resource_uri);
                };
                $scope.oferta.especialidades = especialidades;

                for (var i = 0; i < data.requisitos_de_conocimiento_tecnico.length; i++) {
                    $scope.requisitos_de_conocimiento_tecnico[data.requisitos_de_conocimiento_tecnico[i].conocimiento.conocimiento] = {
                        'conocimiento': data.requisitos_de_conocimiento_tecnico[i].conocimiento.conocimiento,
                        'nivel': data.requisitos_de_conocimiento_tecnico[i].nivel,
                        'resource_uri': data.requisitos_de_conocimiento_tecnico[i].conocimiento.resource_uri
                    };
                };

                for (var i = 0; i < data.requisitos_de_idioma.length; i++) {
                    $scope.requisitos_de_idioma[data.requisitos_de_idioma[i].idioma.idioma] = {
                        'idioma': data.requisitos_de_idioma[i].idioma.idioma,
                        'nivel': data.requisitos_de_idioma[i].nivel,
                        'resource_uri': data.requisitos_de_idioma[i].idioma.resource_uri
                    };
                };

                for (var i = 0; i < data.requisitos_de_experiencia_laboral.length; i++) {
                    $scope.requisitos_de_experiencia[data.requisitos_de_experiencia_laboral[i].sector.sector] = {
                        'sector': data.requisitos_de_experiencia_laboral[i].sector.sector,
                        'meses': data.requisitos_de_experiencia_laboral[i].meses,
                        'resource_uri': data.requisitos_de_experiencia_laboral[i].sector.resource_uri
                    };
                };
            })
        };

        if (!appAuth.isLoggedIn()) {
            $location.path("/login");
        } else {
            $scope.buttonText = "Modificar oferta";
            if ($scope.userCredentials.tipo == 'Profesor') {
                $scope.titulo = "Oferta de departamento";
                $scope.showTfg = false;
                $scope.showUltimoCurso = true;
                getOfertaAModificar(OfertaDeDepartamento);
            } else if ($scope.userCredentials.tipo == 'Estudiante') {
                $scope.titulo = "Oferta de proyecto emprendedor";
                $scope.showTfg = false;
                $scope.showUltimoCurso = false;
                getOfertaAModificar(OfertaDeProyectoEmprendedor);
            } else {
                $scope.titulo = "Oferta de empresa";
                $scope.showTfg = true;
                $scope.showUltimoCurso = true;
                getOfertaAModificar(OfertaDeEmpresa);
            };
        }

        function modificarOfertaGenerico(servicio, beneficios, oferta, requisitos) {
            var ofertaResourceUri = oferta.resource_uri;
            delete oferta.latitud;
            delete oferta.longitud;
            delete oferta.modificado_tras_una_congelacion;
            delete oferta.requisitos_de_conocimiento_tecnico;
            delete oferta.requisitos_de_experiencia_laboral;
            delete oferta.requisitos_de_idioma;
            delete oferta.resource_uri;
            delete oferta.suscripciones;
            delete oferta.tipo;
            delete oferta.usuario;
            delete oferta.$promise;
            delete oferta.$resolved;
            delete oferta.activa;
            delete oferta.beneficios_laborales;
            delete oferta.congelaciones;
            delete oferta.denuncias;
            delete oferta.esta_congelado;
            delete oferta.estado_de_la_suscripcion;
            delete oferta.fecha_de_creacion;
            delete oferta.fecha_de_eliminacion;
            delete oferta.fecha_de_ultima_modificacion;
            servicio.update({
                'id': oferta.id
            }, oferta, function() {
                BeneficiosLaborales.update(beneficios, function(data) {
                    for (var i = 0; i < requisitos.idiomas.delete.length; i++) {
                        RequisitosIdioma.delete({
                            'id': requisitos.idiomas.delete[i].id
                        });
                    };
                    for (var i = 0; i < requisitos.idiomas.add.length; i++) {
                        RequisitosIdioma.add({
                            'idioma': requisitos.idiomas.add[i].resource_uri,
                            'nivel': requisitos.idiomas.add[i].nivel,
                            'oferta': ofertaResourceUri
                        });
                    };

                    for (var i = 0; i < requisitos.experiencia.delete.length; i++) {
                        RequisitosExperienciaLaboral.delete({
                            'id': requisitos.experiencia.delete[i].id
                        });
                    };
                    for (var i = 0; i < requisitos.experiencia.add.length; i++) {
                        RequisitosExperienciaLaboral.add({
                            'sector': requisitos.experiencia.add[i].resource_uri,
                            'meses': requisitos.experiencia.add[i].meses,
                            'oferta': ofertaResourceUri
                        });
                    };

                    for (var i = 0; i < requisitos.conocimiento.delete.length; i++) {
                        RequisitosConocimientoTecnico.delete({
                            'id': requisitos.conocimiento.delete[i].id
                        });
                    };
                    for (var i = 0; i < requisitos.conocimiento.add.length; i++) {
                        RequisitosConocimientoTecnico.add({
                            'conocimiento': requisitos.conocimiento.add[i].resource_uri,
                            'nivel': requisitos.conocimiento.add[i].nivel,
                            'oferta': ofertaResourceUri
                        });
                    };

                    errorMessages.setProperty({
                        'type': 'alert-success',
                        'msn': 'Oferta modificada correctamente'
                    });
                    $location.path("/misOfertas");

                }, function() {
                    errorMessages.setProperty({
                        'type': 'alert-danger',
                        'msn': 'Error al modificar la oferta, intentelo de nuevo'
                    });
                })
            }, function() {
                errorMessages.setProperty({
                    'type': 'alert-danger',
                    'msn': 'Error al modificar la oferta, intentelo de nuevo'
                });
            });
        };

        /**
         * Crear oferta y editar los conocimientos tecnicos
         *
         **/
        $scope.crearOferta = function(oferta, beneficios) {
            var BeneficiostoAdd = {
                'id': oferta.beneficios_laborales.id
            };
            var reqIdiomatoAdd = [];
            var reqExptoAdd = [];
            var reqContoAdd = [];
            var requisitos = {};
            var reqIdiomatoDelete = oferta.requisitos_de_idioma;
            var reqContoDelete = oferta.requisitos_de_conocimiento_tecnico;
            var reqExptoDelete = oferta.requisitos_de_experiencia_laboral;

            for (var i = 0; i < beneficios.length; i++) {
                BeneficiostoAdd[beneficios[i]] = true;
            };

            for (var property in $scope.requisitos_de_idioma) {
                if ($scope.requisitos_de_idioma.hasOwnProperty(property)) {
                    reqIdiomatoAdd.push($scope.requisitos_de_idioma[property]);
                }
            };

            for (var property in $scope.requisitos_de_experiencia) {
                if ($scope.requisitos_de_experiencia.hasOwnProperty(property)) {
                    reqExptoAdd.push($scope.requisitos_de_experiencia[property]);
                }
            };

            for (var property in $scope.requisitos_de_conocimiento_tecnico) {
                if ($scope.requisitos_de_conocimiento_tecnico.hasOwnProperty(property)) {
                    reqContoAdd.push($scope.requisitos_de_conocimiento_tecnico[property]);
                }
            };
            requisitos['idiomas'] = {};
            requisitos['experiencia'] = {};
            requisitos['conocimiento'] = {}
            requisitos['idiomas']['delete'] = reqIdiomatoDelete;
            requisitos['idiomas']['add'] = reqIdiomatoAdd;
            requisitos['experiencia']['delete'] = reqExptoDelete;
            requisitos['experiencia']['add'] = reqExptoAdd;
            requisitos['conocimiento']['delete'] = reqContoDelete;
            requisitos['conocimiento']['add'] = reqContoAdd;

            if ($scope.userCredentials.tipo == 'Profesor') {
                modificarOfertaGenerico(OfertaDeDepartamento, BeneficiostoAdd, oferta, requisitos);
            } else if ($scope.userCredentials.tipo == 'Estudiante') {
                modificarOfertaGenerico(OfertaDeProyectoEmprendedor, BeneficiostoAdd, oferta, requisitos);
            } else {
                modificarOfertaGenerico(OfertaDeEmpresa, BeneficiostoAdd, oferta, requisitos);
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

        $scope.tipos_contrato = VectoresDeDatos.tiposDeContrato();
        $scope.tipos_jornada = VectoresDeDatos.tiposDeJornada();
        $scope.tipos_horario = VectoresDeDatos.tiposDeHorario();
        $scope.niveles_conocimiento = VectoresDeDatos.nivelesDeConocimiento();
        $scope.beneficiosLaborales = VectoresDeDatos.beneficiosLaborales();
        $scope.ultimoCurso = VectoresDeDatos.ultimo_curso_academico_superado();
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
        $scope.ct.nivel = $scope.niveles_conocimiento[0].id;
        $scope.idiomatoadd.nivel = $scope.niveles_conocimiento[0].id;

    }
]);

myApp.controller('perfilEmpresa', ['$scope', '$location', '$routeParams', 'Empresa', 'appAuth',
    function($scope, $location, $routeParams, Empresa, appAuth) {
        if (!appAuth.isLoggedIn()) {
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
        $scope.conocimientos_tecnicos = {};
        $scope.idiomas = {};
        $scope.experiencia_laboral = {};

        if (!appAuth.isLoggedIn()) {
            $location.path("/login");
        } else {
            $scope.loading = true;
            Estudiante.query({
                'id': $routeParams.id
            }, function(data) {
                $scope.estudiante = data;
                $scope.loading = false;

                if (data.busca_trabajo) {
                    $scope.estudiante.busca_empleo = "Busca empleo"
                } else {
                    $scope.estudiante.busca_empleo = "No busca empleo"
                }

                for (var i = 0; i < data.conocimientos_tecnicos.length; i++) {
                    $scope.conocimientos_tecnicos[data.conocimientos_tecnicos[i].conocimiento.conocimiento] = {
                        'conocimiento': data.conocimientos_tecnicos[i].conocimiento.conocimiento,
                        'nivel': data.conocimientos_tecnicos[i].nivel,
                        'resource_uri': data.conocimientos_tecnicos[i].conocimiento.resource_uri
                    };
                }

                for (var i = 0; i < data.idiomas.length; i++) {
                    $scope.idiomas[data.idiomas[i].idioma.idioma] = {
                        'idioma': data.idiomas[i].idioma.idioma,
                        'nivel': data.idiomas[i].nivel,
                        'resource_uri': data.idiomas[i].idioma.resource_uri
                    };
                }

                for (var i = 0; i < data.experiencia_laboral.length; i++) {
                    $scope.experiencia_laboral[data.experiencia_laboral[i].sector.sector] = {
                        'sector': data.experiencia_laboral[i].sector.sector,
                        'meses': data.experiencia_laboral[i].meses,
                        'resource_uri': data.experiencia_laboral[i].sector.resource_uri
                    };
                }
            });
        }
    }
]);

myApp.controller('denuncias', ['$scope', '$location', '$routeParams', 'appAuth', 'errorMessages',
    function($scope, $location, $routeParams, $modal, appAuth, errorMessages) {

        $scope.pagingDenuncias = {
            pageSizes: [10],
            pageSize: 10,
            currentPage: 1
        };
        $scope.accionesDenuncias = '<button type="button" class="btn miniButtons btn-xs btn-primary" ng-click="detalles(row)" >Detalles</button>';

        $scope.getTableStyle = function() {
            var rowHeight = 35;
            var headerHeight = 45;
            if ($scope.denunciasNoResueltas == undefined) {
                return "";
            } else {
                return {
                    height: (($scope.denunciasNoResueltas.length + 2) * rowHeight + headerHeight) + "px"
                };
            }
        };

        $scope.denunciasNoResueltas = [{
            titulo: "Software Solutions",
            numero: "5",
            tipo: "Perfil",
            primeraDenuncias: "22/05/2014"
        }, {
            titulo: "Experto en Marketing",
            numero: "2",
            tipo: "Oferta",
            primeraDenuncias: "10/24/2014"
        }, {
            titulo: "Diseñador gráfico",
            numero: "5",
            tipo: "Oferta",
            primeraDenuncias: "19/05/2014"
        }];
        $scope.totalDenuncasNoResueltas = 3;

        $scope.gridDenuncias = {
            data: 'denunciasNoResueltas',
            enablePaging: true,
            showFooter: true,
            totalServerItems: 'totalDenuncasNoResueltas',
            pagingOptions: $scope.pagingDenuncias,
            enableSorting: false,
            enableRowSelection: false,
            i18n: 'es',
            columnDefs: [{
                field: 'titulo',
                displayName: 'Titulo'
            }, {
                field: 'numero',
                displayName: 'Número denuncias'
            }, {
                field: 'tipo',
                displayName: 'Tipo'
            }, {
                field: 'primeraDenuncias',
                displayName: 'Fecha',
                cellFilter: 'date:\'dd/MM/yyyy\''
            }, {
                displayName: 'Acciones',
                cellTemplate: $scope.accionesDenuncias
            }]
        };

    }
]);


myApp.controller('misSuscripciones', ['$scope', '$location', '$routeParams', '$modal', 'Oferta', 'Suscripcion', 'appAuth', 'errorMessages',
    function($scope, $location, $routeParams, $modal, Oferta, Suscripcion, appAuth, errorMessages) {

        $scope.errorMessages = errorMessages.getProperty();
        errorMessages.setProperty({});

        function getSuscripcionesTodas() {
            $scope.loadingActivas = true;
            Suscripcion.queryAll({
                'limit': 500,
                'offset': 0
            }, function(data) {
                $scope.myDataActiva = [];
                $scope.myDataPasada = [];
                var numActivas = 0;
                var numPasadas = 0;
                for (var i = 0; i < data.objects.length; i++) {
                    if (data.objects[i].suscriptor_oid == $scope.userCredentials.id) {
                        if (data.objects[i].estado == 'pendiente') {
                            if ((numActivas >= (($scope.pagingOptionsActiva.currentPage - 1) * 10)) && (numActivas < ($scope.pagingOptionsActiva.currentPage * 10))) {
                                $scope.myDataActiva.push(data.objects[i]);
                            }
                            numActivas++;
                        } else {
                            if ((numPasadas >= (($scope.pagingOptionsPasada.currentPage - 1) * 10)) && (numPasadas < ($scope.pagingOptionsPasada.currentPage * 10))) {
                                $scope.myDataPasada.push(data.objects[i]);
                            }
                            numPasadas++;
                        }
                    }
                }
                $scope.setPagingDataActiva(numActivas);
                $scope.setPagingDataPasada(numPasadas);
                $scope.loadingActivas = false;
                $(window).resize();
            });
        }

        $scope.totalServerItemsActiva = 0;
        $scope.totalServerItemsPasada = 0;
        $scope.pagingOptionsActiva = {
            pageSizes: [10],
            pageSize: 10,
            currentPage: 1
        };
        $scope.pagingOptionsPasada = {
            pageSizes: [10],
            pageSize: 10,
            currentPage: 1
        };

        $scope.getTableStyleActiva = function() {
            var rowHeight = 35;
            var headerHeight = 45;
            if ($scope.myDataActiva == undefined) {
                return "";
            } else {
                return {
                    height: (($scope.myDataActiva.length + 2) * rowHeight + headerHeight) + "px"
                };
            }
        };

        $scope.getTableStylePasada = function() {
            var rowHeight = 35;
            var headerHeight = 45;
            if ($scope.myDataPasada == undefined) {
                return "";
            } else {
                return {
                    height: (($scope.myDataPasada.length + 2) * rowHeight + headerHeight) + "px"
                };
            }
        };

        $scope.setPagingDataActiva = function(total) {
            $scope.totalServerItemsActiva = total;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        };

        $scope.setPagingDataPasada = function(total) {
            $scope.totalServerItemsPasada = total;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        };

        $scope.getSuscripciones = function() {
            getSuscripcionesTodas();
        };

        $scope.getSuscripciones();

        $scope.$watch('pagingOptionsActiva', function(newVal, oldVal) {
            if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
                $scope.getSuscripciones();
            }
        }, true);

        $scope.$watch('pagingOptionsPasada', function(newVal, oldVal) {
            if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
                $scope.getSuscripciones();
            }
        }, true);

        $scope.anular = function anular(row) {
            Oferta.dessuscribirse({
                'id': row.entity.modelo_oid
            }, function() {
                $scope.getSuscripciones();
            })

        }

        $scope.accionesSuscripcionActiva = '<button type="button" class="btn miniButtons btn-xs btn-info" ng-click="anular(row)">Anular</button>';

        $scope.gridOptionsActiva = {
            data: 'myDataActiva',
            enablePaging: true,
            showFooter: true,
            totalServerItems: 'totalServerItemsActiva',
            pagingOptions: $scope.pagingOptionsActiva,
            enableSorting: false,
            enableRowSelection: false,
            i18n: 'es',
            columnDefs: [{
                field: 'oferta.titulo',
                displayName: 'Oferta'
            }, {
                field: 'oferta.usuario',
                displayName: 'Autor'
            }, {
                field: 'oferta.fecha',
                displayName: 'Alta oferta',
                cellFilter: 'date:\'dd/MM/yyyy\''
            }, {
                field: 'fecha',
                displayName: 'Suscrito en',
                cellFilter: 'date:\'dd/MM/yyyy\''
            }, {
                displayName: 'Acciones',
                cellTemplate: $scope.accionesSuscripcionActiva
            }]
        };

        $scope.gridOptionsPasada = {
            data: 'myDataPasada',
            enablePaging: true,
            showFooter: true,
            totalServerItems: 'totalServerItemsPasada',
            pagingOptions: $scope.pagingOptionsPasada,
            enableSorting: false,
            enableRowSelection: false,
            i18n: 'es',
            columnDefs: [{
                field: 'oferta.titulo',
                displayName: 'Oferta'
            }, {
                field: 'oferta.usuario',
                displayName: 'Autor'
            }, {
                field: 'oferta.fecha',
                displayName: 'Alta oferta',
                cellFilter: 'date:\'dd/MM/yyyy\''
            }, {
                field: 'fecha',
                displayName: 'Suscrito en',
                cellFilter: 'date:\'dd/MM/yyyy\''
            }, {
                field: 'estado',
                displayName: 'Decisión'
            }]
        };

        if (!appAuth.isLoggedIn()) {
            $location.path("/login");
        }
    }
]);

myApp.controller('home', ['$scope', '$location', 'appAuth', 'errorMessages',
    function($scope, $location, appAuth, errorMessages) {
        if (!appAuth.isLoggedIn()) {
            $location.path("/login");
        } else {
            $scope.errorMessages = errorMessages.getProperty();
            errorMessages.setProperty({});
        }
    }
]);