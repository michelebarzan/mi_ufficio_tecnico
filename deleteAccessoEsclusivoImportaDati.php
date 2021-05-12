<?php

    include "connessione.php";
    include "Session.php";

    set_time_limit(90000);

    $query2="DELETE FROM utente_importa_dati";	
    $result2=sqlsrv_query($conn,$query2);
    if($result2==TRUE)
    {
        
    }
    else
        die("error");

?>