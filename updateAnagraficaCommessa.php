<?php

    include "Session.php";
    include "connessione.php";

    $id_commessa=$_REQUEST["id_commessa"];
    $nome=str_replace("'","''",$_REQUEST["nome"]);
    $descrizione=str_replace("'","''",$_REQUEST["descrizione"]);

    $q="UPDATE [dbo].[anagrafica_commesse] SET descrizione='$descrizione' WHERE id_commessa=$id_commessa";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error".$q);
    }

?>