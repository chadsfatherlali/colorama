<? 
include "s3helper.php";
$portales = $s3h->get_mobile_web_sites();
$allskins = $s3h->get_all_files_json();
?>
<!doctype html>
<html lang="es" ng-app="App">
<head>
     <meta charset="UTF-8">
     <title>Colorama Landings</title>
     <link rel="stylesheet" type="text/css" href="bootstrap/css/bootstrap.min.css">
     <link rel="stylesheet" type="text/css" href="bootstrap/css/bootstrap-theme.min.css">
     <link href="colorpicker.css" rel="stylesheet">
     <link href="style.css" rel="stylesheet">
     
     <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.12/angular.min.js"></script>
     <script type="text/javascript" src="http://code.angularjs.org/1.2.7/angular-route.min.js"></script>
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

     <h1>COLORAMA LANDINGS</h1>
     <fieldset>
          <legend>Portales disponibles:</legend>
          <select id="portalSelect" ng-model="portal.id" ng-change="checkPortal(portal.id)">
               <option ng-repeat="Portal in Portales">{{Portal.w_alias}} -- {{Portal.w_id}}</option>
          </select>
          <legend>Skins disponibles:</legend>
          <select id="skinsSelect" ng-model="skin.name" ng-change="setSkin(skin.name)">
               <option ng-repeat="Skin in Skins">{{Skin}}</option>
          </select>
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
                    <input name="dummyimg_backgroundimage" id="dummyinputimg" ng-model="Mcolorama.dummyimg_backgroundimage" class="dropzone" placeholder="Suelta aquí la imagen" soltar-archivos="[image/png, image/jpeg, image/gif]" value=""></input>
               </fieldset>
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
          <div id="dummy" style="background-color: {{Mcolorama.dummy_backgroundcolor}}">
               <div id="dummyheader" style="background-image: url({{rootImg}})"></div>
               <div id="dummybody">
                    <div id="dummyboton" style="background-color: {{Mcolorama.dummyboton_backgroundcolor}}"><span id="dummytextoboton" style="color: {{Mcolorama.dummytextoboton_color}}">Acceder</span></div>
                    <div id="dummytexto" style="color: {{Mcolorama.dummytexto_color}}">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sed augue congue, varius metus nec, sodales velit. Aenean ut porttitor dolor. Vestibulum fringilla ut est non commodo. Phasellus iaculis pharetra vestibulum. Sed porttitor lorem in nisl bibendum, vel ultrices lectus sagittis.</div>
               </div>
          </div>
          <h3>Todos los skins disponibles</h3>
          <select ng-model="skin.all" ng-change="setSkin(skin.all)">
               <option ng-repeat="Skin in AllSkins">{{Skin}}</option>
          </select>
     </div>

     <div class="modulos" id="modulo-json">
          <h2>Dummy JSON:</h2>
          <p>{{Mcolorama | json}}</p>
     </div>

<script type="text/javascript" src="scripts.js"></script>
</body>
</html>