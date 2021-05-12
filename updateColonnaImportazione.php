<?php

    ini_set('memory_limit', '-1');
    set_time_limit(3000);

    $database="mi_db_tecnico";
    include "connessioneDb.php";

    $tabelle=json_decode($_REQUEST["JSONanagrafiche"]);

    foreach ($tabelle as $tabella)
    {
        $q1="UPDATE [dbo].[$tabella] SET importazione='in_corso'";
        $r1=sqlsrv_query($conn,$q1);
        if($r1==FALSE)
            die("error");
    }

?>