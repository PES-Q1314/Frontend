'use strict';

/* Services */
var apiService = angular.module('apiService', ['ngResource']);

//var urlServicio = 'http://nameless-fjord-3849.herokuapp.com/api/';
var urlServicio = 'http://bolsa-de-empleo-upc.herokuapp.com/api/';

apiService.factory('appAuth', function($rootScope, $location, $cookieStore, authlogin, redirectToUrlAfterLogin) {
    return {
        login: function(credentials) {
            return authlogin.login(credentials);
        },
        isLoggedIn: function() {
            return !!$cookieStore.get('login'); //convert value to bool
        },
        saveAttemptUrl: function() {
            console.log("saveAttempt");
            if ($location.path().toLowerCase() != '/login') {
                redirectToUrlAfterLogin.url = $location.path();
            } else
                redirectToUrlAfterLogin.url = '/';
        },
        redirectToAttemptedUrl: function() {
            console.log("Redirect");
            console.log(redirectToUrlAfterLogin.url);
            $location.path(redirectToUrlAfterLogin.url);
        }
    };
});

apiService.factory('authlogin', ['$resource',
    function($resource) {
        return $resource(urlServicio + 'systemuser/:action', {}, {
            login: {
                method: 'POST',
                params: {
                    action: 'login'
                }
            },
            logout: {
                method: 'POST',
                params: {
                    action: 'logout'
                }
            }
        })
    }
]);

apiService.factory('Oferta', ['$resource',
    function($resource) {
        return $resource(urlServicio + 'oferta/:id', {}, {
            queryAll: {
                method: 'GET',
                params: {
                    id: ''
                },
                isArray: false
            },
            query: {
                method: 'GET',
                params: {
                    id: '@id'
                },
                isArray: false
            }
        })
    }
]);

apiService.factory('OfertaDeEmpresa', ['$resource',
    function($resource) {
        return $resource(urlServicio + 'ofertadeempresa/:id/:action', {}, {
            queryAll: {
                method: 'GET',
                params: {
                    id: ''
                },
                isArray: false
            },
            query: {
                method: 'GET',
                params: {
                    id: '@id'
                },
                isArray: false
            },
            addNew: {
                method: 'POST',
                params: {
                    id: '@id'
                }
            },
            update: {
                method: 'PUT',
                params: {
                    id: '@id'
                }
            },
            eliminar: {
                method: 'POST',
                params: {
                    id: '@id',
                    action: 'eliminar'
                }
            }
        })
    }
]);

apiService.factory('OfertaDeDepartamento', ['$resource',
    function($resource) {
        return $resource(urlServicio + 'ofertadedepartamento/:id', {}, {
            query: {
                method: 'GET',
                params: {
                    id: '@id'
                },
                isArray: false
            },
            queryAll: {
                method: 'GET',
                params: {
                    id: ''
                },
                isArray: false
            },
            addNew: {
                method: 'POST',
                params: {
                    id: ''
                }
            }
        })
    }
]);

apiService.factory('OfertaDeProyectoEmprendedor', ['$resource',
    function($resource) {
        return $resource(urlServicio + 'ofertadeproyectoemprendedor/:id', {}, {
            queryAll: {
                method: 'GET',
                params: {
                    id: ''
                },
                isArray: false
            },
            query: {
                method: 'GET',
                params: {
                    id: '@id'
                },
                isArray: false
            },
            addNew: {
                method: 'POST',
                params: {
                    id: ''
                }
            }
        })
    }
]);

apiService.factory('Empresa', ['$resource',
    function($resource) {
        return $resource(urlServicio + 'empresa/:id', {}, {
            queryAll: {
                method: 'GET',
                params: {
                    id: ''
                },
                isArray: false
            },
            query: {
                method: 'GET',
                params: {
                    id: '@id'
                },
                isArray: false
            }
        })
    }
]);

apiService.factory('Estudiante', ['$resource',
    function($resource) {
        return $resource(urlServicio + 'estudiante/:id', {}, {
            queryAll: {
                method: 'GET',
                params: {
                    id: ''
                },
                isArray: false
            },
            query: {
                method: 'GET',
                params: {
                    id: '@id'
                },
                isArray: false
            }
        })
    }
]);

apiService.factory('Profesor', ['$resource',
    function($resource) {
        return $resource(urlServicio + 'profesor/:id', {}, {
            queryAll: {
                method: 'GET',
                params: {
                    id: ''
                },
                isArray: false
            },
            query: {
                method: 'GET',
                params: {
                    id: '@id'
                },
                isArray: false
            }
        })
    }
]);

apiService.factory('Especialidad', ['$resource',
    function($resource) {
        return $resource(urlServicio + 'especialidad/:id', {}, {
            queryAll: {
                method: 'GET',
                params: {
                    id: ''
                },
                isArray: false
            },
            query: {
                method: 'GET',
                params: {
                    id: '@id'
                },
                isArray: false
            }
        })
    }
]);

apiService.factory('ConocimientoTecnico', ['$resource',
    function($resource) {
        return $resource(urlServicio + 'conocimientotecnico/:id', {}, {
            query: {
                method: 'GET',
                params: {
                    id: '@id'
                },
                isArray: false
            },
            queryAll: {
                method: 'GET',
                params: {
                    id: ''
                },
                isArray: false
            },
            add: {
                method: 'POST',
                params: {
                    id: ''
                }
            }
        })
    }
]);

