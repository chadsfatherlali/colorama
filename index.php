<? 
include "s3helper.php";

$portales = $s3h->get_mobile_web_sites();
$allskins = $s3h->get_all_files_json();
$buckets = $s3h->get_buckets_used_and_unused();
$landings = $s3h->get_creatividades();

$s3h->minifyHTML("inicio");
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

     <script type="text/javascript" src="ngDirectives/ngDirectives.js"></script>
     <script type="text/javascript" src="ngFactories/ngFactories.js"></script>
     <script type="text/javascript" src="ngControllers/ngControllers.js"></script>
     
     <script>
          window.Landings = <? echo json_encode($landings) ?>;
          window.Portales = <? echo json_encode($portales) ?>;
          window.AllSkins = <? echo json_encode($allskins) ?>;
          window.BucketsConContenido = <? echo json_encode($buckets) ?>;
     </script>

     <script>
          (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
          (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
          m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
          })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

          ga('create', 'UA-51155491-1', 'egtelecom.es');
          ga('send', 'pageview');
     </script>
</head>
<body ng-controller="mainController">
     
     <div id="loader" ng-if="listo" ng-include="'ngincludes/loader.html'"></div>

     <header ng-class="{menudesplegado: menudesplegado == true}">
          <div id="opciones" ng-include="'ngincludes/opciones.html'"></div>
          <a id="menu" ng-click="desplegarmenu($event)">=> OPCIONES</a>
     </header>
     
     <fieldset>
          <legend>Portales disponibles:</legend>
          <select chosen no-results-text="'No hemos encontrado nada'" data-placeholder="Escoge un Portal" id="portalSelect" ng-model="portal" ng-change="checkPortal(portal)" ng-options="(p.w_alias + ' -- ' + p.w_id) for p in Portales">
               <option value=""></option>
          </select>
          <legend>Skins disponibles:</legend>

          <select chosen no-results-text="'No hemos encontrado nada'" data-placeholder="Escoge un Skin" id="skinsSelect" ng-model="skin" ng-change="setSkin(skin)" ng-options="s for s in Skins">
               <option value=""></option>
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
                    <input name="dummyimg_backgroundimage" id="dummyinputimg" ng-model="Mcolorama.dummyimg_backgroundimage" class="dropzone" placeholder="Suelta aquí la imagen" soltar-archivos="[image/png, image/jpeg, image/gif]" />
               </fieldset>

               <fieldset>
                    <legend>Nombre del SKIN:</legend>
                    <input name="dummynombre_null" id="dummyinputnombre" ng-model="Mcolorama.dummynombre_null" type="text" alfanumericos placeholder="Nombre del SKIN" value="" />
               </fieldset>

               <fieldset>
                    <legend>Número del LAYER (opcional):</legend>
                    <input name="dummylayer_null" id="dummyinputlayer" ng-model="Mcolorama.dummylayer_null" type="text" numerico placeholder="Número del LAYER (opcional)" value="" />
               </fieldset>

               <!-- <fieldset>
                    <legend>Asignar a creatividad (opcional):</legend>
                    <select chosen no-results-text="'No hemos encontrado nada'" data-placeholder="Escoge una creatividad" id="portalSelect" ng-model="Mcolorama.creatividad_asignada" ng-options="(l.id + ' -- ' + l.nombre + ' -- ' + l.ruta) for l in Landings">
                         <option value=""></option>
                    </select>
               </fieldset> -->

               <button id="generar-y-guardar" ng-click="gd(Mcolorama)" ng-if="envioDatos">Generar y Descargar</button>
          </form>
     </div>     

     <div class="modulos" id="modulo-dummy">          
          <select ng-model="cartaPago" ng-change="setCartaPago()" ng-options="p.nombre for p in cartasPago"></select>
          
          <h4>Todos los skins disponibles</h4>
          
          <button id="borrarSkin" ng-if="permitidoBorrar" confirmed-click="borrarSkin()" ng-confirm-click>Borrar - Skin</button>
          <button id="descargarIMG" ng-if="Mcolorama.dummyimg_backgroundimage" ng-click="getIMG()">Descargar - Imagen BG</button>
          <button id="descargarSkin" ng-if="permitidoDescargar" ng-click="descargarSkin()">Descargar - Skin</button>
          
          <select chosen no-results-text="'No hemos encontrado nada'" data-placeholder="Escoge un Skin" ng-model="skin" ng-change="setSkin(skin)" ng-options="s for s in AllSkins">
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

<? $s3h->minifyHTML("fin"); ?>