<?php

    include "Session.php";
    include "connessione.php";

    $raggruppamenti=[];

    $q="SELECT * FROM raggruppamenti_materiali ORDER BY nome";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error".$q);
    }
    else
    {
        while($row=sqlsrv_fetch_array($r))
        {
            $raggruppamento["id_raggruppamento"]=$row["id_raggruppamento"];
            $raggruppamento["nome"]=$row["nome"];
            $raggruppamento["um"]=$row["um"];
            
            array_push($raggruppamenti,$raggruppamento);
        }
    }

    echo json_encode($raggruppamenti);

?>