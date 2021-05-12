<?php

    include "Session.php";
    include "connessione.php";

    $tipo=$_REQUEST["tipo"];
    $id_richiesta=$_REQUEST["id_richiesta"];

    $q="UPDATE dbo.richieste_materiali_calcolo_fabbisogno SET tipo='$tipo' WHERE id_richiesta=$id_richiesta";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error".$q);
    }

?>