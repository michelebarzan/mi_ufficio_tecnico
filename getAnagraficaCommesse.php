<?php

    include "Session.php";
    $database="mi_webapp";
    include "connessioneDb.php";

    set_time_limit(120);

    $commesse=[];

    $q="SELECT * FROM anagrafica_commesse ORDER BY nome";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error".$q);
    }
    else
    {
        while($row=sqlsrv_fetch_array($r))
        {
            $commessa["id_commessa"]=$row["id_commessa"];
            $commessa["nome"]=$row["nome"];
            $commessa["descrizione"]=$row["descrizione"];
            array_push($commesse,$commessa);
        }
    }

    echo json_encode($commesse);

?>