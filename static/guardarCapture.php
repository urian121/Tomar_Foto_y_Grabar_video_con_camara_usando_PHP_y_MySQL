<?php
require("config.php");
date_default_timezone_set("America/Bogota");
$dateFile   = date('d-m-Y H:i:s A', time()); 
 
$payload = json_decode(file_get_contents("php://input"));
if (!$payload) {
    exit("!No se recibió ninguna imagen!");
}

$captura = $payload->captura;

$capturaLimpia = str_replace("data:image/png;base64,", "", urldecode($captura));

$imagenDecodificada = base64_decode($capturaLimpia);

$nombreFoto = uniqid() . ".png";
$nombreImagenGuardada = "../files/fotos/" .$nombreFoto;

if(file_put_contents($nombreImagenGuardada, $imagenDecodificada) ==TRUE){
    $queryInsert  = ("INSERT INTO archivos(nameFile, dateFile) VALUES ('$nombreFoto','$dateFile')");
    $resultInsert = mysqli_query($con, $queryInsert);
}

exit($nombreFoto);
?>
