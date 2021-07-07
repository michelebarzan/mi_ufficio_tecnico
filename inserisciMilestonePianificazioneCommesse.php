<?php

    $database="mi_pianificazione";
    include "connessioneDb.php";

    $prima_dopo=$_REQUEST["prima_dopo"];
    $milestone_principale=$_REQUEST["milestone_principale"];
    $settimane=$_REQUEST["settimane"];
    $nome=str_replace("'","",$_REQUEST["nome"]);
    $descrizione=str_replace("'","''",$_REQUEST["descrizione"]);

    $q7="INSERT INTO [dbo].[anagrafica_milestones] ([nome],[descrizione],[settimane],[prima_dopo],[milestone_principale])
        VALUES ('$nome','$descrizione',$settimane,'$prima_dopo',$milestone_principale)";
    $r7=sqlsrv_query($conn,$q7);
    if($r7==FALSE)
    {
        die("error".$q7);
    }
    
?>