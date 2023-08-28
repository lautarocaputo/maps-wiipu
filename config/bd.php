<?php 
    $host = "127.0.0.1";
    $User = "root"; 
    $pass = ""; 
    $db = "test"; 
    
    $conexion = mysqli_connect($host, $User, $pass, $db);
    $conexion->set_charset("utf8");
    
    if(!$conexion){
        echo "Conexion fallida: " . mysqli_connect_error();
    }
?>
