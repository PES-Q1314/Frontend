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
            if ($location.path().toLowerCase() != '/login') {
                redirectToUrlAfterLogin.url = $location.path();
            } else
                redirectToUrlAfterLogin.url = '/';
        },
        redirectToAttemptedUrl: function() {
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
        return $resource(urlServicio + 'ofertadeempresa/:id', {}, {
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
            add: {
                method: 'POST',
                params: {
                    id: ''
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