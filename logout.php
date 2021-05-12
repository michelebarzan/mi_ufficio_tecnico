<?php
	$mi_webapp_params_file = fopen("C:\mi_webapp_params.json", "r") or die("error");
	$mi_webapp_params=json_decode(fread($mi_webapp_params_file,filesize("C:\mi_webapp_params.json")), true);
	fclose($mi_webapp_params_file);

	session_start();
	$_SESSION=array();
	session_destroy();
	$hour = time() + 3600 * 24 * 30;
	setcookie('username',"no", $hour);
	setcookie('password', "no", $hour);
	header("Location: ".$mi_webapp_params['web_server_info']['protocol']."://".$mi_webapp_params['web_server_info']['name'].":".$mi_webapp_params['web_server_info']['port']."/mi_login/login.html");
?>