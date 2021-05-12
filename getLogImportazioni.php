
<?php

    include "connessione.php";
    include "Session.php";

    $logImportazioni=[];

    $q="SELECT TOP(1000) log_importazioni_database.*,utenti.username FROM [dbo].[log_importazioni_database],utenti WHERE log_importazioni_database.utente=utenti.id_utente ORDER BY [data] DESC";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error");
    }
    else
    {
        while($row=sqlsrv_fetch_array($r))
        {
            $logImportazione["id_importazione"]=$row["id_importazione"];
            $logImportazione["database"]=$row["database"];
            $logImportazione["utente"]=$row["username"];
            $logImportazione["data"]=$row["data"]->format("d/m/Y H:i:s");
            $logImportazione["risultato"]=$row["risultato"];
            
            array_push($logImportazioni,$logImportazione);
        }
        echo json_encode($logImportazioni);
    }

?>