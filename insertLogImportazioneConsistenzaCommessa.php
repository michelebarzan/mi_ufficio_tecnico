<?php

    include "Session.php";
    include "connessione.php";

    $commessa=$_REQUEST["commessa"];
    $response=$_REQUEST["response"];

    $q="INSERT INTO [dbo].[log_importazioni_consistenza_commessa] ([commessa],[utente],[data],[risultato]) VALUES ('$commessa',".$_SESSION['id_utente'].",GETDATE(),'$response')";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error".$q);
    }

?>