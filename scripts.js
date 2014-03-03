/**
 * [_colorama_ Variable que contiene la inicialización de la aplicación]
 * @type {[objeto]}
 */
(function(){
     var ok = "#f2ffff";
     var ko = "#ffe3e3";
     var _hexadecimal_ = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
     var _alfanumericos_ = /^[A-Za-z0-9]+$/;
     var _base64_ = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
     var _colorama_ = angular.module("App", ["colorpicker.module"]);

     
     /**
      * [description]
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
                         e.dataTransfer.effectAllowed = "copy";

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

                         archivo = e.dataTransfer.files[0];
                         nombre = archivo.name;
                         tipo = archivo.type;
                         tamano = archivo.size;
                         lector.readAsDataURL(archivo);

                         return false;
                    });
               }
          };
     });     
})();


/**
 * [mainController controlador general de la aplicación]
 * @return {[null]} 
 */
var mainController = function($rootScope, $scope, $http) {
     $scope.listo = false;
     $scope.Skins = {};
     $scope.Mcolorama = {};          
     $scope.envioDatos = true;
     $rootScope.rootImg = null;
     $rootScope.rootListImage = [];
     
     $rootScope.$watch(function() {
          $scope.Mcolorama.dummyimg_backgroundimage = $rootScope.rootImg;
     });


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
               && $scope.formColorama.dummynombre_null.$dirty){

                    $http.post("json.php", Mcolorama)
                    .success(function(data, status, headers, config){
                         if(data["success"]){                                   
                              alert("Se ha creado el SKIN correntamente: " + data["objeto"]["dummynombre_null"]);
                              
                              window.open("json.php?objetojson=" + data["objeto"]["dummynombre_null"] + "&portal=" + data["objeto"]["dummy_portal"], "_blank", "width=500,height=10");
                              window.top.location.reload();
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
               alert("Se ha cargado el SKIN: " + skin);                    

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
      * [checkPortal chequea el portal si existe el portal y regresa los skins, caso contrario lo crea para poder almacenar los skins]
      * @param  {[string]} id [id del portal selecto]
      */
     $scope.checkPortal = function(id) {
          $scope.listo = true;
          var portal_id = id.split(" -- ");
          portal_id = portal_id[1];

          $scope.Mcolorama.dummy_portal = portal_id;              

          $http.post("json.php", {
               portal_id: portal_id,
               accion: "comprobar"
          })
          .success(function(data, status, headers, config){
               if(data["success"]){
                    alert("Estan listos los SKIN solicitados");
                    $scope.Skins = data["objetos"];
               }else{
                    alert("No existe el bucket (No tiene skins asociados...)");
               }

               $scope.listo = false;
          })
          .error(function(data, status, headers, config){
               console.log("ERROR:", data);
          });
     }
}