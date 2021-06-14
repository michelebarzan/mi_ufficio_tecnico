<?php

    $database="mi_pianificazione";
    include "connessioneDb.php";

    $nome=str_replace("'","",$_REQUEST["nome"]);
    $descrizione=str_replace("'","''",$_REQUEST["descrizione"]);
    $macro_attivita=$_REQUEST["macro_attivita"];

    $q="INSERT INTO [dbo].[anagrafica_attivita] ([nome],[descrizione],[macro_attivita])
        VALUES ('$nome','$descrizione',$macro_attivita)";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error");
    }

?>