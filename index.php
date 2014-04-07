<? 
include "s3helper.php";

$portales = $s3h->get_mobile_web_sites();
$allskins = $s3h->get_all_files_json();
?>
<!doctype html>
<html lang="es" ng-app="App">
<head>
     <base href="index.php" />
     <meta charset="UTF-8">
     <title>Colorama Landings</title>
     <link rel="stylesheet" type="text/css" href="bootstrap/css/bootstrap.min.css">
     <link rel="stylesheet" type="text/css" href="bootstrap/css/bootstrap-theme.min.css">
     <link rel="stylesheet" type="text/css" href="vendor/chosen.css">
     <link rel="stylesheet" type="text/css" href="chosen-spinner.css">
     <link href="colorpicker.css" rel="stylesheet">
     <link href="style.css" rel="stylesheet">

     <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>     
     <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.12/angular.min.js"></script>
     <script type="text/javascript" src="http://code.angularjs.org/1.2.7/angular-route.min.js"></script>
     <script type="text/javascript" src="http://code.angularjs.org/1.2.15/angular-sanitize.min.js"></script>     
     <script type="text/javascript" src="vendor/chosen.jquery.js"></script>
     <script type="text/javascript" src="chosen.js"></script>     
     <script type="text/javascript" src="bootstrap-colorpicker-module.js"></script>
     
     <script>
          window.Portales = <? echo json_encode($portales) ?>;
          window.AllSkins = <? echo json_encode($allskins) ?>;
     </script>
</head>
<body ng-controller="mainController">
     <div id="loader" ng-if="listo">
          <div class="content-loader">
               <div class='loading spin-1'>
                    <div class='loading spin-2'>
                         <div class='loading spin-3'>
                              <div class='loading spin-4'>
                                   <div class='loading spin-5'>
                                        <div class='loading spin-6'></div>
                                   </div>
                              </div>
                         </div>
                    </div>
               </div>
          </div>
     </div>
     
     <fieldset>
          <legend>Portales disponibles:</legend>
          <select chosen data-placeholder="Escoge un Portal" id="portalSelect" ng-model="portal" ng-change="checkPortal(portal)" ng-options="(p.w_alias + ' -- ' + p.w_id) for p in Portales">
               <option value=""></option>
          </select>
          <legend>Skins disponibles:</legend>
          <h3>Imagenes:</h3>
          <select chosen data-placeholder="Escoge un Skin" id="skinsSelect" ng-model="skin" ng-change="setSkin(skin)" ng-options="s for s in Skins">
               <option value=""></option>
               <!-- <option ng-repeat="Skin in Skins">{{Skin}}</option> -->
          </select>
          <h3>Tipo:</h3>
          <select id="tipoSkin" ng-model="tipoImagen" ng-options="p.nombre for p in tiposImagen"></select>          
          <span class="replica" ng-if="Mcolorama.replica"><strong>REPLICA:</strong> {{Mcolorama.replica}}</span>
     </fieldset>
     <div>
          <form name="formColorama" class="modulos" id="landings" ng-controller="formularioColorama">
               <fieldset>
                    <legend>Color Background:</legend>
                    <input name="dummy_backgroundcolor" id="dummyinput" ng-model="Mcolorama.dummy_backgroundcolor" colorpicker hexadecimal type="text" placeholder="Color Background" value="" />
               </fieldset>
               <fieldset>
                    <legend>Color Boton:</legend>
                    <input name="dummyboton_backgroundcolor" id="dummyinputboton" ng-model="Mcolorama.dummyboton_backgroundcolor" colorpicker hexadecimal type="text" placeholder="Color Botón" value="" />
               </fieldset>
               <fieldset>
                    <legend>Color Texto Botón:</legend>
                    <input name="dummytextoboton_color" id="dummyinputtextoboton" ng-model="Mcolorama.dummytextoboton_color" colorpicker hexadecimal type="text" placeholder="Color Texto Botón" value="" />
               </fieldset>
               <fieldset>
                    <legend>Color Texto:</legend>
                    <input name="dummytexto_color" id="dummyinputtexto" ng-model="Mcolorama.dummytexto_color" colorpicker hexadecimal type="text" placeholder="Color Texto" value="" />
               </fieldset>
               <fieldset>
                    <legend>Imagen Cabecera:</legend>
                    <input ng-if="tipoImagen.tipo == 'estatica'" name="dummyimg_backgroundimage" id="dummyinputimg" ng-model="Mcolorama.dummyimg_backgroundimage" class="dropzone" placeholder="Suelta aquí la imagen" soltar-archivos="[image/png, image/jpeg, image/gif]" value=""></input>
                    <input ng-if="tipoImagen.tipo == 'dinamica'" type="file" name="dummyimg_backgroundimage" id="dummyinputimg" value="Mcolorama.dummyimg_backgroundimage" />
               </fieldset>
             <!--   <fieldset>
                    <legend>Tranparencia del iframe (solo cartas de pago Italia):</legend>
                    <p>{{Mcolorama.dummyiframe_background}}%</p>
                    <input name="dummyiframe_background" id="dummyinputiframe" ng-model="Mcolorama.dummyiframe_background" type="range" min="0" max="100" step="0" />
               </fieldset> -->
               <fieldset>
                    <legend>Nombre del SKIN:</legend>
                    <input name="dummynombre_null" id="dummyinputnombre" ng-model="Mcolorama.dummynombre_null" type="text" alfanumericos placeholder="Nombre del SKIN" value="" />
               </fieldset>
               <fieldset>
                    <legend>Número del LAYER (opcional):</legend>
                    <input name="dummylayer_null" id="dummyinputlayer" ng-model="Mcolorama.dummylayer_null" type="text" numerico placeholder="Número del LAYER (opcional)" value="" />
               </fieldset>
               <button id="generar-y-guardar" ng-click="gd(Mcolorama)" ng-if="envioDatos">Generar y Descargar</button>
          </form>
     </div>     

     <div class="modulos" id="modulo-dummy">          
          <select ng-model="cartaPago" ng-change="setCartaPago()" ng-options="p.nombre for p in cartasPago"></select>
          
          <h4>Todos los skins disponibles</h4>
          <select chosen data-placeholder="Escoge un Portal" ng-model="skin" ng-change="setSkin(skin)" ng-options="s for s in AllSkins">
               <!-- <option ng-repeat="Skin in AllSkins">{{Skin}}</option> -->
               <option value=""></option>
          </select>

          <div ng-view></div>
     </div>

     <div class="modulos" id="modulo-json">
          <h2>Dummy JSON:</h2>
          <p>{{Mcolorama | json}}</p>
     </div>

<script type="text/javascript" src="scripts.js"></script>
</body>
</html>