<?php

    include "Session.php";
    include "connessione.php";

    $commessa=$_REQUEST["commessa"];
    $gruppo=$_REQUEST["gruppo"];
    $materiale=$_REQUEST["materiale"];
    $qnt=$_REQUEST["qnt"];
    $altezza_sviluppo=$_REQUEST["altezza_sviluppo"];
    if($altezza_sviluppo=="")
        $altezza_sviluppo="NULL";
    $note=$_REQUEST["note"];

    $q="INSERT INTO [dbo].[materiali_calcolo_fabbisogno]
                    ([commessa]
                    ,[gruppo]
                    ,[materiale]
                    ,[qnt]
                    ,[altezza_sviluppo]
                    ,[origine]
                    ,[dataOra]
                    ,[note])
                    VALUES
                    (".$commessa."
                    ,".$gruppo."
                    ,".$materiale."
                    ,".$qnt."
                    ,".$altezza_sviluppo."
                    ,'manuale'
                    ,GETDATE()
                    ,'$note')";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error".$q);
    }

?>