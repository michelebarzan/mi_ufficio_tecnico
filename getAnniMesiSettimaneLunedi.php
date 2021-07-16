<?php

    $database="mi_pianificazione";
    include "connessioneDb.php";

    $settimane=[];

    $q2="SELECT TOP (100) PERCENT DATEPART(yy, data) AS year, DATEPART(mm, data) AS month, REPLACE(settimana, { fn CONCAT(CONVERT(varchar(MAX), LEFT(settimana, 4)), '_') }, '') AS week, DATEPART(dd, data) AS day, settimana AS year_week, data AS date
        FROM dbo.lunedi_settimane
        ORDER BY date";
    $r2=sqlsrv_query($conn,$q2);
    if($r2==FALSE)
    {
        die("error".$q2);
    }
    else
    {
        while($row2=sqlsrv_fetch_array($r2))
        {
            $settimana["year"]=$row2["year"];
            $settimana["month"]=$row2["month"];
            $settimana["week"]=$row2["week"];
            $settimana["day"]=$row2["day"];
            $settimana["year_week"]=$row2["year_week"];
            $settimana["date"]=$row2["date"];

            array_push($settimane,$settimana);
        }
    }

    echo json_encode($settimane);

?>