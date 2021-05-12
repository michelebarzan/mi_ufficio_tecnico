<?php

    include "Session.php";
    $database="mi_db_tecnico";
    include "connessioneDb.php";

    $q="SELECT MAX (dataOra) as dataOra FROM [mi_db_tecnico].[dbo].[log_crea_peso_qnt_cabine]";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error".$q);
    }
    else
    {
        while($row=sqlsrv_fetch_array($r))
        {
            echo $row["dataOra"]->format("d/m/Y H:i:s");
        }
    }


?>