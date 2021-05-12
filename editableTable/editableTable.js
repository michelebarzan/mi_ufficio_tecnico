var columns=[];
var dataTypes=[];
var inValues={};
var inValuesAll={};
var checkboxId=[];
var readOnlyColumns=[];
var noInsertColumns=[];
var foreignKeys=[];
var noFilterColumns=[];
var rowCells=[];;
var editableTableHeaders=[];
var selectetTable;

function getEditableTable()
{
	newCircleSpinner("Caricamento in corso...");
	
	var params=arguments[0];
	
	columns=[];
	dataTypes=[];
	inValues={};
	inValuesAll={};
	checkboxId=[];
	rowCells=[];
	editableTableHeaders=[];
	
	var table=params["table"];
	selectetTable=table;
	var primaryKey=params["primaryKey"];
	var container=params["container"];
	readOnlyColumns=params["readOnlyColumns"];
	noInsertColumns=params["noInsertColumns"];
	foreignKeys=params["foreignKeys"];
	noFilterColumns=params["noFilterColumns"];
	var editable=params["editable"];
	if(editable==null)
		editable=JSON.stringify(true);
	var orderBy=params["orderBy"];
	var orderType=params["orderType"];
	if(orderType==null)
		orderType="desc";
	
	if(noFilterColumns==null)
		noFilterColumns=[];
	if(noInsertColumns==null)
		noInsertColumns=[];
	if(foreignKeys==null)
		foreignKeys=[];
	if(readOnlyColumns==null)
		readOnlyColumns=[];
	
	$.post("editableTable/getTableColumns.php",
	{
		table
	},
	function(response, status)
	{
		if(status=="success")
		{
			//console.log(response);
			var columnsResponse=response.split("|")[0];
			var dataTypesResponse=response.split("|")[2];
			if(primaryKey==null || primaryKey=='')
				primaryKey=response.split("|")[1];
			if(primaryKey==null || primaryKey=='')
				window.alert("Fatal error\nNo primary key selected or found");
			else
			{
				if(orderBy==null)
					orderBy=primaryKey;
				
				columns = JSON.parse(columnsResponse);
				dataTypes=JSON.parse(dataTypesResponse);
				//console.log(dataTypes);
				var JSONcolumns=JSON.stringify(columns);
				var JSONreadOnlyColumns=JSON.stringify(readOnlyColumns);
				var JSONforeignKeys=JSON.stringify(foreignKeys);
				var JSONnoFilterColumns=JSON.stringify(noFilterColumns);
				columns.forEach(function(column) 
				{
					var all = document.getElementsByClassName("filterMenuEditableTableCheckbox"+column);
					for (var i = 0; i < all.length; i++) 
					{
						if(!all[i].checked)
							checkboxId.push(all[i].id);
					}
				});
				//console.log(checkboxId);
				$.post("editableTable/getEditableTable.php",
				{
					JSONnoFilterColumns,
					JSONcolumns,
					JSONreadOnlyColumns,
					JSONforeignKeys,
					table,
					primaryKey,
					editable,
					orderBy,
					orderType
				},
				function(response, status)
				{
					if(status=="success")
					{
						//console.log(response);
						document.getElementById(container).innerHTML=response;
						document.getElementById("myTable"+table).addEventListener("load", editableTableLoad());
						editableTableHeaders=[];
						var all=document.getElementsByClassName("editableTableColumnNameTh");
						for (var i = 0; i < all.length; i++) 
						{
							editableTableHeaders.push(all[i].innerHTML);
						}
						checkboxId.forEach(function(id) 
						{
							var column=id.split("SPLITCHAR")[1];
							document.getElementById(id).checked=false;
							checkCheckboxAll(column);
							//document.getElementById(id).onchange();
						});
						getFilters();
						filterTable(table);
						removeCircleSpinner();
					}
					else
						console.log(status);
				});
			}
		}
	});
}
function insertNewRow(table)
{
	var table2 = document.getElementById("myTable"+table);
	var row = table2.insertRow(1);
	var newIndex=(getTableRows(table))+1;
	row.setAttribute("id","editableTableRow"+newIndex);
	row.setAttribute("class","editableTableRow");
	for (var j = 0; j<columns.length; j++)
	{
		if(noInsertColumns.includes(columns[j]))
		{
			var cell = row.insertCell(j);
			cell.setAttribute("colspan","2");
			cell.innerHTML = '';
		}
		else
		{
			var cell = row.insertCell(j);
			cell.setAttribute("colspan","2");
			cell.innerHTML = '<input type="hidden" value="'+columns[j]+'"><textarea class="textareaEditEditableTable textareaEditEditableTableNewRow"></textarea>';
		}
	}
	var btnConfirm=document.createElement("i");
	btnConfirm.setAttribute("class","far fa-save btnConfirmEditableTable");
	btnConfirm.setAttribute("onclick","insertRecord('"+row+"','"+table+"',"+newIndex+")");
	btnConfirm.setAttribute("title","Inserisci record");
	var btnCancel=document.createElement("i");
	btnCancel.setAttribute("class","far fa-undo-alt btnCancelEditableTable");
	btnCancel.setAttribute("onclick","cancelInsert('"+table+"')");
	btnCancel.setAttribute("title","Annulla");

	var cell = row.insertCell(j);
	cell.appendChild(btnConfirm);
	cell.appendChild(btnCancel);
	cell.setAttribute("id","buttonColumn"+newIndex);
	cell.setAttribute("colspan","2");
	cell.setAttribute("style","min-width: 40px;max-width: 40px;overflow: hidden;white-space: nowrap;text-align:center;");
}
function cancelInsert(table)
{
	document.getElementById("myTable"+table).deleteRow(1);
}
function insertRecord(row,table,newIndex)
{
	var insertValuesAndIndices={};
	var all = document.getElementsByClassName("textareaEditEditableTableNewRow");
	for (var i = 0; i < all.length; i++) 
	{
		insertValuesAndIndices[all[i].parentElement.childNodes[0].value]=all[i].value;
	}
	var JSONinsertValuesAndIndices=JSON.stringify(insertValuesAndIndices);
	var JSONforeignKeys=JSON.stringify(foreignKeys);
	var oldRowButtons=document.getElementById("buttonColumn"+newIndex).innerHTML;
	newGridSpinner("","buttonColumn"+newIndex,"width:24px;margin:0","","");
	$.post("editableTable/insertRecordEditableTable.php",
	{
		table,
		JSONinsertValuesAndIndices,
		JSONforeignKeys
	},
	function(response, status)
	{
		if(status=="success")
		{
			if(response.indexOf("error")>-1)
			{
				if(response.split("|").includes("547"))
				{
					var errors=[];
					foreignKeys.forEach(function(foreignKey) 
					{
						errors.push(foreignKey[0]);
					});
					window.alert("Errore: controlla le colonne: "+errors.toString());
				}
				if(response.split("|").includes("515"))
					window.alert("Errore: controlla le colonne vuote");
				if(response.split("|").includes("245"))
					window.alert("Errore: controlla il formato dei dati inseriti");
				document.getElementById("buttonColumn"+newIndex).innerHTML='<i class="fas fa-exclamation"  title="Errore" style="color:red"></i>';
				setTimeout(function(){ document.getElementById("buttonColumn"+newIndex).innerHTML=oldRowButtons; }, 5000);
				console.log(response);
			}
			else
			{
				document.getElementById("buttonColumn"+newIndex).innerHTML='<i class="far fa-check" title="Record inserito"></i>';
				setTimeout(function(){ getTable(selectetTable); }, 500);
			}
		}
		else
			console.log(status);
	});
}
function setRowEditable(primaryKey,index,table,primaryKeyValue)
{
	rowCells=[];
	var table2 = document.getElementById("myTable"+table);
	var colNum=table2.rows[index].cells.length;
	for (var j = 0, col; col = table2.rows[index].cells[j]; j++)
	{
		var colName=editableTableHeaders[j];
		var colValue=col.innerHTML;
		rowCells.push(colValue);
		if(!readOnlyColumns.includes(colName))
		{
			if(j<(colNum-1))
			{
				col.innerHTML="<textarea class='textareaEditEditableTable'>"+colValue+"</textarea>";
			}
			else
			{
				var oldRowButtons=col.innerHTML;
				col.innerHTML="";
				var btnConfirm=document.createElement("i");
				btnConfirm.setAttribute("class","far fa-save btnConfirmEditableTable");
				btnConfirm.setAttribute("onclick","confirmUpdate("+index+",'"+table+"','"+oldRowButtons+"','"+primaryKey+"','"+primaryKeyValue+"')");
				btnConfirm.setAttribute("title","Salva modifiche");
				var btnCancel=document.createElement("i");
				btnCancel.setAttribute("class","far fa-undo-alt btnCancelEditableTable");
				btnCancel.setAttribute("onclick","cancelUpdate("+index+",'"+table+"','"+oldRowButtons+"')");
				btnCancel.setAttribute("title","Annulla");
				
				col.appendChild(btnConfirm);
				col.appendChild(btnCancel);
			}
		}
	} 
	//console.log(rowCells);
	rowCells.splice(-1,1);
	//rowCells.shift();
}
function deleteRow(primaryKey,table,primaryKeyValue,index)
{
	var oldRowButtons=document.getElementById("buttonColumn"+index).innerHTML;
	newGridSpinner("","buttonColumn"+index,"width:24px;margin:0","","");
	$.post("editableTable/deleteRowEditableTable.php",
	{
		table,
		primaryKey,
		primaryKeyValue
	},
	function(response, status)
	{
		if(status=="success")
		{
			if(response.indexOf("error")>-1)
			{
				document.getElementById("buttonColumn"+index).innerHTML='<i class="fas fa-exclamation"  title="Errore" style="color:red"></i>';
				setTimeout(function(){ document.getElementById("buttonColumn"+index).innerHTML=oldRowButtons; }, 5000);
				console.log(response);
			}
			else
			{
				document.getElementById("buttonColumn"+index).innerHTML='<i class="far fa-check" title="Record eliminato"></i>';
				setTimeout(function(){ getTable(selectetTable); }, 100);
			}
		}
		else
			console.log(status);
	});
}
function confirmUpdate(index,table,oldRowButtons,primaryKey,primaryKeyValue)
{
	var updateValuesAndIndices={};
	var table2 = document.getElementById("myTable"+table);
	for (var j = 0; j<(table2.rows[index].cells.length)-1; j++)
	{
		var colName=editableTableHeaders[j];
		if(!readOnlyColumns.includes(colName))
		{
			updateValuesAndIndices[editableTableHeaders[j]]=table2.rows[index].cells[j].childNodes[0].value;
		}
	}
	var JSONupdateValuesAndIndices=JSON.stringify(updateValuesAndIndices);
	var oldUpdateRowButtons=document.getElementById("buttonColumn"+index).innerHTML;
	newGridSpinner("","buttonColumn"+index,"width:24px;margin:0","","");
	$.post("editableTable/confirmUpdateEditableTable.php",
	{
		table,
		primaryKey,
		primaryKeyValue,
		JSONupdateValuesAndIndices
	},
	function(response, status)
	{
		if(status=="success")
		{
			//console.log(response);
			if(response.indexOf("error")>-1)
			{
				if(response.split("|").includes("547"))
				{
					var errors=[];
					foreignKeys.forEach(function(foreignKey) 
					{
						errors.push(foreignKey[0]);
					});
					window.alert("Errore: controlla le colonne: "+errors.toString());
				}
				if(response.split("|").includes("515"))
					window.alert("Errore: controlla le colonne vuote");
				if(response.split("|").includes("245"))
					window.alert("Errore: controlla il formato dei dati inseriti");
				document.getElementById("buttonColumn"+index).innerHTML='<i class="fas fa-exclamation"  title="Errore" style="color:red"></i>';
				setTimeout(function(){ document.getElementById("buttonColumn"+index).innerHTML=oldUpdateRowButtons; }, 5000);
				console.log(response);
			}
			else
			{
				for (var j = 0; j<editableTableHeaders.length; j++)
				{
					var colName=editableTableHeaders[j];
					if(!readOnlyColumns.includes(colName))
					{
						table2.rows[index].cells[j].innerHTML=table2.rows[index].cells[j].childNodes[0].value;
					}
				}
				document.getElementById("buttonColumn"+index).innerHTML='<i class="far fa-check" title="Modifiche salvate"></i>';
				setTimeout(function(){ document.getElementById("buttonColumn"+index).innerHTML=oldRowButtons; }, 5000);
			}
		}
		else
			console.log(status);
	});
}
function cancelUpdate(index,table,oldRowButtons)
{
	var table2 = document.getElementById("myTable"+table);
	var colNum=table2.rows[index].cells.length;
	for (var i = 0; i < rowCells.length; i++)
	{
		table2.rows[index].cells[i].innerHTML=rowCells[i];
	}
	table2.rows[index].cells[rowCells.length].innerHTML=oldRowButtons;
}
function resetFilters()
{
	columns.forEach(function(column) 
	{
		var all = document.getElementsByClassName("filterMenuEditableTableCheckbox"+column);
		for (var i = 0; i < all.length; i++) 
		{
			all[i].checked=true;
		}
	});
}
function getFilters()
{
	columns.forEach(function(column) 
	{
		if(!noFilterColumns.includes(column))
		{
			var values=[];
			var valuesAll=[];
			var all = document.getElementsByClassName("filterMenuEditableTableCheckbox"+column);
			for (var i = 0; i < all.length; i++) 
			{
				valuesAll.push(all[i].getAttribute("fieldValue"));
				if(all[i].checked)
				{
					var val=all[i].getAttribute("fieldValue").trim().toLowerCase();
					if(dataTypes[column]=="real")
						val=Math.round(val * 100) / 100;
					values.push(val);
				}
			}
			inValuesAll[column]=valuesAll;
			inValues[column]=values;
		}
	});
	checkActiveFilters();
}
function filterTable(table)
{
	var all = document.getElementsByClassName("editableTableRow");
	for (var i = 0; i < all.length; i++) 
	{
		all[i].style.display='';
	}
	var table2=document.getElementById("myTable"+table);
	for (var i = 1, row; row = table2.rows[i]; i++)
	{
		var j=0;
		columns.forEach(function(colonna)
		{
			if(!noFilterColumns.includes(colonna))
			{
				var cellValue=row.cells[j].innerHTML.trim().toLowerCase();
				if(cellValue=="")
					cellValue="null";
				
				if(dataTypes[colonna]=="real")
					cellValue=Math.round(cellValue * 100) / 100;
				if(inValues[colonna].includes(cellValue)==false)
				{
					document.getElementById('editableTableRow'+i).style.display="none";
					console.log("Deleting row "+i+" because the value '"+cellValue+"' does not appear in the array ["+colonna+"]: "+inValues[colonna]);
				}
			}
			j++;
		});
	}
	document.getElementById("rowsNumEditableTable").innerHTML=getTableRows(table);
}
function getTableRows(table)
{
	var rows=0;
	var table2 = document.getElementById("myTable"+table);
	for (var i = 1, row; row = table2.rows[i]; i++)
	{
		if(row.style.display!="none")
			rows++;
	}
	return rows;
}
function checkActiveFilters()
{
	columns.forEach(function(colonna)
	{
		if(!noFilterColumns.includes(colonna))
		{
			if(inValues[colonna].length!=inValuesAll[colonna].length)
				document.getElementById("editableTableBtnFilter"+colonna).style.color="red";
			else
				document.getElementById("editableTableBtnFilter"+colonna).style.color="";
		}
	});
}
function searcFilters(searchField,elementsContainer,column)
{
	var all = document.getElementsByClassName("filterMenuEditableTableCheckboxContainer"+column);
	for (var i = 0; i < all.length; i++) 
	{
		all[i].style.display='';
	}
	var value = $("#"+searchField).val().toLowerCase();
	$("#"+elementsContainer+" *").filter(function() 
	{
		if($(this).prop("tagName")=="LABEL")
			$(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
	});
	var all = document.getElementsByClassName("filterMenuEditableTableCheckboxContainer"+column);
	for (var i = 0; i < all.length; i++) 
	{
		var checkbox=all[i].childNodes[1];
		if(all[i].style.display=='none')
		{
			checkbox.checked=false;
			checkCheckboxAll(column);
		}
		else
		{
			checkbox.checked=true;
			checkCheckboxAll(column);
		}
	}
}
function isOdd(num) { return num % 2;}
function openContextMenu(event,column)
{
	closeContextMenu();
	document.getElementById("filterMenuEditableTable"+column).style.display="inline-block";
	var offsetRight = ($(window).width() - ($('#filterMenuEditableTable'+column).offset().left + $('#filterMenuEditableTable'+column).outerWidth()));
	if(offsetRight<0)
	{
		var width=document.getElementById("filterMenuEditableTable"+column).offsetWidth;
		var newOffsetRight=width+offsetRight;
		document.getElementById("filterMenuEditableTable"+column).style.right = newOffsetRight+"px";
	}
	//
}
function closeContextMenu()
{
	var all = document.getElementsByClassName("filterMenuEditableTable");
	for (var i = 0; i < all.length; i++) 
	{
		all[i].style.display='none';
	}
}
function checkCheckboxes(column)
{
	if(document.getElementById("filterMenuEditableTableCheckboxAll"+column).checked==true)
		var checked=true;
	else
		var checked=false;
	var all=document.getElementsByClassName("filterMenuEditableTableCheckbox"+column);
	for (var i = 0; i < all.length; i++) 
	{
		all[i].checked=checked;
	}
}
function checkCheckboxAll(column)
{
	var checked=true;
	var all=document.getElementsByClassName("filterMenuEditableTableCheckbox"+column);
	for (var i = 0; i < all.length; i++) 
	{
		if(all[i].checked==false)
		{
			checked=false;
			break;
		}
	}
	document.getElementById("filterMenuEditableTableCheckboxAll"+column).checked=checked;
}
document.onkeydown = function(evt) 
{
	evt = evt || window.event;
	if (evt.keyCode == 27)
	{
		closeContextMenu();
	}
};
function excelExport(container)
{
	table=selectetTable;
	var oldTable=document.getElementById(container).innerHTML;
	document.getElementById("myTable"+table).deleteRow(0);
	var row = document.getElementById("myTable"+table).insertRow(0);
	var j=0;
	columns.forEach(function(colonna)
	{
		var cell = row.insertCell(j);
		cell.innerHTML = colonna;
		j++;
	});
	
	var rowsToDelete=[];
	for (var i = 0, row; row = document.getElementById("myTable"+table).rows[i]; i++)
	{
		if(row.style.display=="none")
			rowsToDelete.push(row);
	}
	rowsToDelete.forEach(function(row) 
	{
		row.parentNode.removeChild(row);
	});
	
	$("#myTable"+table).table2excel({
	// exclude CSS class
	exclude: ".noExl",
	name: table,
	filename: table //do not include extension
	});
	document.getElementById(container).innerHTML=oldTable;
}
function resetFilters()
{
	columns.forEach(function(column) 
	{
		var all = document.getElementsByClassName("filterMenuEditableTableCheckbox"+column);
		for (var i = 0; i < all.length; i++) 
		{
			all[i].checked=true;
		}
	});
}
