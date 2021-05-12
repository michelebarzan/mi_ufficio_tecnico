<?php

    include "Session.php";
    include "connessione.php";

    $id_materiale=$_REQUEST["id_materiale"];
    $id_materia_prima=$_REQUEST["id_materia_prima"];

    $q="UPDATE anagrafica_materiali SET materia_prima=$id_materia_prima WHERE id_materiale=$id_materiale";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error");
    }

?>