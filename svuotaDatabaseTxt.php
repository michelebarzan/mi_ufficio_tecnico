<?php

    ini_set('memory_limit', '-1');
    set_time_limit(3000);

    $database="mi_db_tecnico";
    include "connessioneDb.php";

    $q="EXEC svuota_database_txt";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error");
    }

?>