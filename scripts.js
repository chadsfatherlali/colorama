/**
 * [_colorama_ Variable que contiene la inicialización de la aplicación]
 * @type {[objeto]}
 */
(function(){
     var ok = "#f2ffff";
     var ko = "#ffe3e3";
     var _numerico_ = /^[0-9]+$/;
     var _alfanumericos_ = /^([A-Za-z0-9\_]{3,})+$/;
     var _hexadecimal_ = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;          
     var _base64_ = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
     var _colorama_ = angular.module("App", ["colorpicker.module", "ngRoute", "ngSanitize", "localytics.directives"]);
     

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
                    },
                    // controller: "getInteractives"
               }
          )
          // .when("/interactivas", 
          //      {
          //           templateUrl: "ngviews/interactivas.html"
          //      }
          // )         
          .otherwise(
               {
                    templateUrl: "ngviews/espana.html",
                    // controller: "getInteractives"
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
                    
                    procesarDD = function(e){
                         e.preventDefault();
                         // e.dataTransfer.effectAllowed = "copy";
                         e.originalEvent.dataTransfer.effectAllowed = "copy";

                         return false;
                    }

                    esValida = function(extesiones) {
                         if(extesionesValidas.indexOf(extesiones) > -1) {
                              return true;
                         }else{
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
                              if(esValida(tipo)){
                                   return scope.$apply(function() {
                                        scope.archivo = evt.target.result;
                                        TMPlistado[0] = (evt.target.result);
                                        scope.listado = TMPlistado;
                                        enviarImg.pasar(scope.archivo);
                                   });
                              }
                         };

                         //archivo = e.dataTransfer.files[0];
                         archivo = e.originalEvent.dataTransfer.files[0];
                         // document.getElementById("uploadfile").value = archivo;
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
     $scope.urlIframe = null;
     $scope.pais = "espana";
     $scope.Skins = {};     
     $scope.listo = false;
     $scope.Mcolorama = {};     
     $scope.envioDatos = true;
     // $scope.Interactives = {};
     $rootScope.rootImg = null;
     $rootScope.rootListImage = [];
     $scope.Portales = $window.Portales;
     $scope.AllSkins = $window.AllSkins["objetos"];
     // $scope.Mcolorama.dummyinteractive_name = "";
     $scope.tiposImagen = [
          {
               nombre: "Estática",
               tipo: "estatica"
          },
          {    
               nombre: "Dinámica",
               tipo: "dinamica"
          }
     ];
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

     $scope.tipoImagen = $scope.tiposImagen[0];
     $scope.cartaPago = $scope.cartasPago[0];

     $rootScope.$watch(function() {
          $scope.Mcolorama.dummyimg_backgroundimage = $rootScope.rootImg;
     });

     // $scope.$watch("Mcolorama.dummyimg_backgroundimage", function() {
     //      if($scope.pais == "espana") {
     //           $scope.Mcolorama.dummyinteractive_name = null;
     //      }
     // });

     // $scope.$watch("Mcolorama.dummyinteractive_name", function() {
     //      if($scope.pais == "espana") {
     //           $scope.Mcolorama.dummyimg_backgroundimage = null;
     //      }
     // });


     /**
      * [getInteractives Obtiene todos las creatividades HTML por defecto y si es que las hay carga las de ESPAÑA]
      * @param  {[objeto]} $routeParams [objeto con toda la config de para establecer la URL]
      * @return {[array]}              [array con todas las creatividades interactivas]
      */
     // $scope.getInteractives = function($routeParams) {          
     //      $http.post("json.php", {
     //           pais: $routeParams.pais,
     //           accion: "interactivas"
     //      })
     //      .success(function(data, status, headers, config){
     //           if(data.success){
     //                $scope.Interactives = data.htmls;
     //           }
     //      })
     //      .error(function(data, status, headers, config){
     //           console.log("ERROR:", data);
     //      });
     // }


     /**
      * [setCartaPago establece la url de la vista a cargar y su respectivo controlador]
      */
     $scope.setCartaPago = function() {
          $scope.pais = $scope.cartaPago.vista;
          $location.path($scope.cartaPago.vista);
     }

     /**
      * [formularioColorama Recoje todos los colores del formulario para aplicarlos al colorama]
      * @param  {[objeto]} $scope [el objeto que contiene el modelo de Mcolorama]
      * @return {[objeto]}
      */
     $scope.formularioColorama = function($scope, enviarImg) {
          $scope.imagen = null;               
          $scope.setValuesForm = false;

          $rootScope.$on("request:setvaluespresaved", function(e){
               $scope.setValuesForm = true;
          });
         

          /**
           * [gd funcion para generar el fichero js y descargarlo]
           * @param  {[objeto]} $scope [entorno de de la aplicacion donde se encuentra el modelo del JSON]
           * @return {[null]}
           */          
          $scope.gd = function(Mcolorama) {
               $scope.listo = true;
               $scope.envioDatos = false;

               if($scope.setValuesForm){
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
                    .success(function(data, status, headers, config){
                         if(data["success"]){
                              var texto = (data["objeto"]["dummylayer_null"])
                              ? "Se ha creado el SKIN correctamente: " + data["objeto"]["dummynombre_null"] + "\ny el LAYER: " + data["objeto"]["dummylayer_null"]
                              : "Se ha creado el SKIN correctamente: " + data["objeto"]["dummynombre_null"];

                              alert(texto);
                              
                              if(data["objeto"]["dummylayer_null"]) window.open("json.php?objetojson=" + data["objeto"]["dummylayer_null"] + "&portal=" + data["objeto"]["dummy_portal"] + "&render=2", "_blank", "width=500,height=10,left=500,top=0");

                              window.open("json.php?objetojson=" + data["objeto"]["dummynombre_null"] + "&portal=" + data["objeto"]["dummy_portal"] + "&render=1", "_blank", "width=500,height=10,left=0,top=0");
                              //window.top.location.reload();
                         }else{
                              alert("Se ha producido un error.");
                              $scope.envioDatos = true;
                         }

                         $scope.listo = false;
                         $scope.envioDatos = true;
                    })
                    .error(function(data, status, headers, config){
                         try{console.log("ERROR1:", status)}catch(err){}
                         try{console.log("ERROR2:", headers)}catch(err){}
                    });

               }else{
                    alert("Revisa el FORMULARIO");
                    $scope.envioDatos = true;
                    $scope.listo = false;
               }
          }
     }


     /**
      * [setSkin Se establece el skin en el dummy]
      * @param {[objeto]} skin [todos los parametros del skin apra el dummy]
      */
     $scope.setSkin = function(skin) {
          $scope.listo = true;

          $http.post("json.php", {
               nombre: skin,
               accion: "set"
          })
          .success(function(data, status, headers, config){      
               $scope.$emit("request:setvaluespresaved");
               $scope.Mcolorama = data;
               $rootScope.rootImg = $scope.Mcolorama.dummyimg_backgroundimage;

               $scope.listo = false;
          })
          .error(function(data, status, headers, config){
               try{console.log("ERROR1:", status)}catch(err){}
               try{console.log("ERROR2:", headers)}catch(err){}
          });
     }


     /**
      * [setInteractive establece la url de la creativiad interactiva en el Dummy]
      * @param {[type]} skin [nombre de la creatividad]
      */
     // $scope.setInteractive = function(skin) {
     //      $location.path("interactivas");
     //      $scope.urlIframe = "interactivas/" + $scope.pais + "/" + skin;
     //      $scope.Mcolorama.dummyinteractive_name = skin;
          
     //      if($scope.pais == "espana") {
     //           $scope.Mcolorama.dummyimg_backgroundimage = "Santiago";
     //      }
     // }


     /**
      * [checkPortal chequea el portal si existe el portal y regresa los skins, caso contrario lo crea para poder almacenar los skins]
      * @param  {[string]} id [id del portal selecto]
      */
     $scope.checkPortal = function(portal) {
          $scope.listo = true;

          $scope.Mcolorama.dummy_portal = portal.w_id;

          $http.post("json.php", {
               portal_id: portal.w_id,
               accion: "comprobar"
          })
          .success(function(data, status, headers, config){
               if(data["success"]){
                    alert("Estan listos los SKIN solicitados");
                    $scope.Skins = data["objetos"];
               }else{
                    alert("No existe el bucket (No tiene skins asociados...)");
                    $scope.Skins = {};
               }

               $scope.listo = false;
          })
          .error(function(data, status, headers, config){
               console.log("ERROR:", data);
          });
     }
};