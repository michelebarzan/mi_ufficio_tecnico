<?php

	include "connection.php";
	
	$columns=json_decode($_REQUEST['JSONcolumns']);
	$readOnlyColumns=json_decode($_REQUEST['JSONreadOnlyColumns']);
	$foreignKeys=json_decode($_REQUEST['JSONforeignKeys']);
	$noFilterColumns=json_decode($_REQUEST['JSONnoFilterColumns']);
	$table=$_REQUEST['table'];
	$primaryKey=$_REQUEST['primaryKey'];
	$orderBy=$_REQUEST['orderBy'];
	$orderType=$_REQUEST['orderType'];
	$editable=json_decode($_REQUEST['editable']);
	
	set_time_limit(240);
	
	$columnsDataTypes = array();
	$query1="SELECT COLUMN_NAME, DATA_TYPE
			FROM mi_webapp.INFORMATION_SCHEMA.COLUMNS
			WHERE TABLE_NAME = N'$table'";	
	$result1=sqlsrv_query($conn,$query1);
	if($result1==FALSE)
	{
		echo "<br><br>Errore esecuzione query 1<br>Query: ".$query1."<br>Errore: ";
		die(print_r(sqlsrv_errors(),TRUE));
	}
	else
	{
		while($row=sqlsrv_fetch_array($result1))
		{
			$columnsDataTypes[$row["COLUMN_NAME"]]=$row["DATA_TYPE"];
		}
	}
	$queryRighe="SELECT ";

	foreach ($columns as $column)
	{
		$queryRighe.="CONVERT (VARCHAR(MAX),[$column]) AS [$column],";
	}
	$queryRighe=substr($queryRighe, 0, -1);
	$queryRighe.=" FROM [$table] ORDER BY [$orderBy] $orderType";
		
	$resultRighe=sqlsrv_query($conn,$queryRighe);
	if($resultRighe==FALSE)
	{
		echo "<br><br>Errore esecuzione query 2<br>Query: ".$queryRighe."<br>Errore: ";
		die(print_r(sqlsrv_errors(),TRUE));
	}
	else
	{
		echo "<table id='myTable$table' class='editableTable'>";
			echo "<tr>";
				foreach ($columns as $column)
				{
					$foreignKeyColumn="";
					$externalTable="";
					$references="";
					$column2="";
					foreach($foreignKeys as $foreignKey)
					{
						$arrayForeignKey = json_decode(json_encode($foreignKey), True);
						if($arrayForeignKey[0]==$column)
						{
							$foreignKeyColumn=$arrayForeignKey[0];
							$externalTable=$arrayForeignKey[1];
							$references=$arrayForeignKey[2];
							$column2=$arrayForeignKey[3];
						}
					}
					echo '<th style="border-right:none" class="editableTableColumnNameTh">';
						echo $column;
					echo '</th>';
					echo '<th style="border-left:none" class="editableTableFilterTh">';
					$visibility="";
					if (in_array($column, $noFilterColumns))
						$visibility="visibility:hidden";
						echo '<i style="cursor:pointer;float:right;'.$visibility.'" class="fal fa-filter btnFilter" id="editableTableBtnFilter'.$column.'" onclick="openContextMenu(event,'.htmlspecialchars(json_encode($column)).')"></i>';
						echo '<div id="filterMenuEditableTable'.$column.'" class="filterMenuEditableTable">';
							echo '<div class="filterMenuEditableTableRow" style="border-bottom:1px solid #ddd;font-weight:bold">'.$column.'</div>';
							echo '<button class="filterMenuEditableTableButton" onclick="getTable('.htmlspecialchars(json_encode($table)).','.htmlspecialchars(json_encode($column)).','.htmlspecialchars(json_encode("desc")).');">';
								echo '<i class="far fa-sort-amount-up" style="margin-right:5px"></i>Ordinamento decrescente';
							echo '</button>';
							echo '<button class="filterMenuEditableTableButton" onclick="getTable('.htmlspecialchars(json_encode($table)).','.htmlspecialchars(json_encode($column)).','.htmlspecialchars(json_encode("asc")).');">';
								echo '<i class="far fa-sort-amount-down" style="margin-right:5px"></i>Ordinamento crescente';
							echo '</button>';
							echo '<div class="filterMenuEditableTableRow" style="border-top:1px solid #ddd;font-weight:bold">Filtra</div>';
							echo '<div class="filterMenuEditableTableRow">';
								echo '<input type="search" class="editableTableSearcFilters" id="searcFilters'.$column.'" onkeyup="searcFilters('.htmlspecialchars(json_encode("searcFilters$column")).','.htmlspecialchars(json_encode("filterMenuEditableTableFilterContainer$column")).','.htmlspecialchars(json_encode("$column")).')" onsearch="searcFilters('.htmlspecialchars(json_encode("searcFilters$column")).','.htmlspecialchars(json_encode("filterMenuEditableTableFilterContainer$column")).','.htmlspecialchars(json_encode("$column")).')" onclick="searcFilters('.htmlspecialchars(json_encode("searcFilters$column")).','.htmlspecialchars(json_encode("filterMenuEditableTableFilterContainer$column")).','.htmlspecialchars(json_encode("$column")).')" placeholder="Cerca..." >';
								echo '<div class="filterMenuEditableTableFilterContainer" id="filterMenuEditableTableFilterContainer'.$column.'">';
									getEditableTableCheckBoxList($conn,$column,$table,$foreignKeyColumn,$externalTable,$references,$columnsDataTypes,$column2);
								echo '</div>';
							echo '</div>';
							echo '<div class="filterMenuEditableTableRow"  style="margin-top:5px;margin-bottom:5px">';
								echo "<button style='float:left;' onclick='getFilters();filterTable(".htmlspecialchars(json_encode($table)).");closeContextMenu()'>Conferma</button>";
								echo "<button style='float:right;' onclick='closeContextMenu()'>Annulla</button>";
							echo '</div>';
						echo '</div>';
					echo '</th>';
				}
				if($editable)
					echo "<th colspan='2' style='text-align:center'><i class='far fa-plus btnAddRecordEditableTable' onclick='insertNewRow(".htmlspecialchars(json_encode($table)).")'></i></th>";
			echo "</tr>";
			$i=1;
			while($rowRighe=sqlsrv_fetch_array($resultRighe))
			{
				echo "<tr id='editableTableRow$i' class='editableTableRow'>";
					foreach ($columns as $column) 
					{
						/*if($columnsDataTypes[$column]=="date" || $columnsDataTypes[$column]=="datetime")
							$value=$rowRighe[$column]->format('d/m/Y');
						else*/
						$value=$rowRighe[$column];
						$foreignKeyColumn="";
						$externalTable="";
						$references="";
						$column2="";
						foreach($foreignKeys as $foreignKey)
						{
							$arrayForeignKey = json_decode(json_encode($foreignKey), True);
							if($arrayForeignKey[0]==$column)
							{
								$foreignKeyColumn=$arrayForeignKey[0];
								$externalTable=$arrayForeignKey[1];
								$references=$arrayForeignKey[2];
								$column2=$arrayForeignKey[3];
								$value=getDisplayColumnValue($conn,$column2,$foreignKeyColumn,$externalTable,$references,$value,$column2);
							}
						}
						/*if($columnsDataTypes[$column]=="date" || $columnsDataTypes[$column]=="datetime")
						{
							$value=DateTime::createFromFormat('d/m/Y', $value);
							//$value=$value->format("d/m/Y");
						}*/
						$value=str_replace("  "," ",$value);
						echo "<td colspan='2'>".$value."</td>";
					}
					if($editable)
					{
						echo "<td id='buttonColumn$i' colspan='2' style='min-width: 40px;max-width: 40px;overflow: hidden;white-space: nowrap;text-align:center;'>";
							echo '<i class="far fa-edit btnEditEditableTable" title="Modifica" onclick="setRowEditable('.htmlspecialchars(json_encode($primaryKey)).','.$i.','.htmlspecialchars(json_encode($table)).','.htmlspecialchars(json_encode($rowRighe[$primaryKey])).')"></i>';
							echo '<i class="far fa-trash btnDeleteEditableTable" title="Elimina" onclick="deleteRow('.htmlspecialchars(json_encode($primaryKey)).','.htmlspecialchars(json_encode($table)).','.htmlspecialchars(json_encode($rowRighe[$primaryKey])).','.$i.')"></i>';
						echo "</td>";
					}
				echo "</tr>";
				$i++;
			}
		echo "</table>";
	}

	function getEditableTableCheckBoxList($conn,$column,$table,$foreignKeyColumn,$externalTable,$references,$columnsDataTypes,$column2)
	{
		echo '<label class="filterMenuEditableTableCheckboxContainer filterMenuEditableTableCheckboxContainer'.$column.'">Tutti';
			echo '<input type="checkbox" onclick="checkCheckboxes('.htmlspecialchars(json_encode($column)).')" id="filterMenuEditableTableCheckboxAll'.$column.'" checked="checked">';
			echo '<span class="filterMenuEditableTableCheckboxCheckmark"></span>';
		echo '</label>';
		$queryRighe="SELECT DISTINCT [$column] FROM [$table] ORDER BY [$column]";
		$resultRighe=sqlsrv_query($conn,$queryRighe);
		if($resultRighe==FALSE)
		{
			echo "<br><br>Errore esecuzione query 3<br>Query: ".$queryRighe."<br>Errore: ";
			die(print_r(sqlsrv_errors(),TRUE));
		}
		else
		{
			while($rowRighe=sqlsrv_fetch_array($resultRighe))
			{
				if($foreignKeyColumn=="")
				{
					$value=$rowRighe[$column];
					if($columnsDataTypes[$column]=="date")
						$value=$rowRighe[$column]->format('M d Y');
					if($columnsDataTypes[$column]=="datetime")
						$value=$rowRighe[$column]->format('M d Y h:iA');
						
					if($value!='0')
					{
						if($value==null)
							$value="NULL";
					}
					$labelNoSpaces=str_replace(" ","",$value);
					echo '<label class="filterMenuEditableTableCheckboxContainer filterMenuEditableTableCheckboxContainer'.$column.'">'.$value;
						echo '<input type="checkbox" id="checkboxFilterTableSPLITCHAR'.$column.'SPLITCHAR'.$labelNoSpaces.'" onchange="checkCheckboxAll('.htmlspecialchars(json_encode($column)).')" fieldValue="'.$value.'" class="filterMenuEditableTableCheckbox'.$column.'" checked="checked">';
						echo '<span class="filterMenuEditableTableCheckboxCheckmark"></span>';
					echo '</label>';
				}
				else
				{
					$value=getDisplayColumnValue($conn,$column,$foreignKeyColumn,$externalTable,$references,$rowRighe[$column],$column2);
					$value=str_replace("  "," ",$value);
					$labelNoSpaces=str_replace(" ","",$value);
					echo '<label class="filterMenuEditableTableCheckboxContainer filterMenuEditableTableCheckboxContainer'.$column.'">'.$value;
						echo '<input type="checkbox" id="checkboxFilterTable'.$column.''.$labelNoSpaces.'" onchange="checkCheckboxAll('.htmlspecialchars(json_encode($column)).')" fieldValue="'.$value.'" class="filterMenuEditableTableCheckbox'.$column.'" checked="checked">';
						echo '<span class="filterMenuEditableTableCheckboxCheckmark"></span>';
					echo '</label>';

				}
			}
		}
	}
	
	function getDisplayColumnValue($conn,$column,$foreignKeyColumn,$externalTable,$references,$value,$column2)
	{
		$queryRighe="SELECT TOP(1) [$column2] FROM [$externalTable] WHERE [$references]='$value' ORDER BY [$column2]";
		$resultRighe=sqlsrv_query($conn,$queryRighe);
		if($resultRighe==FALSE)
		{
			echo "<br><br>Errore esecuzione query 4<br>Query: ".$queryRighe."<br>Errore: ";
			die(print_r(sqlsrv_errors(),TRUE));
		}
		else
		{
			while($rowRighe=sqlsrv_fetch_array($resultRighe))
			{
				return $rowRighe[$column2];
			}
		}
	}
	
	
?>