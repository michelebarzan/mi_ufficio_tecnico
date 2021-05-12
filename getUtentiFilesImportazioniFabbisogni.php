<?php

    include "Session.php";
    include "connessione.php";

    $utenti=[];

    $q="SELECT DISTINCT dbo.utenti.id_utente, dbo.utenti.username FROM dbo.utenti INNER JOIN dbo.file_importazioni_fabbisogni ON dbo.utenti.id_utente = dbo.file_importazioni_fabbisogni.utente";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error");
    }
    else
    {
        while($row=sqlsrv_fetch_array($r))
        {
            $utente["id_utente"]=$row["id_utente"];
            $utente["username"]=$row["username"];
            
            array_push($utenti,$utente);
        }
    }

    echo json_encode($utenti);

?>