<?php

    $database="mi_pianificazione";
    include "connessioneDb.php";

    $id_commessa=$_REQUEST["id_commessa"];

    $tronconi=[];

    $q="SELECT * FROM anagrafica_tronconi WHERE commessa=$id_commessa";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error");
    }
    else
    {
        while($row=sqlsrv_fetch_array($r))
        {
            $troncone["id_troncone"]=$row["id_troncone"];
            $troncone["nome"]=utf8_encode($row["nome"]);
            $troncone["commessa"]=$row["commessa"];
            
            array_push($tronconi,$troncone);
        }
    }

    echo json_encode($tronconi);

?>