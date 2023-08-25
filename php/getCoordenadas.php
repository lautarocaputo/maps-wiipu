<?php

include("config.php");

$query = "SELECT * FROM coordenadas ";
$resultado = mysqli_query($conexion, $query);

$datos = array();
while ($fila = mysqli_fetch_assoc($resultado)) {
    $datos[] = $fila;
}

echo json_encode($datos);
mysqli_close($conexion);

?>