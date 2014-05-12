<?
if(isset($_GET["objetojson"]) && isset($_GET["portal"])) {
     $nombrejs = $_GET["portal"] . "/" . $_GET["objetojson"];
     $datos = file_get_contents("https://b2c-docs.s3.amazonaws.com/colorama_landings/" . $nombrejs . ".js");
     $datosNombre = json_decode($datos, true);

     if(isset($_GET["render"]) 
     && $_GET["render"] == 1) {
          
          header("Content-Description: File Transfer"); 
          header("Content-Type: application/octet-stream");
          header("Content-disposition: attachment; filename='" . $datosNombre["dummynombre_null"] . ".js'");
     }else if(isset($_GET["render"])
     && $_GET["render"] == 2) {
          
          header("Content-Description: File Transfer"); 
          header("Content-Type: application/octet-stream");
          header("Content-disposition: attachment; filename='" . (int)$datosNombre["dummylayer_null"] . ".js'");
     }

     echo $datos;
}else{
     include "s3helper.php";

     $datos = file_get_contents("php://input");
     $get = json_decode($datos, true);

     if(isset($get["accion"])) {
          switch ($get["accion"]) {
               case "set":
                    $skin = str_replace(" - ", "/", $get["nombre"]);
                    $datos = file_get_contents("https://b2c-docs.s3.amazonaws.com/colorama_landings/" . $skin);
                    echo $datos;
               break;

               case "comprobar":
                    $result = $s3h->get_files_json($get["portal_id"]);
                    echo json_encode($result);
               break;

               case "borrar":
                    $result = $s3h->delete_skin($get["portal_id"], $get["skin_name"]);
                    echo json_encode($result);
               break;

               case "duplicar":
                    $result = $s3h->duplicate_buckets($get["portal_origen"], $get["portal_destino"]);
                    echo json_encode($result);
               break;

               case "borrarbucket":
                    $result = $s3h->delete_bucket_obj($get["portal_borrar"]);
                    echo json_encode($result);                              
               break;
          }
     }else{
          $result = $s3h->upload_generate_json($datos);

          if($result["success"]) {
               echo json_encode($result);
          }else{
               echo false;
          }
     }
}
?>
