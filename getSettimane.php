<?php

    $database="mi_pianificazione";
    include "connessioneDb.php";

    //PRENDO L ARRAY SETTIMANE
    $settimane=[];

    $q2="SELECT [settimana] FROM [mi_pianificazione].[dbo].[lunedi_settimane] ORDER BY settimana";
    $r2=sqlsrv_query($conn,$q2);
    if($r2==FALSE)
    {
        die("error".$q2);
    }
    else
    {
        while($row2=sqlsrv_fetch_array($r2))
        {
            array_push($settimane,$row2["settimana"]);
        }
    }

    echo json_encode($settimane);

?>