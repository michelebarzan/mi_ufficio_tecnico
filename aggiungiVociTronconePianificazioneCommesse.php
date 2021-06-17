<?php

    $database="mi_pianificazione";
    include "connessioneDb.php";

    $id_troncone=$_REQUEST["id_troncone"];
    $voce_consistenza_troncone_1=$_REQUEST["voce_consistenza_troncone_1"];
    $voce_consistenza_troncone_2=$_REQUEST["voce_consistenza_troncone_2"];

    $q2="INSERT INTO [dbo].[consistenza_tronconi] (voce_consistenza_troncone_1,voce_consistenza_troncone_2,[troncone],[quantita])
        VALUES ($voce_consistenza_troncone_1,$voce_consistenza_troncone_2,$id_troncone,0)";
    $r2=sqlsrv_query($conn,$q2);
    if($r2==FALSE)
    {
        die("error");
    }
?>