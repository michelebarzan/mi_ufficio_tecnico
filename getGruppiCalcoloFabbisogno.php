<?php

    include "Session.php";
    include "connessione.php";

    $gruppi=[];

    $q="SELECT * FROM anagrafica_gruppi ORDER BY nome";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error");
    }
    else
    {
        while($row=sqlsrv_fetch_array($r))
        {
            $gruppo["id_gruppo"]=$row["id_gruppo"];
            $gruppo["nome"]=$row["nome"];
            $gruppo["descrizione"]=$row["descrizione"];
            
            array_push($gruppi,$gruppo);
        }
    }

    echo json_encode($gruppi);

?>