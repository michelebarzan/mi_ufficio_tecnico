<?php
	$connectionInfo=array("Database"=>$database, "UID"=>$sql_server_username, "PWD"=>$sql_server_password);
	$conn = sqlsrv_connect($sql_server_ip,$connectionInfo);
	if(!$conn)
		die("error");
?>