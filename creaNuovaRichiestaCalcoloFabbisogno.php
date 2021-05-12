<?php

    include "Session.php";
    include "connessione.php";

    $commessa=$_REQUEST["commessa"];

    $q="INSERT INTO [dbo].[richieste_materiali_calcolo_fabbisogno]
            ([utente]
            ,[dataOra]
            ,[stato]
            ,[commessa])
        VALUES
            (".$_SESSION['id_utente']."
            ,GETDATE()
            ,'Aperta'
            ,$commessa)";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error".$q);
    }
    else
    {
        $q2="SELECT MAX(id_richiesta) AS id_richiesta FROM richieste_materiali_calcolo_fabbisogno WHERE utente=".$_SESSION['id_utente'];
        $r2=sqlsrv_query($conn,$q2);
        if($r==FALSE)
        {
            die("error".$q2);
        }
        else
        {
            while($row2=sqlsrv_fetch_array($r2))
            {
                echo $row2["id_richiesta"];
            }
        }
    }

?>