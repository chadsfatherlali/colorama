<?
include "aws-sdk-for-php-master/sdk.class.php";
include "aws-sdk-for-php-master/services/s3.class.php";
include "lib/dev_prod_config.php";
include_once "lib/dbmgr.php";
include_once "lib/resource.php";

class s3helper extends AmazonS3 {
     private $bucketname = "b2c-docs";
     private $portales_mobile;
     private $portales_result;


     /**
      * [__construct iniciamos constructor parent AmazonS3]
      */
     public function __construct() {
          parent::__construct();

          $sql = "SELECT w.web_id AS w_id,
          w.web_url AS w_url,
          w.web_nombre AS w_nombre,
          w.web_ts_modificacion AS w_ts_modificacion,
          w.web_alias AS w_alias,
          w.web_product_tag AS w_product_tag,
          w.web_usuario_modifica AS w_usuario,
          cf.cfc_cname AS w_url_landings
          FROM argo_websites w
          LEFT JOIN b2c.b2c_cloudfront_config cf ON cfc_id=web_cloudfront_cfc_id
          WHERE 1 = 1
          ORDER BY w_ts_modificacion DESC";

          $this->portales_result = db::query("argo", $sql, array());
     }


     /**
      * [minifyHTML Función que comprime el HTML de la aplicación]
      * @param  [string] $param [Parametro que decide el inicio o el fin de la compresión del documente HTML valores: "inicio" -> para comenzar la compresión y "fin" -> para terminar la compresion]
      * @return [xhtml] [html comprimido]
      */
     public function minifyHTML($param) {
          if($param == "inicio"){
               function html($buffer) {
                    $search = array(
                         "/\>[^\S ]+/s",
                         "/[^\S ]+\</s",
                         "/(\s)+/s",
                    );
                     
                    $replace = array(
                         ">",
                         "<",
                         "\\1",
                    );

                    $buffer = preg_replace($search, $replace, $buffer);

                    return ($buffer);
               }

               ob_start("html");
          }else{
               ob_end_flush();
          }
     }


     /**
      * [get_all_buckets obtiene todos los buscket asociados a la cuenta]
      * @return [array] [listado de todos los buckets]
      */
     public function get_all_buckets() {
          print_r($this->list_buckets());
     }


     /**
      * [get_buckets_used_and_unused devuelve los buckets que contienen skin y los que no]
      * @return [array]
      */
     public function get_buckets_used_and_unused() {
          $bucketstatus = array();
          $portalesusados = array();
          $portalesalias = array();
          
          foreach ($this->portales_result as $value) {
               $portalesusados[] = $value["w_id"];
               $portalesalias[$value["w_id"]] = $value["w_alias"];
          }

          $archivos = $this->get_object_list($this->bucketname, array(
               "pcre" => "/colorama_landings/"
          ));

          $match = preg_grep("/colorama_landings\/[0-9A-z]+\//", $archivos);
          
          $bucketslimpios = preg_replace_callback("/[0-9A-z]+.js/", function($matches) {
               null;
          }, $match);
          
          $bucketslimpios = preg_replace_callback("/colorama_landings/", function($matches) {
               null;
          }, $bucketslimpios);
          
          $bucketslimpios = preg_replace_callback("/\//", function($matches) {
               null;
          }, $bucketslimpios);

          $bucketslimpios = array_unique($bucketslimpios);

          $bucketstatus["full"] = $bucketslimpios;
          $bucketstatus["empty"] = array_diff($portalesusados, $bucketslimpios);

          foreach ($bucketstatus["full"] as $key => $value) {
               $bucketstatus["full"][$key] = $portalesalias[$value] . " -- " . $value;
          }

          foreach ($bucketstatus["empty"] as $key => $value) {
               $bucketstatus["empty"][$key] = $portalesalias[$value] . " -- " . $value;
          }

          return $bucketstatus;
     }


     /**
      * [duplicate_buckets Función que duplica los archivos de un bucket a otro]
      * @param  [string] $origen  [id del bucket de origen]
      * @param  [string] $destino [id del bucket de destino]
      * @return [null]
      */
     public function duplicate_buckets($origen, $destino) {
          $result = $this->get_files_json($origen);

          if($result["success"]) {
               foreach ($result["objetos"] as $value) {
                    list($bucket, $js) = explode(" - ", $value);

                    $archivo = $this->get_object($this->bucketname, "colorama_landings/" . $bucket . "/". $js);
                    $nuevoobjeto = str_replace($origen, $destino, $archivo->body);

                    $result = $this->create_object($this->bucketname, "colorama_landings/" . $destino . "/" . $js, array(
                         "body"                   => $nuevoobjeto,  
                         "acl"                    => AmazonS3::ACL_PUBLIC,
                         "contentType"            => "application/javascript",
                         "headers"                => array(
                              "Content-Encoding"  => "UTF-8",
                              "Cache-Control"     => "max-age=60",
                         ),
                    ));

                    if(!$result) {
                         $response["success"] = false;

                         return $response;
                    }
               }

               $response["success"] = true;
               $response["objeto"] = $destino;

               return $response;
          }
     }


     /**
      * [delete_bucket_obj Función para borrar un bucket completo]
      * @param  [string] $bucketaborrar [id del bucket a borrar]
      * @return [null]
      */
     public function delete_bucket_obj($bucketaborrar) {
          $result = $this->get_files_json($bucketaborrar);

          foreach ($result["objetos"] as $value) {
               list($bucket, $js) = explode(" - ", $value);
               $borrado = $this->delete_object($this->bucketname, "colorama_landings/" . $bucketaborrar . "/" . $js);                   
               
               if(!$borrado) {
                    return $response["success"] = false;
               }
          }
          
          $response["success"] = true;

          return $response;
     }


