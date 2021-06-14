<?php

    $database="mi_pianificazione";
    include "connessioneDb.php";

    $id_attivita=$_REQUEST["id_attivita"];

    $q="DELETE FROM dbo.anagrafica_attivita WHERE id_attivita=$id_attivita";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error".$q);
    }

?>