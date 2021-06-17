<?php

    $database="mi_pianificazione";
    include "connessioneDb.php";

    $id_troncone=$_REQUEST["id_troncone"];
    $n=$_REQUEST["n"];
    $id_voce=$_REQUEST["id_voce"];

    $q3="DELETE FROM dbo.consistenza_tronconi WHERE troncone = $id_troncone AND voce_consistenza_troncone_$n = $id_voce";
    $r3=sqlsrv_query($conn,$q3);
    if($r3==FALSE)
    {
        die("error");
    }
    
?>