     /**
      * [get_all_files_json obtienes todos los SKINS]
      * @return [array] [devuelve todas las posibles configuraciones de los skins]
      */
     public function get_all_files_json() {
          $patron = "/[a-zA-Z0-9].js/i";
          
          $archivos = $this->get_object_list($this->bucketname, array(
               "pcre" => "/colorama_landings/"
          ));

          if(!empty($archivos)) {
               $coincidencias = preg_grep($patron, $archivos);

               foreach ($coincidencias as $value) {
                    list($basura, $archivo) = explode("colorama_landings/", $value);
                    $archivo = str_replace("/", " - ", $archivo);

                    $response["objetos"][] = $archivo;
               }

               $response["success"] = true;
          }else{
               $response["success"] = false;               
          }

               return $response;
     }


     /**
      * [get_files_json obtiene el nombre de todas las configuraciones ".json" creadas para los skins de las landings]
      * @return [array] [nombres de los json de los skins]
      */
     public function get_files_json($carpeta = null) {
          $response = array();
          $patron = "/[a-zA-Z0-9].js/i";          
          $carpeta = ($carpeta)? "colorama_landings/" . $carpeta . "/" : "/colorama_landings/";
          $carpetasplit = ($carpeta)? "/" . str_replace("/", "\/", $carpeta) . "/i" : "/colorama_landings/i";

          $archivos = $this->get_object_list($this->bucketname, array(
               "pcre" => $carpetasplit
          ));

          if(!empty($archivos)) {
               $coincidencias = preg_grep($patron, $archivos);

               foreach ($coincidencias as $value) {
                    list($basura, $archivo) = explode("colorama_landings/", $value);
                    $archivo = str_replace("/", " - ", $archivo);

                    $response["objetos"][] = $archivo;
               }

               $response["success"] = true;
          }else{
               $response["success"] = false;
          }

          return $response;
     }


     /**
      * [get_file_json devuelve el archivo json donse se alacenan todas las configuraciones]
      * @return [array] [objeto con todo la info del mismo]
      */
     public function get_file_json() {
          $result = $this->get_object($this->bucketname, "colorama_landings/configJson.json");
          $result = (array) $result;
          $result = $result["body"];

          return $result;
     }


     /**
      * [delete_skin función que borra un skin]
      * @param  [string] $portal [id del portal equivalente a el nombre en el bucket de amazon]
      * @param  [string] $skin   [nombre del skin]
      * @return [array]
      */
     public function delete_skin($portal, $skin) {
          $objeto = "colorama_landings/". $portal . "/" . $skin . ".js";
          $result = $this->delete_object($this->bucketname, $objeto);

          return $result->isOK();
     }


     /**
      * [upload_generate_json función que sube el json]
      * @param  [objeto] $datos [obtengo json que va a contener el archivo subido a AmazonS3]
      * @return [null]
      */
     public function upload_generate_json($datos) {
          $replica = null;
          $datos = json_decode($datos, true);
          $carpeta = "colorama_landings/" . $datos["dummy_portal"] . "/";

          @$existePorNumero = $this->if_object_exists($this->bucketname, $carpeta . $datos["dummylayer_null"] . ".js");
          @$existePorNombre = $this->if_object_exists($this->bucketname, $carpeta . $datos["dummynombre_null"] . ".js");

          if($existePorNumero 
          || $existePorNombre) {

               $response["success"] = false;
               $response["detalle"] = "existe";

               return $response;
          }

          if(isset($datos["dummylayer_null"])) {
               $replica = $datos["dummylayer_null"] . "===" . $datos["dummynombre_null"];
               $datos["replica"] = $replica;

               $result = $this->create_object($this->bucketname, $carpeta . $datos["dummylayer_null"] . ".js", array(
                    "body"                   => json_encode($datos),
                    "acl"                    => AmazonS3::ACL_PUBLIC,
                    "contentType"            => "application/javascript",
                    "headers"                => array(
                         "Content-Encoding"  => "UTF-8",
                         "Cache-Control"     => "max-age=60",
                    ),
               ));
          }

          $result = $this->create_object($this->bucketname, $carpeta . $datos["dummynombre_null"] . ".js", array(
               "body"                   => json_encode($datos),  
               "acl"                    => AmazonS3::ACL_PUBLIC,
               "contentType"            => "application/javascript",
               "headers"                => array(
                    "Content-Encoding"  => "UTF-8",
                    "Cache-Control"     => "max-age=60",
               ),
          ));

          if($result) {
               $response["success"] = true;
               $response["objeto"] = $datos;
          }else{
               $response["success"] = false;
          }
          
          return $response; 
     }


     /**
      * [get_mobile_web_sites obtiene todos los portales mobiles creados]
      * @return [array]
      */
     public function get_mobile_web_sites() {
          foreach ($this->portales_result as $value) {
               $this->portales_mobile[] = $value;
          }

          return $this->portales_mobile;
     }


     public function get_creatividades() {
          $sql = "select * from landings_creatividades";
          $response = db::query("b2c", $sql, array());
          $creatividades = array();
          
          foreach ($response as $key => $value) {
               $creatividades[$key]["nombre"] = $value["plan_nombre"];
               $creatividades[$key]["ruta"] = $value["plan_uri"];
               $creatividades[$key]["id"] = $value["plan_id"];
          }

          return $creatividades;
     }
}

$s3h = new s3helper();
?>