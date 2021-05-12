<?php
	$mi_webapp_params_file = fopen("C:\mi_webapp_params.json", "r") or die("error");
	$mi_webapp_params=json_decode(fread($mi_webapp_params_file,filesize("C:\mi_webapp_params.json")), true);
	fclose($mi_webapp_params_file);

	$connectionInfo=array("Database"=>$database, "UID"=>$mi_webapp_params['sql_server_info']['username'], "PWD"=>$mi_webapp_params['sql_server_info']['password']);
	$conn = sqlsrv_connect($mi_webapp_params['sql_server_info']['ip'],$connectionInfo);
	if(!$conn)
		die("error");
?>