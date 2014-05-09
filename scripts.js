/**
 * [_colorama_ Variable que contiene la inicialización de la aplicación]
 * @type {[objeto]}
 */
(function() {
     var ok = "#f2ffff";
     var ko = "#ffe3e3";
     var _numerico_ = /^[0-9]+$/;
     var _alfanumericos_ = /^([A-Za-z0-9\_]{3,})+$/;
     var _hexadecimal_ = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;          
     var _base64_ = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
     var _colorama_ = angular.module("App", [
          "colorpicker.module", 
          "ngRoute", 
          "ngSanitize", 
          "localytics.directives"
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

   
     /**
      * [Setea la variable rootImg en el entorno del Colorama]
      * @param  {[objeto]} $rootScope [contiene todo el entorno de angularjs]
      * @return {[objeto]}            [devuelve la informacion del objeto "imagen en base64"]
      */
     _colorama_.factory("enviarImg", function($rootScope) {
          var imagenInfo = {};

          imagenInfo.pasar = function(info) {
               $rootScope.rootImg = info;
          }
          
          return imagenInfo;
     });


     /**
      * [Validación de colores hexadecimales ej: #000000]
      * @return {[string | false]} [dependiendo de la validación]
      */
     _colorama_.directive("hexadecimal", function() {
          return {
               require: "ngModel",

               link: function(scope, elm, attrs, ctrl) {
                    ctrl.$parsers.unshift(function(viewValue) {
                         if (_hexadecimal_.test(viewValue)) {
                              ctrl.$setValidity("hexadecimal", true);
                              elm.css("background", ok);
                              
                              return viewValue;
                         } else {
                              ctrl.$setValidity("hexadecimal", false);
                              elm.css("background", ko);
                              
                              return undefined;
                         }
                    });
               }
          };
     });


     /**
      * [Validación de entrada de solo números]
      * @return {[int | false]} [dependiendo de la validación]
      */
     _colorama_.directive("numerico", function() {
          return {
               require: "ngModel",

               link: function(scope, elm, attrs, ctrl) {
                    ctrl.$parsers.unshift(function(viewValue) {
                         if (_numerico_.test(viewValue)) {
                              ctrl.$setValidity("numerico", true);
                              elm.css("background", ok);
                              
                              return viewValue;
                         } else {
                              ctrl.$setValidity("numerico", false);
                              elm.css("background", ko);
                              
                              return undefined;
                         }
                    });
               }
          };
     });


     /**
      * [Validacion de caracteres alfanúmericos]
      * @return {[string | false]} [dependiendo de la validación]
      */
     _colorama_.directive("alfanumericos", function() {
          return {
               require: "ngModel",

               link: function(scope, elm, attrs, ctrl) {
                    ctrl.$parsers.unshift(function(viewValue) {
                         if (_alfanumericos_.test(viewValue)) {
                              ctrl.$setValidity("hexadecimal", true);
                              elm.css("background", ok);
                              
                              return viewValue;
                         } else {
                              ctrl.$setValidity("hexadecimal", false);
                              elm.css("background", ko);
                              
                              return undefined;
                         }
                    });
               }
          };
     });


     /**
      * [Directiva para entireactuar con el alert de confirm para borrar una landing]
      * @return {[null]}
      */
     _colorama_.directive("ngConfirmClick", function() {
          return {
               link: function (scope, element, attr) {
                    var msg = "Estas seguro de borrar el skin: " + scope.Mcolorama.dummynombre_null + "?";
                    var clickAction = attr.confirmedClick;
                    
                    element.bind("click",function (event) {
                         if(window.confirm(msg)) {
                              scope.$eval(clickAction);
                         }
                    });
               }
          };
     });


     /**
      * [Drag and drop de archivos de tipo imagen que serán codificado en base64]
      * @param  {[objeto]} enviarImg [con la informacion del de la imagen en base64]
      * @return {[string]}           [string de la imgen en base64]
      */
     _colorama_.directive("soltarArchivos", function(enviarImg) {
          return {
               restrict: "AE",
               scope: {},

               link: function(scope, element, attrs) {
                    var esValida;
                    var procesarDD;
                    var TMPlistado = new Array();
                    var extesionesValidas = attrs.soltarArchivos;
                    
                    procesarDD = function(e) {
                         e.preventDefault();
                         // e.dataTransfer.effectAllowed = "copy";
                         e.originalEvent.dataTransfer.effectAllowed = "copy";

                         return false;
                    }

                    esValida = function(extesiones) {
                         if(extesionesValidas.indexOf(extesiones) > -1) {
                              return true;
                         } else {
                              alert("Tipo de archivo incorrecto son solo válidos los siguientes:" + extesionesValidas);
                              
                              return false;
                         }
                    };

                    element.on("dragover", procesarDD);
                    element.on("dragenter", procesarDD);

                    return element.bind("drop", function(e) {
                         var archivo;
                         var nombre
                         var lector;
                         var tamano
                         var tipo;
                         var info;
                         
                         e.preventDefault();

                         lector = new FileReader();
                         lector.onload = function(evt) {
                              if(esValida(tipo)) {
                                   return scope.$apply(function() {
                                        scope.archivo = evt.target.result;
                                        TMPlistado[0] = (evt.target.result);
                                        scope.listado = TMPlistado;
                                        enviarImg.pasar(scope.archivo, nombre);
                                   });
                              }
                         };

                         archivo = e.originalEvent.dataTransfer.files[0];
                         nombre = archivo.name;
                         tipo = archivo.type;
                         tamano = archivo.size;
                         lector.readAsDataURL(archivo);
                    });
               }
          };
     });     
})();


/**
 * [mainController controlador general de la aplicación]
 * @return {[null]} 
 */
var mainController = function($rootScope, $scope, $window, $http, $routeParams, $location, $sce, $compile) {
     $scope.permitidoBorrar = false;
     $scope.menudesplegado = false;
     $scope.pais = "espana";
     $scope.Skins = [];
     $rootScope.listo = false;
     $scope.Mcolorama = {};
     $scope.portalDuplicar = {};
     $scope.portalBorrar = {};
     $scope.envioDatos = true;
     $rootScope.rootImg = null;
     $scope.Portales = $window.Portales;
     $scope.AllSkins = $window.AllSkins["objetos"];
     $scope.BucketLlenos = $window.BucketsConContenido["full"];
     $scope.BucketVacios = $window.BucketsConContenido["empty"];     
     $scope.cartasPago = [
          {
               nombre: "España",
               vista: "espana"
          },
          {
               nombre: "Italia",
               vista: "italia"
          }
     ];

     $scope.cartaPago = $scope.cartasPago[0];

     $rootScope.$watch(function() {
          $scope.Mcolorama.dummyimg_backgroundimageanimated = $rootScope.rootName;
          $scope.Mcolorama.dummyimg_backgroundimage = $rootScope.rootImg;
     });
  

     /**
      * [borrarSkin Función que nos permite borrar Skins que no se necesite]
      * @return {[null]}
      */
     $scope.borrarSkin = function() {
          $rootScope.listo = true;

          $http.post("json.php", {
               portal_id: $scope.Mcolorama.dummy_portal,
               skin_name: $scope.Mcolorama.dummynombre_null,
               accion: "borrar"
          })
          .success(function(data, status, headers, config) {
               if(data) {
                    alert("Se ha borrado el SKIN: " + $scope.Mcolorama.dummynombre_null);

                    angular.forEach($scope.Skins, function(value, key) {
                         if(value == $scope.Mcolorama.dummy_portal + " - " + $scope.Mcolorama.dummynombre_null + ".js") {
                              console.log(key);
                              $scope.Skins.splice(key, 1);
                         }
                    });

                    angular.forEach($scope.AllSkins, function(value, key) {
                         if(value == $scope.Mcolorama.dummy_portal + " - " + $scope.Mcolorama.dummynombre_null + ".js") {
                              console.log(key);
                              $scope.AllSkins.splice(key, 1);
                         }
                    });
                   
                    $scope.Mcolorama = {};
                    $scope.Mcolorama.dummyimg_backgroundimage = "";
                    $rootScope.rootImg = "";

                    $rootScope.listo = false;
                    $scope.permitidoBorrar = false;
               }
          })
          .error(function(data, status, headers, config) {
               $scope.permitidoBorrar = false;
               try{console.log("ERROR:", data)}catch(err) {};
          });
     }


     /**
      * [getIMG Función que nos abre en una ventana nueva la IMAGEN actualmente usada en la configuración del colorama]
      * @return {[null]}
      */
     $scope.getIMG = function() {
          window.open($scope.Mcolorama.dummyimg_backgroundimage, "_blank");
     }


     /**
      * [desplegarmenu Funcion para desplegar el menu]
      * @param  {[objeto]} $event [Objeto que lo emite]
      * @return {[null]}
      */
     $scope.desplegarmenu = function($event) {
          $scope.menudesplegado = ($scope.menudesplegado)? false : true;

          var texto = ($scope.menudesplegado)
          ? "=> CERRAR"
          : "=> OPCIONES"

          angular.element($event.target).html(texto);
     }


     /**
      * [setCartaPago establece la url de la vista a cargar y su respectivo controlador]
      */
     $scope.setCartaPago = function() {
          $scope.pais = $scope.cartaPago.vista;
          $location.path($scope.cartaPago.vista);
     }


     /**
      * [formularioS3clonar función para duplicar un bucket]
      * @param  {[objeto]} $scope [contiene todas las variables de la applicación]
      * @return {[objeto]}
      */
     $scope.formularioS3clonar = function($scope) {
          $scope.duplicar = function(portalDuplicar) {
               $rootScope.listo = true;

               if($scope.formS3clonar.origen.$valid
               && $scope.formS3clonar.destino.$valid
               && $scope.formS3clonar.origen.$dirty
               && $scope.formS3clonar.destino.$dirty) {

                    var porigen = portalDuplicar.origen.split(" -- ");
                    var pdestino = portalDuplicar.destino.split(" -- ");

                    $http.post("json.php", {
                         portal_origen: porigen[1],
                         portal_destino: pdestino[1],
                         accion: "duplicar"
                    })
                    .success(function(data, status, headers, config) {
                         if(data["success"]) {
                              window.top.location.reload();
                              alert("El duplicado se se completo con éxito...");
                         } else {
                              $rootScope.listo = false;
                              alert("Surgio un Error vuele a intentar más tarde...");
                         }                         
                    })
                    .error(function(data, status, headers, config) {
                         try{console.log("ERROR:", data)}catch(err) {};
                         try{console.log("ERROR:", status)}catch(err) {};

                         alert("Surgio un Error vuele a intentar más tarde...");
                    });

               } else {
                    alert("Revisa tu bucket de Origen y tu bucket de Destino...");
                    $rootScope.listo = false;
               }
          }
     }


     /**
      * [formularioS3borrar Función para borrar un bucket complete]
      * @param  {[type]} $scope [objeto que contiene todas las variables de la aplicación]
      * @return {[objeto]}
      */
     $scope.formularioS3borrar = function($scope) {
          $scope.borrar = function(portalBorrar) {
               $rootScope.listo = true;

               if($scope.formS3borrar.portalaborrar.$valid
               && $scope.formS3borrar.portalaborrar.$dirty) {
                    var pborrar = portalBorrar.portalaborrar.split(" -- ");

                    $http.post("json.php", {
                         portal_borrar: pborrar[1],
                         accion: "borrarbucket"
                    })
                    .success(function(data, status, headers, config) {
                         if(data["success"]) {
                              window.top.location.reload();
                              alert("Bucket borrado...");                    
                         } else {
                              $rootScope.listo = false;
                              alert("Surgio un Error vuele a intentar más tarde...");
                         }                         
                    })
                    .error(function(data, status, headers, config) {
                         try{console.log("ERROR:", data)}catch(err) {};
                         try{console.log("ERROR:", status)}catch(err) {};

                         alert("Surgio un Error vuele a intentar más tarde...");
                    });

               } else {
                    alert("Debes de escoger un bucket...");
                    $rootScope.listo = false;
               }
          }
     }


     /**
      * [formularioColorama Recoje todos los colores del formulario para aplicarlos al colorama]
      * @param  {[objeto]} $scope [el objeto que contiene el modelo de Mcolorama]
      * @return {[objeto]}
      */
     $scope.formularioColorama = function($scope, enviarImg) {
          $scope.imagen = null;               
          $scope.setValuesForm = false;

          $rootScope.$on("request:setvaluespresaved", function(e) {
               $scope.setValuesForm = true;
          });
         

          /**
           * [gd funcion para generar el fichero js y descargarlo]
           * @param  {[objeto]} $scope [entorno de de la aplicacion donde se encuentra el modelo del JSON]
           * @return {[null]}
           */          
          $scope.gd = function(Mcolorama) {
               $rootScope.listo = true;
               $scope.envioDatos = false;

               if($scope.setValuesForm) {
                    $scope.formColorama.dummy_backgroundcolor.$setViewValue($scope.formColorama.dummy_backgroundcolor.$modelValue);
                    $scope.formColorama.dummyboton_backgroundcolor.$setViewValue($scope.formColorama.dummyboton_backgroundcolor.$modelValue);
                    $scope.formColorama.dummytextoboton_color.$setViewValue($scope.formColorama.dummytextoboton_color.$modelValue);
                    $scope.formColorama.dummytexto_color.$setViewValue($scope.formColorama.dummytexto_color.$modelValue);
                    $scope.formColorama.dummyimg_backgroundimage.$setViewValue($scope.formColorama.dummyimg_backgroundimage.$modelValue);
                    $scope.formColorama.dummynombre_null.$setViewValue($scope.formColorama.dummynombre_null.$modelValue);
                    $scope.formColorama.dummylayer_null.$setViewValue($scope.formColorama.dummylayer_null.$modelValue);
               }

               if($scope.formColorama.dummy_backgroundcolor.$valid
               && $scope.formColorama.dummyboton_backgroundcolor.$valid
               && $scope.formColorama.dummytextoboton_color.$valid
               && $scope.formColorama.dummytexto_color.$valid
               && $scope.formColorama.dummynombre_null.$valid
               && $scope.formColorama.dummy_backgroundcolor.$dirty
               && $scope.formColorama.dummyboton_backgroundcolor.$dirty
               && $scope.formColorama.dummytextoboton_color.$dirty
               && $scope.formColorama.dummytexto_color.$dirty
               && $scope.formColorama.dummynombre_null.$dirty) {

                    $http.post("json.php", Mcolorama)
                    .success(function(data, status, headers, config) {
                         if(data["success"]) {

                              var nuevoSkin = data["objeto"]["dummy_portal"] + " - " + data["objeto"]["dummynombre_null"] + ".js";
                              var texto = (data["objeto"]["dummylayer_null"])
                              ? "Se ha creado el SKIN correctamente: " + data["objeto"]["dummynombre_null"] + "\ny el LAYER: " + data["objeto"]["dummylayer_null"]
                              : "Se ha creado el SKIN correctamente: " + data["objeto"]["dummynombre_null"];

                              if($scope.Skins.indexOf(nuevoSkin) == -1) {
                                   $scope.Skins.push(nuevoSkin);
                                   $scope.AllSkins.push(nuevoSkin);
                              }

                              alert(texto);
                              
                              if(data["objeto"]["dummylayer_null"]) window.open("json.php?objetojson=" + data["objeto"]["dummylayer_null"] + "&portal=" + data["objeto"]["dummy_portal"] + "&render=2", "_blank", "width=500,height=10,left=500,top=0");

                              window.open("json.php?objetojson=" + data["objeto"]["dummynombre_null"] + "&portal=" + data["objeto"]["dummy_portal"] + "&render=1", "_blank", "width=500,height=10,left=0,top=0");
                              //window.top.location.reload();
                         } else {
                              alert("Se ha producido un error.");
                              $scope.envioDatos = true;
                         }

                         $scope.permitidoBorrar = true;
                         $rootScope.listo = false;
                         $scope.envioDatos = true;
                    })
                    .error(function(data, status, headers, config) {
                         $scope.permitidoBorrar = false;
                         try{console.log("ERROR1:", status)}catch(err) {}
                         try{console.log("ERROR2:", headers)}catch(err) {}
                    });

               } else {
                    alert("Revisa el FORMULARIO");
                    $scope.envioDatos = true;
                    $rootScope.listo = false;
               }
          }
     }


     /**
      * [setSkin Se establece el skin en el dummy]
      * @param {[objeto]} skin [todos los parametros del skin apra el dummy]
      */
     $scope.setSkin = function(skin) {
          $rootScope.listo = true;

          $http.post("json.php", {
               nombre: skin,
               accion: "set"
          })
          .success(function(data, status, headers, config) {
               $scope.$emit("request:setvaluespresaved");
               $scope.Mcolorama = data;
               $rootScope.rootImg = $scope.Mcolorama.dummyimg_backgroundimage;

               $scope.permitidoBorrar = true;
               $rootScope.listo = false;
          })
          .error(function(data, status, headers, config) {
               $scope.permitidoBorrar = false;

               try{console.log("ERROR1:", status)}catch(err) {}
               try{console.log("ERROR2:", headers)}catch(err) {}
          });
     }

     
     /**
      * [checkPortal chequea el portal si existe el portal y regresa los skins, caso contrario lo crea para poder almacenar los skins]
      * @param  {[string]} id [id del portal selecto]
      */
     $scope.checkPortal = function(portal) {
          $rootScope.listo = true;

          $scope.Mcolorama.dummy_portal = portal.w_id;

          $http.post("json.php", {
               portal_id: portal.w_id,
               accion: "comprobar"
          })
          .success(function(data, status, headers, config) {
               if(data["success"]) {
                    alert("Estan listos los SKIN solicitados");
                    
                    $scope.Skins = data["objetos"];
               } else {
                    alert("No existe el bucket (No tiene skins asociados...)");
                    
                    $scope.permitidoBorrar = false;
                    $scope.Skins = [];
               }

               $rootScope.listo = false;
          })
          .error(function(data, status, headers, config) {
               $scope.permitidoBorrar = false;
               try{console.log("ERROR:", data)}catch(err) {};
          });
     }
};