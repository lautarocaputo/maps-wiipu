<?php

include("../config/bd.php");

$query = "SELECT * FROM usuarios_geo WHERE idUsuario=?";
$idUsuario = 326; // reemplazar con el id del usuario de la sesion

$stmt = $conexion->prepare($query);
$stmt->bind_param("i", $idUsuario);
$stmt->execute();

$resultado = $stmt->get_result();

$datos = array();
while ($fila = $resultado->fetch_assoc()) {
    $datos[] = $fila;
}

echo json_encode($datos);

$stmt->close();
$conexion->close();

?>