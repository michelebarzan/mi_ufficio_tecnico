<?php

    $database="mi_pianificazione";
    include "connessioneDb.php";

    $id_troncone=$_REQUEST["id_troncone"];

    $milestones=[];

    $q="SELECT * FROM milestones WHERE troncone=$id_troncone";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error");
    }
    else
    {
        while($row=sqlsrv_fetch_array($r))
        {
            $milestone["id_milestone"]=$row["id_milestone"];
            $milestone["nome"]=utf8_encode($row["nome"]);
            $milestone["descrizione"]=utf8_encode($row["descrizione"]);
            $milestone["troncone"]=$row["troncone"];
            $milestone["settimana"]=$row["settimana"];
            $milestone["anno"]=$row["anno"];
            
            array_push($milestones,$milestone);
        }
    }

    echo json_encode($milestones);

?>