<?php

    include "Session.php";
    include "connessione.php";

    ini_set('memory_limit', '-1');

    $table=$_REQUEST["table"];
    $id_richiesta=$_REQUEST["id_richiesta"];

    $columns=[];
    $colHeaders=[];

    $q2="SELECT COLUMN_NAME, CASE WHEN DATA_TYPE = 'varchar' THEN 'text' ELSE 'numeric' END AS type
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE (TABLE_NAME = N'$table') AND COLUMN_NAME<>'richiesta' AND COLUMN_NAME<>'id_dettaglio'";
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
            if($row2["COLUMN_NAME"]=="qnt" || $row2["COLUMN_NAME"]=="n_fogli_larghi" || $row2["COLUMN_NAME"]=="n_fogli_stretti")
                $column["readOnly"]=false;
            else
                $column["readOnly"]=true;

            array_push($columns,$column);
        }
    }

    $data=[];

    $q="SELECT * FROM [$table] WHERE richiesta=$id_richiesta";
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

    echo json_encode($arrayResponse);

?>