<?php

    include "Session.php";
    include "connessione.php";

    $id_consistenza_commessa=$_REQUEST["id_consistenza_commessa"];
    $colonna=$_REQUEST["colonna"];
    $valore=$_REQUEST["valore"];

    $q="UPDATE consistenza_commesse SET [$colonna]='$valore' WHERE id_consistenza_commessa = $id_consistenza_commessa";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error".$q);
    }

?>