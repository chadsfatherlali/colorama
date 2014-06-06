<?
include "s3helper.php";

$portales = $s3h->get_mobile_web_sites();
$allskins = $s3h->get_all_files_json();
$buckets = $s3h->get_buckets_used_and_unused();
$landings = $s3h->get_landings();
$forfolders = $s3h->get_files_for_folders();
$forfoldersimplantados = $s3h->get_files_for_folders(true);

// $lastModified=filemtime(__FILE__);
// $etagFile = md5_file(__FILE__);

// $ifModifiedSince = (isset($_SERVER["HTTP_IF_MODIFIED_SINCE"])? $_SERVER["HTTP_IF_MODIFIED_SINCE"] : false);
// $etagHeader = (isset($_SERVER["HTTP_IF_NONE_MATCH"]) ? trim($_SERVER["HTTP_IF_NONE_MATCH"]) : false);

// header("Content-Type: application/javascript");
// header("Last-Modified: " . gmdate("D, d M Y H:i:s", $lastModified) . " GMT");
// header("Etag: $etagFile");
// header("Cache-Control: public");

// if(@strtotime($_SERVER["HTTP_IF_MODIFIED_SINCE"]) == $lastModified 
//      || $etagHeader == $etagFile){
       
//           header("HTTP/1.1 304 Not Modified");
//           exit;
// }
?>

window.treedata_avm_implantados = <? echo json_encode($forfoldersimplantados) ?>; 
window.treedata_avm = <? echo json_encode($forfolders) ?>; 
window.AllLandings = <? echo json_encode($landings) ?>;
window.Portales = <? echo json_encode($portales) ?>;
window.AllSkins = <? echo json_encode($allskins) ?>;
window.BucketsConContenido = <? echo json_encode($buckets) ?>;