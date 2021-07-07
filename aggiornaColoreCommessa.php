<?php

    include "Session.php";
    include "connessione.php";

    $id_commessa=$_REQUEST["id_commessa"];
    $color=$_REQUEST["color"];

    $q="UPDATE anagrafica_commesse SET [color]='$color' WHERE id_commessa = $id_commessa";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error".$q);
    }

?>