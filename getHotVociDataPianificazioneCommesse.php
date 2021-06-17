<?php

    $database="mi_pianificazione";
    include "connessioneDb.php";

    $table=$_REQUEST["table"];
    $primaryKey="id_voce";

    $columns=[];
    $colHeaders=[];

    $q2="SELECT COLUMN_NAME, CASE WHEN DATA_TYPE = 'varchar' THEN 'text' ELSE 'numeric' END AS type
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE (TABLE_NAME = N'$table')";
    $r2=sqlsrv_query($conn,$q2);
    if($r2==FALSE)
    {
        die("error".$q2);
    }
    else
    {
        while($row2=sqlsrv_fetch_array($r2))
        {
            array_push($colHeaders,$row2["COLUMN_NAME"]);

            $column["data"]=$row2["COLUMN_NAME"];

            switch ($row2["COLUMN_NAME"])
            {
                case $primaryKey:
                    $column["readOnly"]=true;
                    $column["type"]=$row2["type"];
                break;
                default:
                    $column["readOnly"]=false;
                    $column["type"]=$row2["type"];
                break;
            }

            array_push($columns,$column);
        }
    }

    $data=[];

    $q="SELECT * FROM $table ORDER BY nome";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error".$q);
    }
    else
    {
        while($row=sqlsrv_fetch_array($r))
        {
            $rowObj=[];
            foreach ($colHeaders as $column)
            {
                if($column=="nome")
                    $rowObj[$column]=utf8_encode($row[$column]);
                else
                    $rowObj[$column]=$row[$column];
            }
            array_push($data,$rowObj);
        }
    }

    $arrayResponse["primaryKey"]=$primaryKey;
    $arrayResponse["columns"]=$columns;
    $arrayResponse["colHeaders"]=$colHeaders;
    $arrayResponse["data"]=$data;

    echo json_encode($arrayResponse);

?>