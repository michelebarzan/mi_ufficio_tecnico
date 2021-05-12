<?php

	include "connection.php";
	
	$table=$_REQUEST['table'];	
	$columns=[];
	$dataTypes=[];
	
	$primaryKey=getPrimaryKey($conn,$table);
	
	$query1="SELECT *
			FROM mi_webapp.INFORMATION_SCHEMA.COLUMNS
			WHERE TABLE_NAME = N'$table'";	
	$result1=sqlsrv_query($conn,$query1);
	if($result1==FALSE)
	{
		echo "<br><br>Errore esecuzione query<br>Query: ".$query1."<br>Errore: ";
		die(print_r(sqlsrv_errors(),TRUE));
	}
	else
	{
		while($row=sqlsrv_fetch_array($result1))
		{
			array_push($columns,$row["COLUMN_NAME"]);
			$dataTypes[$row["COLUMN_NAME"]]=$row["DATA_TYPE"];
		}
	}
	
	echo json_encode($columns);
	echo "|";
	echo $primaryKey;
	echo "|";
	echo json_encode($dataTypes);
	
	function getPrimaryKey($conn,$table)
	{
		$queryRighe="SELECT OBJECT_NAME(ic.object_id) AS [table], COL_NAME(ic.object_id, ic.column_id) AS primary_key
					FROM sys.indexes AS i INNER JOIN
					sys.index_columns AS ic ON i.object_id = ic.object_id AND i.index_id = ic.index_id
					WHERE (i.is_primary_key = 1) AND (OBJECT_NAME(ic.object_id) = '$table')";
		$resultRighe=sqlsrv_query($conn,$queryRighe);
		if($resultRighe==FALSE)
		{
			echo "<br><br>Errore esecuzione query<br>Query: ".$queryRighe."<br>Errore: ";
			die(print_r(sqlsrv_errors(),TRUE));
		}
		else
		{
			while($rowRighe=sqlsrv_fetch_array($resultRighe))
			{
				return $rowRighe["primary_key"];
			}
		}
		return null;
	}
	
?>