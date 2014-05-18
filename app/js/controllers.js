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

myApp.controller('menuController', ['$scope', '$rootScope', '$location',
    function($scope, $rootScope, $location) {
        $scope.isActive = function(viewLocation) {
            return viewLocation === $location.path();
        };
    }
]);

myApp.controller('publicarOferta', ['$scope', '$location', 'OfertaDeEmpresa', 'OfertaDeProyectoEmprendedor', 'OfertaDeDepartamento', 'Especialidad', 'appAuth', 'BeneficiosLaborales', 'RequisitosIdioma', 'RequisitosExperienciaLaboral', 'RequisitosConocimientoTecnico', 'Idioma', 'SectorMercado', 'ConocimientoTecnico', 'VectoresDeDatos',
    function($scope, $location, OfertaDeEmpresa, OfertaDeProyectoEmprendedor, OfertaDeDepartamento, Especialidad, appAuth, BeneficiosLaborales, RequisitosIdioma, RequisitosExperienciaLaboral, RequisitosConocimientoTecnico, Idioma, SectorMercado, ConocimientoTecnico, VectoresDeDatos) {

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
            };
        }

        $scope.isUnchanged = function(user) {
            return angular.equals(user, $scope.master);
        };

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
            console.log($scope.requisitos_de_idioma);
            console.log(oferta.especialidades);
            console.log($scope.requisitos_de_experiencia);
            console.log($scope.requisitos_de_conocimiento_tecnico);
            console.log(asdasd);
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
        $scope.ultimo_curso_academico_superado = VectoresDeDatos.ultimo_curso_academico_superado();
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
        $scope.oferta.ultimo_curso_academico_superado = $scope.ultimo_curso_academico_superado[4].id;

    }
]);

