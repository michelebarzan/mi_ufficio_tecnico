<?php

    include "Session.php";
    include "connessione.php";

    $id_materiale=$_REQUEST["id_materiale"];

    $q="DELETE FROM anagrafica_materiali WHERE id_materiale = $id_materiale";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error".$q);
    }

?>