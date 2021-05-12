<?php

    include "Session.php";
    include "connessione.php";

    $id_materiale=$_REQUEST["id_materiale"];

    $q="UPDATE anagrafica_materiali SET materia_prima=NULL WHERE id_materiale=$id_materiale";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error".$q);
    }
    
?>