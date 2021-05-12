<?php

    include "Session.php";
    include "connessione.php";

    $id_materiale=$_REQUEST["id_materiale"];
    $raggruppamento=$_REQUEST["raggruppamento"];

    $q="UPDATE dbo.anagrafica_materiali SET raggruppamento=$raggruppamento WHERE id_materiale=$id_materiale";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error".$q);
    }

?>