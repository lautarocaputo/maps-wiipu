<?php 
    $host = "";
    $User = ""; 
    $pass = ""; 
    $db = ""; 
    
    $conexion = mysqli_connect($host, $User, $pass, $db);
    $conexion->set_charset("utf8");
    
    if(!$conexion){
        echo "Conexion fallida: " . mysqli_connect_error();
    }
?>
