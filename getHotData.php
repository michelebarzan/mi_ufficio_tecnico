<?php

    include "Session.php";
    include "connessione.php";

    ini_set('memory_limit', '-1');

    $table=$_REQUEST["table"];

    $columns=[];
    $colHeaders=[];

    $q3="SELECT COLUMN_NAME
        FROM (SELECT K.TABLE_NAME, K.COLUMN_NAME, K.CONSTRAINT_NAME
                                FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS AS C INNER JOIN
                                                            INFORMATION_SCHEMA.KEY_COLUMN_USAGE AS K ON C.TABLE_NAME = K.TABLE_NAME AND C.CONSTRAINT_CATALOG = K.CONSTRAINT_CATALOG AND C.CONSTRAINT_SCHEMA = K.CONSTRAINT_SCHEMA AND
                                                            C.CONSTRAINT_NAME = K.CONSTRAINT_NAME
                                WHERE (C.CONSTRAINT_TYPE = 'PRIMARY KEY') AND (K.TABLE_NAME = '$table')) AS t";
    $r3=sqlsrv_query($conn,$q3);
    if($r3==FALSE)
    {
        die("error".$q3);
    }
    else
    {
        while($row3=sqlsrv_fetch_array($r3))
        {
            $primaryKey=$row3["COLUMN_NAME"];
        }
    }

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
            $column["type"]=$row2["type"];
            if($row2["COLUMN_NAME"]==$primaryKey)
                $column["readOnly"]=true;
            else
                $column["readOnly"]=false;

            array_push($columns,$column);
        }
    }

    $data=[];

    $q="SELECT * FROM [$table]";
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
                $rowObj[$column]=$row[$column];
            }
            array_push($data,$rowObj);
        }
    }

    $arrayResponse["columns"]=$columns;
    $arrayResponse["colHeaders"]=$colHeaders;
    $arrayResponse["data"]=$data;
    $arrayResponse["primaryKey"]=$primaryKey;

    echo json_encode($arrayResponse);

?>