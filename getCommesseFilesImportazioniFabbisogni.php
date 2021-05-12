<?php

    include "Session.php";
    include "connessione.php";

    $commesse=[];

    $q="SELECT * FROM anagrafica_commesse";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error");
    }
    else
    {
        while($row=sqlsrv_fetch_array($r))
        {
            array_push($commesse,$row["nome"]);
        }
    }

    echo json_encode($commesse);

?>