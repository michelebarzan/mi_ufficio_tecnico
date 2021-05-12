<?php

    include "connessione.php";
    include "Session.php";

    set_time_limit(90000);

    $query2="SELECT utenti.username FROM utente_importa_dati,utenti WHERE utente_importa_dati.utente=utenti.id_utente";	
    $result2=sqlsrv_query($conn,$query2);
    if($result2==TRUE)
    {
        $utente="";
        $rows = sqlsrv_has_rows( $result2 );
        if ($rows === true)
        {
            while($row2=sqlsrv_fetch_array($result2))
            {
                $utente=$row2["username"];
            }
            echo json_encode($utente);
        }
        else 
            echo json_encode(false);
    }

?>