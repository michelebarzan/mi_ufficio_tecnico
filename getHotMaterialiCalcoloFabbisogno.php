<?php

    include "Session.php";
    include "connessione.php";

    $id_commessa=$_REQUEST["id_commessa"];

    $columns=[];
    $colHeaders=[];

    $q2="SELECT COLUMN_NAME, CASE WHEN DATA_TYPE = 'varchar' THEN 'text' ELSE 'numeric' END AS type
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE (TABLE_NAME = N'materiali_calcolo_fabbisogno_commessa_view') AND COLUMN_NAME<>'id_commessa'";
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
            $column["readOnly"]=true;

            array_push($columns,$column);
        }
    }

    $data=[];

    $q="SELECT * FROM [materiali_calcolo_fabbisogno_commessa_view] WHERE id_commessa=$id_commessa ORDER BY dataOra";
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
                if($column=="dataOra")
                    $rowObj[$column]=$row[$column]->format("d/m/Y H:i:s");
                else
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