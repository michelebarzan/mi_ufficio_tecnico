<?php

    include "Session.php";
    include "connessione.php";
    
    $commesse=[];
    $gruppi=[];
    $materiali=[];
    $qnt=[];
    $um=[];

    $q="SELECT DISTINCT [commessa],[gruppo],[materiale],[um] FROM [mi_webapp].[dbo].[dati_importazioni_fabbisogni]";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error".$q);
    }
    else
    {
        while($row=sqlsrv_fetch_array($r))
        {
            if (!in_array($row["commessa"], $commesse))
                array_push($commesse,$row["commessa"]);
            if (!in_array($row["gruppo"], $gruppi))
                array_push($gruppi,$row["gruppo"]);
            if (!in_array($row["materiale"], $materiali))
                array_push($materiali,$row["materiale"]);
            if (!in_array($row["um"], $um))
                array_push($um,$row["um"]);
        }
    }

    $datalists["commesse"]=array_unique($commesse);
    $datalists["gruppi"]=array_unique($gruppi);
    $datalists["materiali"]=array_unique($materiali);
    $datalists["um"]=array_unique($um);

    echo json_encode($datalists);

?>