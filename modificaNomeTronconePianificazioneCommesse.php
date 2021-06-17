<?php

    $database="mi_pianificazione";
    include "connessioneDb.php";

    $nome=$_REQUEST["nome"];
    $id_troncone=$_REQUEST["id_troncone"];

    $q3="UPDATE dbo.anagrafica_tronconi SET nome='$nome' WHERE (id_troncone = $id_troncone)";
    $r3=sqlsrv_query($conn,$q3);
    if($r3==FALSE)
    {
        die("error");
    }
    
?>