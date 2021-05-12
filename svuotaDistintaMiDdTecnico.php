<?php

    ini_set('memory_limit', '-1');
    set_time_limit(3000);

    $tabella=$_REQUEST["tabella"];

    $start = microtime(true);

    $result["tabella"]=$tabella;

	$sql_server_username="servizio_globale_sa";
	$sql_server_password="Serglo123";
	$sql_server_ip="10.128.150.60";
    $database="mi_db_tecnico";
    include "connessioneDbServer.php";
	
    $q="DELETE FROM $tabella";
    $r=sqlsrv_query($conn,$q);
    $result["query"]=$q;
    if($r==FALSE)
    {
        $result["result"]="error";
        $result["rows"]=0;
    }
    else
    {
        $rows = sqlsrv_rows_affected( $r);
        if( $rows === false)
			$result["rows"]=0;
		elseif( $rows == -1)
			$result["rows"]=0;
		else
			$result["rows"]=intval($rows);
			
		$sql_server_username="sa";
		$sql_server_password="Serglo123";
		$sql_server_ip="10.128.151.62";
		$database="mi_db_tecnico";
		include "connessioneDbServer.php";
		
		$q2="DELETE FROM $tabella";
		$r2=sqlsrv_query($conn,$q2);
		$result["query"]=$q2;
		if($r2==FALSE)
		{
			$result["result"]="error";
			$result["rows"]=0;
		}
		else
		{
			$result["result"]="ok";
			$rows2 = sqlsrv_rows_affected( $r2);
			if( $rows2 === false)
				$result["rows"]=false;
			elseif( $rows2 == -1)
				$result["rows"]=false;
			else
				$result["rows"]+=intval($rows2);
		}
    }

    $time_elapsed_secs = microtime(true) - $start;
    $time_elapsed_secs = number_format($time_elapsed_secs,1);

    $result["time_elapsed_secs"]=$time_elapsed_secs;
    echo json_encode($result);

?>