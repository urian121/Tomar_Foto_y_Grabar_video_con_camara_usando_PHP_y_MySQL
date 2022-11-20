<?php
error_reporting(0);
require("config.php");
date_default_timezone_set("America/Bogota");
$dateFile   = date('d-m-Y H:i:s A', time()); 


# Si no hay archivos, salir inmediatamente
if (count($_FILES) <= 0 || empty($_FILES["video"])) {
    exit("No hay archivos");
}

# De dónde viene el vídeo y en dónde lo ponemos
$rutaVideoSubido   = $_FILES["video"]["tmp_name"];

$logitudNuevoNombre  = 15;
$newNombreVideo      = substr( md5(microtime()), 1, $logitudNuevoNombre);

$nameFile            = $newNombreVideo.".mp4";
//$nuevoNombre       = $newNombreVideo.".webm";

//Creando directorio
$directorio = "../files/videos/";
if (!file_exists($directorio)) {
    mkdir($directorio, 0777, true);
}
$dir = opendir($directorio);


$rutaDeGuardado    = $directorio.$nameFile;


// Mover el archivo subido a la ruta de guardado
if(move_uploaded_file($_FILES["video"]["tmp_name"], $rutaDeGuardado)){
// Imprimir el nombre para que la petición lo lea
echo $nameFile;
closedir($dir);

//Registrando video en BD
$queryInsert  = ("INSERT INTO archivos(nameFile, dateFile) VALUES ('$nameFile','$dateFile')");
$resultInsert = mysqli_query($con, $queryInsert);

}