<?
if(isset($_GET["objetojson"]) && isset($_GET["portal"])) {
     $nombrejs = $_GET["portal"] . "/" . $_GET["objetojson"];
     $datos = file_get_contents("https://b2c-docs.s3.amazonaws.com/colorama_landings/" . $nombrejs . ".js");
     $datosNombre = json_decode($datos, true);

     if(isset($_GET["render"]) 
     && $_GET["render"] == 1){
          
          header("Content-Description: File Transfer"); 
          header("Content-Type: application/octet-stream");
          header("Content-disposition: attachment; filename='" . $datosNombre["dummynombre_null"] . ".js'");
     }else if(isset($_GET["render"])
          && $_GET["render"] == 2){
          
          header("Content-Description: File Transfer"); 
          header("Content-Type: application/octet-stream");
          header("Content-disposition: attachment; filename='" . $datosNombre["dummylayer_null"] . ".js'");  
     }

     echo $datos;
}else{
     include "s3helper.php";

     $datos = file_get_contents("php://input");
     $get = json_decode($datos, true);

     if(isset($get["accion"]) && $get["accion"] == "set"){

          $datos = file_get_contents("https://b2c-docs.s3.amazonaws.com/colorama_landings/" . $get["nombre"]);
          echo $datos;

     }else if(isset($get["accion"]) && $get["accion"] == "comprobar") { 
          
          $result = $s3h->get_files_json($get["portal_id"]);
          echo json_encode($result);

     }else{

          $result = $s3h->upload_generate_json($datos);

          if($result["success"]){
               echo json_encode($result);
          }else{
               echo false;
          }

     }
}
?>