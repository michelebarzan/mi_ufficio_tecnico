<?php

    include "Session.php";
    include "connessione.php";

    $id_richiesta=$_REQUEST["id_richiesta"];

    $q="INSERT INTO [dbo].[dettagli_richieste_materiali_calcolo_fabbisogno]
            ([materiale]
            ,[qnt]
            ,[richiesta])
        VALUES (NULL,0,$id_richiesta)";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error".$q);
    }

?>