<?php

    include "Session.php";
    include "connessione.php";

    $value=$_REQUEST["value"];
    $id=$_REQUEST["id"];

    $q="UPDATE anagrafica_materiali SET [nome]='$value' WHERE id_materiale=$id";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error".$q);
    }

?>