<?php

    $database="mi_pianificazione";
    include "connessioneDb.php";

    $macro_attivita=[];

    $q="SELECT * FROM macro_attivita ORDER BY nome";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error");
    }
    else
    {
        while($row=sqlsrv_fetch_array($r))
        {
            $macro_attivita_item["id_macro_attivita"]=$row["id_macro_attivita"];
            $macro_attivita_item["nome"]=$row["nome"];
            $macro_attivita_item["descrizione"]=$row["descrizione"];
            $macro_attivita_item["durata"]=$row["durata"];
            
            array_push($macro_attivita,$macro_attivita_item);
        }
    }

    echo json_encode($macro_attivita);

?>