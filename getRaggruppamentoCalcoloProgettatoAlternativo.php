<?php

    include "Session.php";
    include "connessione.php";

    $q="SELECT ISNULL(MAX(nome),'') AS nome FROM raggruppamenti_materiali WHERE calcolo_progettato_alternativo='true'";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error".$q);
    }
    else
    {
        while($row=sqlsrv_fetch_array($r))
        {
            echo $row["nome"];
        }
    }

?>