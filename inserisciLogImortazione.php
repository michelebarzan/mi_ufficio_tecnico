
<?php

    include "connessione.php";
    include "Session.php";

    $databases=json_decode($_REQUEST["JSONdatabases"]);
    $risultato=$_REQUEST["risultato"];

    $q="INSERT INTO [dbo].[log_importazioni_database]
            ([database]
            ,[utente]
            ,[data]
            ,[risultato])
        VALUES
        (
            '".implode(",",$databases)."'
            ,".$_SESSION['id_utente']."
            ,GETDATE()
            ,'$risultato'
        )";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error");
    }
    else
    {
        echo "ok";
    }

?>