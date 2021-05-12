
<?php

	include "connection.php";
	
	$insertValuesAndIndices=json_decode($_REQUEST['JSONinsertValuesAndIndices']);
	$foreignKeys=json_decode($_REQUEST['JSONforeignKeys']);
	$table=$_REQUEST['table'];
	
	set_time_limit(240);
	
	$queryRighe="INSERT INTO [$table] (";
	foreach ($insertValuesAndIndices as $key => $value)
	{
		$queryRighe.="[$key],";
	}
	$queryRighe=substr($queryRighe, 0, -1);
	$queryRighe.=") VALUES (";
	foreach ($insertValuesAndIndices as $key => $value)
	{
		foreach($foreignKeys as $foreignKey)
		{
			$arrayForeignKey = json_decode(json_encode($foreignKey), True);
			if (in_array($key, $arrayForeignKey))
			{
				$value=getDisplayColumnValue($conn,$key,$arrayForeignKey,$value);
			}
		}
		$queryRighe.="'$value',";
	}
	$queryRighe=substr($queryRighe, 0, -1);
	$queryRighe.=")";
	$resultRighe=sqlsrv_query($conn,$queryRighe);
	if($resultRighe==FALSE)
	{
		echo "error";
		if( ($errors = sqlsrv_errors() ) != null)  
		  {  
			 foreach( $errors as $error)  
			 {  
				//echo "SQLSTATE: ".$error[ 'SQLSTATE']."\n";  
				echo "|".$error[ 'code'];  
				//echo "message: ".$error[ 'message']."\n";  
			 }  
		  } 
	}
	
	function getDisplayColumnValue($conn,$key,$arrayForeignKey,$value)
	{
		$queryRighe="SELECT TOP(1) [".$arrayForeignKey[2]."] FROM [".$arrayForeignKey[1]."] WHERE [".$arrayForeignKey[3]."]='$value'";
		$resultRighe=sqlsrv_query($conn,$queryRighe);
		if($resultRighe==FALSE)
		{
			echo "error";
			if( ($errors = sqlsrv_errors() ) != null)  
			  {  
				 foreach( $errors as $error)  
				 {  
					//echo "SQLSTATE: ".$error[ 'SQLSTATE']."\n";  
					echo "code: ".$error[ 'code']."\n";  
					//echo "message: ".$error[ 'message']."\n";  
				 }  
			  } 
		}
		else
		{
			while($rowRighe=sqlsrv_fetch_array($resultRighe))
			{
				return $rowRighe[$arrayForeignKey[2]];
			}
		}
	}
?>