<?php

    include "Session.php";
    include "connessione.php";

    $missingValue=str_replace("'","''",$_REQUEST["missingValue"]);
    $missingTable=$_REQUEST["missingTable"];
    $missingColumn=$_REQUEST["missingColumn"];

    $q="INSERT INTO dbo.[$missingTable] ([$missingColumn]) VALUES ('$missingValue')";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error".$q);
    }

?>