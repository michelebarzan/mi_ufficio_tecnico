<?php

    $database="mi_pianificazione";
    include "connessioneDb.php";

    $id_milestone_principale=$_REQUEST["id_milestone_principale"];
    $anno=$_REQUEST["anno"];
    $settimana=$_REQUEST["settimana"];

    $q3="UPDATE dbo.milestones_principali SET anno=$anno,settimana=$settimana WHERE (id_milestone_principale = $id_milestone_principale)";
    $r3=sqlsrv_query($conn,$q3);
    if($r3==FALSE)
    {
        die("error");
    }
    
?>