<? 
include "s3helper.php";

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
     <link rel="stylesheet" type="text/css" href="modulos/tree/abn_tree.css">     
     <link rel="stylesheet" type="text/css" href="vendor/chosen.css">
     <link rel="stylesheet" type="text/css" href="chosen-spinner.css">
     <link href="colorpicker.css" rel="stylesheet">
     <link href="stylesheets/screen.css" rel="stylesheet">

     <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>     
     <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.12/angular.min.js"></script>
     <script type="text/javascript" src="http://code.angularjs.org/1.2.7/angular-route.min.js"></script>
     <script type="text/javascript" src="http://code.angularjs.org/1.2.15/angular-sanitize.min.js"></script>   
     <script type="text/javascript" src="vendor/chosen.jquery.js"></script>
     <script type="text/javascript" src="chosen.js"></script>     
     <script type="text/javascript" src="bootstrap-colorpicker-module.js"></script>
     <script type="text/javascript" src="modulos/tree/abn_tree_directive.js"></script>

     <script type="text/javascript" src="ngDirectives/ngDirectives.js"></script>
     <script type="text/javascript" src="ngFactories/ngFactories.js"></script>
     <script type="text/javascript" src="ngControllers/ngControllers.js"></script>
     
     <script type="text/javascript" src="var.js.php"></script>

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
          <a id="menu" ng-click="desplegarmenu($event)">OPCIONES BUCKETS</a>
     </header>
     
     <div id="wrapper">
          <div class="modulos formularioHeader">
               <h3>Portales disponibles:</h3>
               <select chosen no-results-text="'No hemos encontrado nada'" data-placeholder="Escoge un Portal" id="portalSelect" ng-model="portal" ng-change="checkPortal(portal)" ng-options="(p.w_alias + ' -- ' + p.w_id) for p in Portales">
                    <option value=""></option>
               </select>
               
               <!-- <h3>Landings Asociadas:</h3>
               <select chosen no-results-text="'No hemos encontrado nada'" data-placeholder="Escoge una landing" id="landingSelect" ng-model="landing" ng-change="setFolderSkins(landing)" ng-options="(l.land_id + ' -- ' + l.land_nombre ) for l in Landings">
                    <option value=""></option>
               </select> -->

               <h3>Skins disponibles:</h3>
               <select chosen no-results-text="'No hemos encontrado nada'" data-placeholder="Escoge un Skin" id="skinsSelect" ng-model="skin" ng-change="setSkin(skin)" ng-options="s for s in Skins">
                    <option value=""></option>
               </select>

               <div class="replica" ng-if="Mcolorama.replica"><strong>REPLICA:</strong> {{Mcolorama.replica}}</div>
          </div>
          
          <div ng-include="'ngincludes/formularioprincipal.html'"></div>

          <div class="modulos" id="modulo-dummy">          
               <!-- <select ng-model="cartaPago" ng-change="setCartaPago()" ng-options="p.nombre for p in cartasPago"></select> -->
               
               <fieldset>
                    <legend>Todos los skins disponibles</legend>
                    
                    <div>
                         <button id="borrarSkin" ng-if="permitidoBorrar" confirmed-click="borrarSkin()" ng-confirm-click>Borrar - Skin</button>
                         <button id="descargarIMG" ng-if="Mcolorama.dummyimg_backgroundimage" ng-click="getIMG()">Descargar - Imagen BG</button>
                         <button id="descargarSkin" ng-if="permitidoDescargar" ng-click="descargarSkin()">Descargar - Skin</button>
                    </div>
                    
                    <select id="todoslosskindisponibles" chosen no-results-text="'No hemos encontrado nada'" data-placeholder="Escoge un Skin" ng-model="skin" ng-change="setSkin(skin)" ng-options="s for s in AllSkins">
                         <option value=""></option>
                    </select>
               </fieldset>

               <div ng-view></div>

               <div class="modulos" id="modulo-json">
                    <fieldset>
                         <legend>Dummy JSON:</legend>
                         <p>{{Mcolorama|json}}</p>
                    </fieldset>
               </div>
          </div>
     </div>

<script type="text/javascript" src="scripts.js"></script>
</body>
</html>

<? $s3h->minifyHTML("fin"); ?>