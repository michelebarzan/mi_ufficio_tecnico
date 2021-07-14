<?php

    $database="mi_pianificazione";
    include "connessioneDb.php";

    $anno=$_REQUEST["anno"];
    $settimana=$_REQUEST["settimana"];
    $nome=$_REQUEST["nome"];
    $id_troncone=$_REQUEST["id_troncone"];

    $q0="UPDATE [mi_pianificazione].[dbo].[milestones_principali] SET anno=$anno, settimana=$settimana WHERE (troncone = $id_troncone) AND nome='$nome'";
    $r0=sqlsrv_query($conn,$q0);
    if($r0==FALSE)
    {
        die("error");
    }
    else
    {
        while($row0=sqlsrv_fetch_array($r0))
        {
            $consistenza_troncone["totale"]=$row0["totale"];
        }
    }

?>