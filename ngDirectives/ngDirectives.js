/**
 * Variables para las validaciones
 */
var ok = "#f2ffff";
var ko = "#ffe3e3";
var _numerico_ = /^[0-9]+$/;
var _alfanumericos_ = /^([A-Za-z0-9\_]{3,})+$/;
var _hexadecimal_ = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;          
var _base64_ = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;

angular.module("_directives_", [])
/**
 * [Validación de colores hexadecimales ej: #000000]
 * @return {[string | false]} [dependiendo de la validación]
 */
.directive("hexadecimal", function() {
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
})


/**
 * [Validación de entrada de solo números]
 * @return {[int | false]} [dependiendo de la validación]
 */
.directive("numerico", function() {
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
})


/**
 * [Validacion de caracteres alfanúmericos]
 * @return {[string | false]} [dependiendo de la validación]
 */
.directive("alfanumericos", function() {
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
})


/**
 * [Directiva para entireactuar con el alert de confirm para borrar una landing]
 * @return {[null]}
 */
.directive("ngConfirmClick", function() {
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
})


/**
 * [Drag and drop de archivos de tipo imagen que serán codificado en base64]
 * @param  {[objeto]} enviarImg [con la informacion del de la imagen en base64]
 * @return {[string]}           [string de la imgen en base64]
 */
.directive("soltarArchivos", function(enviarImg) {
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