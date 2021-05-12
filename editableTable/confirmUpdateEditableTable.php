
<?php

	include "connection.php";
	
	$updateValuesAndIndices=json_decode($_REQUEST['JSONupdateValuesAndIndices']);
	$table=$_REQUEST['table'];
	$primaryKey=$_REQUEST['primaryKey'];
	$primaryKeyValue=$_REQUEST['primaryKeyValue'];
	
	set_time_limit(240);
	
	$queryRighe="UPDATE [$table] SET ";
	foreach ($updateValuesAndIndices as $key => $value)
	{
		$queryRighe.="[$key]='$value',";
	}
	$queryRighe=substr($queryRighe, 0, -1);
	$queryRighe.=" WHERE [$primaryKey]='$primaryKeyValue'";
	$resultRighe=sqlsrv_query($conn,$queryRighe);
	if($resultRighe==FALSE)
	{
		echo "error:";
		if( ($errors = sqlsrv_errors() ) != null)  
		  {  
			 foreach( $errors as $error)  
			 {  
				//echo "SQLSTATE: ".$error[ 'SQLSTATE']."\n";  
				echo "|".$error[ 'code'];  
				//echo "message: ".$error[ 'message']."\n";  
			 }  
		  } 
		  /*echo "Errore esecuzione query<br>Query: ".$queryRighe."<br>Errore: ";
								die(print_r(sqlsrv_errors(),TRUE));*/
	}
?>