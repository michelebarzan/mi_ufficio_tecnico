<?php

    include "Session.php";
    include "connessione.php";

    $id_consistenza_commessa=$_REQUEST["id_consistenza_commessa"];

    $q="DELETE FROM consistenza_commesse WHERE id_consistenza_commessa = $id_consistenza_commessa";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error".$q);
    }

?>