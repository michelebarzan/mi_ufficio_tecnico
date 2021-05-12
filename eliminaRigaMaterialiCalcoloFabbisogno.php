<?php

    include "Session.php";
    include "connessione.php";

    $id_importazione=$_REQUEST["id_importazione"];

    $q="DELETE FROM materiali_calcolo_fabbisogno WHERE id_importazione = $id_importazione";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error".$q);
    }

?>