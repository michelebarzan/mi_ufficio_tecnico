<?php

    include "Session.php";
    include "connessione.php";
    
    $id_file=$_REQUEST["id_file"];

    $q4="DELETE FROM [materiali_calcolo_fabbisogno] WHERE [file]= $id_file";
    $r4=sqlsrv_query($conn,$q4);
    if($r4==FALSE)
    {
        die("error1");
    }
    $q="DELETE FROM [file_importazioni_fabbisogni] WHERE id_file=$id_file";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error2");
    }

?>