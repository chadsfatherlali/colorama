<?
include "aws-sdk-for-php-master/sdk.class.php";
include "aws-sdk-for-php-master/services/s3.class.php";
include_once "lib/dbmgr.php";
include_once "lib/resource.php";

class s3helper extends AmazonS3{
     private $bucketname = "b2c-docs";

     /**
      * [__construct iniciamos constructor parent AmazonS3]
      */
     public function __construct() {
          parent::__construct();
     }

     /**
      * [get_all_buckets obtiene todos los buscket asociados a la cuenta]
      * @return [array] [listado de todos los buckets]
      */
     public function get_all_buckets() {
          print_r($this->list_buckets());
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

          if(!empty($archivos)){
               $coincidencias = preg_grep($patron, $archivos);

               foreach ($coincidencias as $value) {
                    list($basura, $archivo) = explode("colorama_landings/", $value);

                    $response["objetos"][] = $archivo;
               }

               $response["success"] = true;

               return $response;
          }else{
               $response["success"] = false;               
               
               return $response;
          }
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
      * [upload_generate_json función que sube el json]
      * @param  [objeto] $datos [obtengo json que va a contener el archivo subido a AmazonS3]
      * @return [null]
      */
     public function upload_generate_json($datos) {
          $datos = json_decode($datos, true);
          $carpeta = "colorama_landings/" . $datos["dummy_portal"] . "/";

          $result = $this->create_object($this->bucketname, $carpeta . $datos["dummynombre_null"] . ".js", array(
               "body"                   => json_encode($datos),  
               "acl"                    => AmazonS3::ACL_PUBLIC,
               "contentType"            => "application/javascript",
               "headers"                => array(
                  "Content-Encoding"    => "UTF-8",
                  "Cache-Control"    => "max-age=60",
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
          $portales_mobile = array();
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

          $portales = db::query("argo", $sql, array());
          
          foreach ($portales as $value) {
               if($value["w_product_tag"] == "PORTALES_MOBILE") {
                    $portales_mobile[] = $value;
               }
          }

          return $portales_mobile;
     }     
}

$s3h = new s3helper();
?>