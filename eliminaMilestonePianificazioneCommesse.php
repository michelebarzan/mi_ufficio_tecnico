<?php

    $database="mi_pianificazione";
    include "connessioneDb.php";

    $id_milestone=$_REQUEST["id_milestone"];

    $q="DELETE FROM anagrafica_milestones WHERE id_milestone=$id_milestone";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error");
    }

?>