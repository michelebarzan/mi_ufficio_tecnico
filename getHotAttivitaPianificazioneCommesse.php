<?php

    $database="mi_pianificazione";
    include "connessioneDb.php";

    $columns=[];
    $colHeaders=[];

    $macro_attivita=[];
    $q3="SELECT * FROM macro_attivita";
    $r3=sqlsrv_query($conn,$q3);
    if($r3==FALSE)
    {
        die("error".$q3);
    }
    else
    {
        while($row3=sqlsrv_fetch_array($r3))
        {
            array_push($macro_attivita,$row3["nome"]);
        }
        array_push($macro_attivita,"Nessuna");
    }

    $q2="SELECT COLUMN_NAME, CASE WHEN DATA_TYPE = 'varchar' THEN 'text' ELSE 'numeric' END AS type
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE (TABLE_NAME = N'anagrafica_attivita_view')";
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
                case 'macro_attivita':
                    $column["type"]="dropdown";
                    $column["source"]=$macro_attivita;
                    $column["readOnly"]=false;
                break;
                case 'id_attivita':
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

    $q="SELECT * FROM anagrafica_attivita_view ORDER BY nome";
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
                if($column=="nome" || $column=="nome" || $column=="macro_attivita")
                    $rowObj[$column]=utf8_encode($row[$column]);
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