<?php

    $database="mi_pianificazione";
    include "connessioneDb.php";

    $id_troncone=$_REQUEST["id_troncone"];
    $n=$_REQUEST["n"];
    if($n==1)
        $alt_n=2;
    else
        $alt_n=1;
    $id_voce=$_REQUEST["id_voce"];

    $q3="SELECT DISTINCT voce_consistenza_troncone_".$alt_n." AS voce_alt
        FROM dbo.consistenza_tronconi
        WHERE (troncone = $id_troncone)";
    $r3=sqlsrv_query($conn,$q3);
    if($r3==FALSE)
    {
        die("error");
    }
    else
    {
        while($row3=sqlsrv_fetch_array($r3))
        {
            $q2="INSERT INTO [dbo].[consistenza_tronconi] (voce_consistenza_troncone_".$alt_n.",voce_consistenza_troncone_".$n.",[troncone],[quantita])
                VALUES (".$row3['voce_alt'].",".$id_voce.",$id_troncone,0)";
            $r2=sqlsrv_query($conn,$q2);
            if($r2==FALSE)
            {
                die("error");
            }
        }
    }
    
?>