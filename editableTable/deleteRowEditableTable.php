
<?php

	include "connection.php";
	
	$table=$_REQUEST['table'];
	$primaryKey=$_REQUEST['primaryKey'];
	$primaryKeyValue=$_REQUEST['primaryKeyValue'];
	
	$queryRighe="DELETE [$table] FROM [$table] WHERE [$primaryKey]='$primaryKeyValue'";
	$resultRighe=sqlsrv_query($conn,$queryRighe);
	if($resultRighe==FALSE)
	{
		/*echo "<br><br>Errore esecuzione query<br>Query: ".$queryRighe."<br>Errore: ";
		die(print_r(sqlsrv_errors(),TRUE));*/
		echo "error";
	}
?>