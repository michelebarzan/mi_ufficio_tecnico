<?php

    include "connessione.php";
    include "Session.php";

    $table=$_REQUEST["tabella"];
    $database=$_REQUEST["database"];

    $mi_webapp_params_file = fopen("C:\mi_webapp_params.json", "r") or die("error");
	$mi_webapp_params=json_decode(fread($mi_webapp_params_file,filesize("C:\mi_webapp_params.json")), true);
	fclose($mi_webapp_params_file);
    $sql_server_ip=$mi_webapp_params['sql_server_info']['ip'];

    /*if($database=="newpan")
        $fileTabella = "//10.28.25.1/GrpMI/Ut/PARETI/NEWPAN/regdef/$table";
    else
        $fileTabella = "//10.28.25.1/GrpMI/$database/regdef/$table";*/
    $fileTabella = "C:/mi_db_tecnico/$database/regdef/".$table.".txt";

    $fileSizeTabella=filesize($fileTabella);
    $fileSizeTmp=filesize("\\\\$sql_server_ip\\mi_webapp_help\\importaTxt\\tmp.txt");

    $percentuale=($fileSizeTmp*100)/$fileSizeTabella;
    if($percentuale>100)
        $percentuale=100;

    echo $percentuale;

?>