myApp.controller('detallesOferta', ['$scope', '$location', '$routeParams', 'OfertaDeEmpresa', 'OfertaDeProyectoEmprendedor', 'OfertaDeDepartamento', 'ConocimientoTecnico', 'appAuth', 'VectoresDeDatos',

    function($scope, $location, $routeParams, OfertaDeEmpresa, OfertaDeProyectoEmprendedor, OfertaDeDepartamento, Conocimiento, appAuth, VectoresDeDatos) {

        var beneficiosLaboralesText = VectoresDeDatos.beneficiosLaboralesText();
        var ultimocursoText = VectoresDeDatos.ultimo_curso_academico_superado_key();

        $scope.getBeneficioText = function(key) {
            return beneficiosLaboralesText[key];
        };

        $scope.getUltimoCursoKey = function(key) {
            return ultimocursoText[key];
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

myApp.controller('misOfertas', ['$scope', '$location', '$routeParams', '$modal', 'OfertaDeEmpresa', 'OfertaDeProyectoEmprendedor', 'OfertaDeDepartamento', 'appAuth',
    function($scope, $location, $routeParams, $modal, OfertaDeEmpresa, OfertaDeProyectoEmprendedor, OfertaDeDepartamento, appAuth) {

        function eliminarGen(servicio, id, motivo) {
            servicio.eliminar({
                'id': id
            }, {
                'motivo': motivo
            });
        }

        function eliminar(id, motivo) {
            if ($scope.userCredentials.tipo == 'Profesor') {
                eliminarGen(OfertaDeDepartamento, id, motivo);
            } else if ($scope.userCredentials.tipo == 'Estudiante') {
                eliminarGen(OfertaDeProyectoEmprendedor, id, motivo);
            } else {
                eliminarGen(OfertaDeEmpresa, id, motivo);
            };
        }

        $scope.open = function(id) {
            $scope.motivo = "";
            var modalInstance = $modal.open({
                templateUrl: 'partials/modals/eliminarOfertaModalConfirmation.html',
                controller: 'ModalInstanceCtrl'
            });
            modalInstance.result.then(function(result) {
                console.log("Intentando eliminar oferta " + id + " motivo: " + result);
                //eliminar(id.entity.id, result);
            }, function(result) {
                console.log(result);
            });

        };

        function getOfertasActivas(limit, offset) {
            var servicio;
            if ($scope.userCredentials.tipo == 'Profesor') {
                servicio = OfertaDeDepartamento;
            } else if ($scope.userCredentials.tipo == 'Estudiante') {
                servicio = OfertaDeProyectoEmprendedor;
            } else {
                servicio = OfertaDeEmpresa;
            };
            servicio.queryAll({
                'usuario__id': $scope.userCredentials.id,
                'limit': limit,
                'offset': offset
                /*, 'activa': true*/
            }, function(data) {
                $scope.setPagingDataActiva(data.objects, data.meta.total_count);
                $scope.ofertasActivas = data.objects;
            });
        };

        function getOfertasPasadas(limit, offset) {
            var servicio;
            if ($scope.userCredentials.tipo == 'Profesor') {
                servicio = OfertaDeDepartamento;
            } else if ($scope.userCredentials.tipo == 'Estudiante') {
                servicio = OfertaDeProyectoEmprendedor;
            } else {
                servicio = OfertaDeEmpresa;
            };
            servicio.queryAll({
                'usuario__id': $scope.userCredentials.id,
                'limit': limit,
                'offset': offset
                /*, 'activa': false*/
            }, function(data) {
                $scope.setPagingDataPasada(data.objects, data.meta.total_count);
                $scope.ofertasPasadas = data.objects;
            });
        };

        $scope.totalServerItemsActiva = 0;
        $scope.totalServerItemsPasada = 0;
        $scope.pagingOptionsActiva = {
            pageSizes: [20],
            pageSize: 20,
            currentPage: 1
        };
        $scope.pagingOptionsPasada = {
            pageSizes: [20],
            pageSize: 20,
            currentPage: 1
        };

        $scope.getTableStyleActiva = function() {
            var rowHeight = 30;
            var headerHeight = 45;
            if ($scope.myDataActiva == undefined) {
                return "";
            } else {
                return {
                    height: (($scope.myDataActiva.length) * rowHeight + headerHeight) + "px"
                };
            }
        };

        $scope.getTableStylePasada = function() {
            var rowHeight = 30;
            var headerHeight = 45;
            if ($scope.myDataPasada == undefined) {
                return "";
            } else {
                return {
                    height: (($scope.myDataPasada.length) * rowHeight + headerHeight) + "px"
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

        $scope.accionesOfertasActiva = '<button type="button" class="btn" ng-click="versuscripciones(row)" >Suscripciones</button><button type="button" class="btn" ng-click="modificar(row)" >Mod</button><button type="button" class="btn" ng-click="open(row)">Eliminar</button>';

        $scope.accionesOfertasPasada = '<button type="button" class="btn" ng-click="modificar(row)" >Mod</button><button type="button" class="btn" ng-click="restablecer(row)">Restablecer</button>';

        $scope.modificar = function modificar(row) {
            $location.path(/modificarOferta/ + row.entity.id);
        };

        $scope.restablecer = function restablecer(row) {
            console.log(restablecer)
            $scope.getPagedDataAsyncPasada($scope.pagingOptionsPasada.pageSize, $scope.pagingOptionsPasada.currentPage);
        }

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
                field: 'titulo',
                displayName: 'Titulo'
            }, {
                field: 'fecha_de_creacion',
                displayName: 'Fecha Alta',
                cellFilter: 'date:\'dd/MM/yyyy\'',
            }, {
                displayName: 'Acciones',
                cellTemplate: $scope.accionesOfertasActiva
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
                field: 'titulo',
                displayName: 'Titulo'
            }, {
                field: 'fecha_de_creacion',
                displayName: 'Alta oferta',
                cellFilter: 'date:\'dd/MM/yyyy\'',
            }, {
                field: 'fecha_de_eliminacion',
                displayName: 'Baja Oferta',
                cellFilter: 'date:\'dd/MM/yyyy\'',
            }, {
                field: 'motivo',
                displayName: 'Motivo'
            }, {
                displayName: 'Acciones',
                cellTemplate: $scope.accionesOfertasPasada
            }]
        };

        if (!appAuth.isLoggedIn()) {
            appAuth.saveAttemptUrl();
            $location.path("/login");
        }
    }
]);

myApp.controller('modificarOferta', ['$scope', '$location', '$routeParams', 'OfertaDeEmpresa', 'OfertaDeProyectoEmprendedor', 'OfertaDeDepartamento', 'Especialidad', 'appAuth', 'BeneficiosLaborales', 'RequisitosIdioma', 'RequisitosExperienciaLaboral', 'RequisitosConocimientoTecnico', 'Idioma', 'SectorMercado', 'ConocimientoTecnico', 'VectoresDeDatos',
    function($scope, $location, $routeParams, OfertaDeEmpresa, OfertaDeProyectoEmprendedor, OfertaDeDepartamento, Especialidad, appAuth, BeneficiosLaborales, RequisitosIdioma, RequisitosExperienciaLaboral, RequisitosConocimientoTecnico, Idioma, SectorMercado, ConocimientoTecnico, VectoresDeDatos) {

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
            appAuth.saveAttemptUrl();
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
            delete oferta.latitud;
            delete oferta.langitud;
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

            console.log("Oferta a modificar");
            console.log("--------------OFERTA--------------");
            console.log(oferta);
            servicio.update({
                'id': 1
            }, oferta, function() {
                console.log("oferta modificada correctamente")
                $location.path("/misOfertas");
            });
            console.log("------------BENEFICIOS------------");
            console.log(beneficios);
            console.log("------------REQUISITOS------------");
            console.log(requisitos);
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
            /*
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
*/
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