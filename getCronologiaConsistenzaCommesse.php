<?php

    include "Session.php";
    include "connessione.php";

    $cronologia=[];

    $q="SELECT * FROM [mi_webapp].[dbo].[log_importazioni_consistenza_commessa] order by data desc";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error".$q);
    }
    else
    {
        while($row=sqlsrv_fetch_array($r))
        {
            $importazione["id_importazione"]=$row["id_importazione"];
            $importazione["origine"]=$row["origine"];
            $importazione["commessa"]=$row["commessa"];
            $importazione["utente"]=$row["utente"];
            $importazione["data"]=$row["data"]->format('d/m/Y H:i:s');
            $importazione["risultato"]=$row["risultato"];
            
            array_push($cronologia,$importazione);
        }
    }


    echo json_encode($cronologia);

?>