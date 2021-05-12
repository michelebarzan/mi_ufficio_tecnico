<?php

    include "Session.php";
    include "connessione.php";

    $note=str_replace("'","''",$_REQUEST["note"]);
    $id_richiesta=$_REQUEST["id_richiesta"];

    $q="UPDATE dbo.richieste_materiali_calcolo_fabbisogno SET note='$note' WHERE id_richiesta=$id_richiesta";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error".$q);
    }

?>