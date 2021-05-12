<?php

    include "Session.php";
    $database="mi_db_tecnico";
    include "connessioneDb.php";

    $nome=str_replace("'","''",$_REQUEST["nome"]);
	
	$stmt = sqlsrv_query( $conn, "SELECT * FROM raggruppamenti_materie_prime WHERE nome='$nome'");

	if($stmt)
	{
		$rows = sqlsrv_has_rows( $stmt );
		if ($rows === true)
			die("duplicato");
		else 
		{
			$q="INSERT INTO raggruppamenti_materie_prime (nome) VALUES ('$nome')";
			$r=sqlsrv_query($conn,$q);
			if($r===FALSE)
			{
				die("error");
			}
		}
	}

?>