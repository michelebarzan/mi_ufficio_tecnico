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
            $commessa["id_commessa"]=$row["id_commessa"];
            $commessa["nome"]=$row["nome"];
            $commessa["color"]=$row["color"];

            array_push($commesse,$commessa);
        }
    }

    echo json_encode($commesse);

?>