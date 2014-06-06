/**
 * [_colorama_ Variable que contiene la inicialización de la aplicación]
 * @type {[objeto]}
 */
(function() {
     var _colorama_ = angular.module("App", [
          "colorpicker.module", 
          "ngRoute", 
          "ngSanitize", 
          "localytics.directives",
          "angularBootstrapNavTree",
          "_controllers_",
          "_directives_",
          "_factories_"
     ]);


     /**
      * [Estable los dummys para la aplicación]
      * @param  {[objeto]} $routeProvider [objeto con todas las rutas]
      * @return {[html]}                [devuelve la vista y el controlador a cargar]
      */
     _colorama_.config(["$routeProvider", function($routeProvider) {
          $routeProvider
          .when("/:pais",
               {
                    templateUrl: function($routeParams) {
                         return "ngviews/" + $routeParams.pais + ".html";
                    }
               }
          )        
          .otherwise(
               {
                    templateUrl: "ngviews/espana.html",
               }
          );
     }]);
})();