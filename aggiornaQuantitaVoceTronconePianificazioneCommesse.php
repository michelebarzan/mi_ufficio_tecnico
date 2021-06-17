<?php

    $database="mi_pianificazione";
    include "connessioneDb.php";

    $quantita=$_REQUEST["quantita"];
    $id_consistenza_troncone=$_REQUEST["id_consistenza_troncone"];

    $q3="UPDATE dbo.consistenza_tronconi SET quantita=$quantita WHERE (id_consistenza_troncone = $id_consistenza_troncone)";
    $r3=sqlsrv_query($conn,$q3);
    if($r3==FALSE)
    {
        die("error");
    }
    else
    {
        $q0="SELECT SUM(quantita) AS totale,troncone
            FROM dbo.consistenza_tronconi
            WHERE (troncone = (SELECT troncone FROM consistenza_tronconi WHERE (id_consistenza_troncone = $id_consistenza_troncone)))
            GROUP BY troncone";
        $r0=sqlsrv_query($conn,$q0);
        if($r0==FALSE)
        {
            die("error$q0");
        }
        else
        {
            while($row0=sqlsrv_fetch_array($r0))
            {
                $response["totale"]=$row0["totale"];
                $response["id_troncone"]=$row0["troncone"];
            }
            echo json_encode($response);
        }
    }
    
?>