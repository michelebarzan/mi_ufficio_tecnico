<?php

    include "Session.php";
    include "connessione.php";

    $id_dettaglio=$_REQUEST["id_dettaglio"];

    $q="DELETE FROM [dbo].[dettagli_richieste_materiali_calcolo_fabbisogno] WHERE id_dettaglio=$id_dettaglio";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error".$q);
    }
    
?>