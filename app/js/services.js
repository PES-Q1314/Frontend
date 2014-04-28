'use strict';

/* Services */
var apiService = angular.module('apiService', ['ngResource']);

//var urlServicio = 'http://nameless-fjord-3849.herokuapp.com/api/';
var urlServicio = 'http://bolsa-de-empleo-upc.herokuapp.com/api/';

apiService.factory('authlogin', ['$resource', '$cookies',
    function($resource, $cookies) {
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

apiService.factory('Conocimiento', ['$resource',
    function($resource) {
        return $resource('http://bolsa-de-empleo-upc.herokuapp.com/api/conocimientotecnico/:id', {}, {
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