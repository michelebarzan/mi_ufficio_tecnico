<?php

    include "Session.php";
    include "connessione.php";

    $colonne=[];

    $q="SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = N'consistenza_commesse'";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error");
    }
    else
    {
        while($row=sqlsrv_fetch_array($r))
        {
            array_push($colonne,$row["COLUMN_NAME"]);
        }
    }

    echo json_encode($colonne);

?>