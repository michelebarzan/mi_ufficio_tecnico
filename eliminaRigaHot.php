<?php

    include "Session.php";
    include "connessione.php";

    $id=$_REQUEST["id"];
    $table=$_REQUEST["table"];
    $primaryKey=$_REQUEST["primaryKey"];

    $q="DELETE FROM $table WHERE $primaryKey = $id";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error".$q);
    }

?>