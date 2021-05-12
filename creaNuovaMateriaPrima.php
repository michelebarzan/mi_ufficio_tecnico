<?php

    include "Session.php";
    $database="mi_db_tecnico";
    include "connessioneDb.php";

	$codice_materia_prima=str_replace("'","''",$_REQUEST["codice_materia_prima"]);
    $tabella=$_REQUEST["tabella"];
    $colonna=$_REQUEST["colonna"];
	
	$stmt = sqlsrv_query( $conn, "SELECT * FROM (SELECT codice_materia_prima FROM materie_prime UNION SELECT codice_materia_prima_s FROM materie_prime_s) AS t WHERE codice_materia_prima='$codice_materia_prima'");

	if($stmt)
	{
		$rows = sqlsrv_has_rows( $stmt );
		if ($rows === true)
			die("duplicato");
		else 
		{
			if($tabella=="materie_prime")
				$q="INSERT INTO [$tabella] ([$colonna],peso_validato) VALUES ('$codice_materia_prima','false')";
			else
				$q="INSERT INTO [$tabella] ([$colonna]) VALUES ('$codice_materia_prima')";
			$r=sqlsrv_query($conn,$q);
			if($r===FALSE)
			{
				die("error");
			}
		}
	}

?>