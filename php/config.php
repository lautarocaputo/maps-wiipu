<?php 
    $host = "localhost:3307";
    $User = "root"; 
    $pass = ""; 
    $db = "test"; 
    
    $conexion = mysqli_connect($host, $User, $pass, $db);
    $conexion->set_charset("utf8");
    
    if(!$conexion){
        echo "Conexion fallida: " . mysqli_connect_error();
    }
?>
