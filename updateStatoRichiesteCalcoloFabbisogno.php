<?php

    include "Session.php";
    include "connessione.php";

    $id_richieste_in=implode(",",json_decode($_REQUEST["JSONid_richieste"]));
    $stato=$_REQUEST["stato"];

    $q="UPDATE [dbo].[richieste_materiali_calcolo_fabbisogno] SET stato='$stato' WHERE id_richiesta IN ($id_richieste_in)";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error");
    }

?>