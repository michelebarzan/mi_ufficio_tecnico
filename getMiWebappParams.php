<?php
	$mi_webapp_params_file = fopen("C:\mi_webapp_params.json", "r") or die("error");
	echo fread($mi_webapp_params_file,filesize("C:\mi_webapp_params.json"));
	fclose($mi_webapp_params_file);
?>