<?php

    include "connessione.php";

	$q="EXEC [dbo].[allineaMateriePrimeDbTecnico]";
	$r=sqlsrv_query($conn,$q);
	if($r==FALSE)
	{
		die("error".$q);
	}

?>