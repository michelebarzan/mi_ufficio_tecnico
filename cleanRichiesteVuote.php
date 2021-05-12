<?php

    include "Session.php";
    include "connessione.php";

    $q="DELETE FROM richieste_materiali_calcolo_fabbisogno WHERE id_richiesta NOT IN (SELECT DISTINCT richiesta FROM dettagli_richieste_materiali_calcolo_fabbisogno)";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error");
    }

?>