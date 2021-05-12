<?php

    include "Session.php";
    include "connessione.php";

    $id_richiesta=$_REQUEST["id_richiesta"];

    $q="DELETE FROM dettagli_richieste_materiali_calcolo_fabbisogno WHERE richiesta=$id_richiesta";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error".$q);
    }
    else
    {
        $q2="DELETE FROM richieste_materiali_calcolo_fabbisogno WHERE id_richiesta=$id_richiesta";
        $r2=sqlsrv_query($conn,$q2);
        if($r==FALSE)
        {
            die("error".$q2);
        }
    }

?>