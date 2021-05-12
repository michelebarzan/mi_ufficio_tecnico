<?php

    include "Session.php";
    include "connessione.php";

    $gruppo=$_REQUEST["gruppo"];
    $id_richiesta=$_REQUEST["id_richiesta"];

    $q="UPDATE dbo.richieste_materiali_calcolo_fabbisogno SET gruppo=$gruppo WHERE id_richiesta=$id_richiesta";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error".$q);
    }

?>