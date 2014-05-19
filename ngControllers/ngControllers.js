var _controllers_ = angular.module("_controllers_", []);


/**
 * Controlador principal de la aplicación;
 */
_controllers_.controller("mainController", function($rootScope, $scope, $window, $http, $routeParams, $location, $sce, $compile) {
     $scope.permitidoBorrar = false;
     $scope.permitidoDescargar = false;
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
     $scope.Landings = $window.Landings;
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
      * [descargarSkin Función que nos permite descarganos los skin js]
      * @return {[null]} 
      */
     $scope.descargarSkin = function() {
          if($scope.Mcolorama.dummylayer_null) window.open("json.php?objetojson=" + $scope.Mcolorama.dummylayer_null + "&portal=" + $scope.Mcolorama.dummy_portal + "&render=2", "_blank", "width=500,height=10,left=500,top=0");

          window.open("json.php?objetojson=" + $scope.Mcolorama.dummynombre_null + "&portal=" + $scope.Mcolorama.dummy_portal + "&render=1", "_blank", "width=500,height=10,left=0,top=0");
     }
  

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
          $scope.optionsLandings = $scope.Landings;
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
                         console.log("DEV:", data);

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

                         } else if(!data["success"]
                         && data["detalle"] == "existe") {
                              alert("Ya existe un SKIN con ese ID ó NOMBRE, elige otros.");
                              $scope.envioDatos = true;                              
                         } else {
                              alert("Se ha producido un error.");
                              $scope.envioDatos = true;
                         }

                         $scope.permitidoBorrar = true;
                         $scope.permitidoDescargar = true;
                         $rootScope.listo = false;
                         $scope.envioDatos = true;
                    })
                    .error(function(data, status, headers, config) {
                         $scope.permitidoBorrar = false;
                         $scope.permitidoDescargar = true;
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
               $scope.permitidoDescargar = true;
               $rootScope.listo = false;
          })
          .error(function(data, status, headers, config) {
               $scope.permitidoBorrar = false;
               $scope.permitidoDescargar = false;

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
});