apiService.factory('SectorMercado', ['$resource',
    function($resource) {
        return $resource(urlServicio + 'sectordelmercado/:id', {}, {
            query: {
                method: 'GET',
                params: {
                    id: '@id'
                },
                isArray: false
            },
            queryAll: {
                method: 'GET',
                params: {
                    id: ''
                },
                isArray: false
            },
            add: {
                method: 'POST',
                params: {
                    id: ''
                }
            }
        })
    }
]);

apiService.factory('Idioma', ['$resource',
    function($resource) {
        return $resource(urlServicio + 'idioma/:id', {}, {
            query: {
                method: 'GET',
                params: {
                    id: '@id'
                },
                isArray: false
            },
            queryAll: {
                method: 'GET',
                params: {
                    id: ''
                },
                isArray: false
            },
            add: {
                method: 'POST',
                params: {
                    id: ''
                }
            }
        })
    }
]);

apiService.factory('BeneficiosLaborales', ['$resource',
    function($resource) {
        return $resource(urlServicio + 'beneficioslaborales/:id', {}, {
            queryAll: {
                method: 'GET',
                params: {
                    id: ''
                },
                isArray: false
            },
            query: {
                method: 'GET',
                params: {
                    id: '@id'
                },
                isArray: false
            },
            edit: {
                method: 'PATCH',
                params: {
                    id: '@id'
                }
            },
            update: {
                method: 'PUT',
                params: {
                    id: '@id'
                }
            }
        })
    }
]);

apiService.factory('RequisitosIdioma', ['$resource',
    function($resource) {
        return $resource(urlServicio + 'requisitodeidioma/:id', {}, {
            queryAll: {
                method: 'GET',
                params: {
                    id: ''
                },
                isArray: false
            },
            query: {
                method: 'GET',
                params: {
                    id: '@id'
                },
                isArray: false
            },
            add: {
                method: 'POST',
                params: {
                    id: ''
                }
            },
            delete: {
                method: 'DELETE',
                params: {
                    id: '@id'
                }
            }
        })
    }
]);

apiService.factory('RequisitosExperienciaLaboral', ['$resource',
    function($resource) {
        return $resource(urlServicio + 'requisitodeexperiencialaboral/:id', {}, {
            queryAll: {
                method: 'GET',
                params: {
                    id: ''
                },
                isArray: false
            },
            query: {
                method: 'GET',
                params: {
                    id: '@id'
                },
                isArray: false
            },
            add: {
                method: 'POST',
                params: {
                    id: ''
                }
            }
        })
    }
]);

apiService.factory('RequisitosConocimientoTecnico', ['$resource',
    function($resource) {
        return $resource(urlServicio + 'requisitodeconocimientotecnico/:id', {}, {
            queryAll: {
                method: 'GET',
                params: {
                    id: ''
                },
                isArray: false
            },
            query: {
                method: 'GET',
                params: {
                    id: '@id'
                },
                isArray: false
            },
            add: {
                method: 'POST',
                params: {
                    id: ''
                }
            }
        })
    }
]);


apiService.factory('VectoresDeDatos', function() {
    return {
        tiposDeJornada: function() {
            return [{
                id: 'parcial',
                name: 'Parcial'
            }, {
                id: 'completa',
                name: 'Completa'
            }];
        },
        tiposDeContrato: function() {
            return [{
                id: 'practicas',
                name: 'Prácticas'
            }, {
                id: 'indefinido',
                name: 'Indefinido'
            }, {
                id: 'temporal',
                name: 'Temporal'
            }];
        },
        tiposDeHorario: function() {
            return [{
                id: 'manyana',
                name: 'Mañana'
            }, {
                id: 'tarde',
                name: 'Tarde'
            }, {
                id: 'total',
                name: 'Indiferente'
            }];
        },
        nivelesDeConocimiento: function() {
            return [{
                id: 'medio',
                name: 'Medio'
            }, {
                id: 'avanzado',
                name: 'Avanzado'
            }, {
                id: 'experto',
                name: 'Experto'
            }];
        },
        beneficiosLaborales: function() {
            return [{
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
        },
        tiposDeOferta: function() {
            return [{
                name: 'Todas'
            }, {
                name: 'Empresa'
            }, {
                name: 'Departamento'
            }, {
                name: 'Colaboración'
            }];
        },
        beneficiosLaboralesText: function() {
            return {
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
        },
        ultimo_curso_academico_superado: function() {
            return [{
                id: 1,
                name: 'Primero'
            }, {
                id: 2,
                name: 'Segundo'
            }, {
                id: 3,
                name: 'Tercero'
            }, {
                id: 4,
                name: 'Cuarto'
            }, {
                id: 5,
                name: 'Último'
            }];
        },
        ultimo_curso_academico_superado_key: function() {
            return {
                '1': 'Primero',
                '2': 'Segundo',
                '3': 'Tercero',
                '4': 'Cuarto',
                '5': 'Último'
            };
        }
    }
});

apiService.service('errorMessages', function() {
    var error = {};

    return {
        getProperty: function() {
            return error;
        },
        setProperty: function(value) {
            error = value;
        }
    };
});