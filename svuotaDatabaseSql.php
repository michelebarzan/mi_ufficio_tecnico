<?php

    set_time_limit(3000);

	$sql_server_username=$_REQUEST["sql_server_username"];
	$sql_server_password=$_REQUEST["sql_server_password"];
	$sql_server_ip=$_REQUEST["sql_server_ip"];
    $database="mi_db_tecnico";
    include "connessioneDbServer.php";

    $q="EXEC svuota_database_sql";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error");
    }

?>