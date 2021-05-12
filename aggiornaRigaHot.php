<?php

    include "Session.php";
    include "connessione.php";

    $id=$_REQUEST["id"];
    $colonna=$_REQUEST["colonna"];
    $valore=$_REQUEST["valore"];
    $table=$_REQUEST["table"];
    $primaryKey=$_REQUEST["primaryKey"];

    $q="UPDATE $table SET [$colonna]='$valore' WHERE [$primaryKey] = $id";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error".$q);
    }

?>