angular.module("_factories_", [])


/**
 * [Setea la variable rootImg en el entorno del Colorama]
 * @param  {[objeto]} $rootScope [contiene todo el entorno de angularjs]
 * @return {[objeto]}            [devuelve la informacion del objeto "imagen en base64"]
 */
.factory("enviarImg", function($rootScope) {
     var imagenInfo = {};

     imagenInfo.pasar = function(info) {
        $rootScope.rootImg = info;
     }

     return imagenInfo;
});