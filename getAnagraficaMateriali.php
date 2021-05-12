<?php

    include "Session.php";
    include "connessione.php";

    ini_set('memory_limit', '-1');

    $id_commessa=$_REQUEST["id_commessa"];

    $columns=[];
    $colHeaders=[];

    $raggruppamenti_materiali=[];
    $q3="SELECT * FROM raggruppamenti_materiali";
    $r3=sqlsrv_query($conn,$q3);
    if($r3==FALSE)
    {
        die("error".$q3);
    }
    else
    {
        while($row3=sqlsrv_fetch_array($r3))
        {
            array_push($raggruppamenti_materiali,$row3["nome"]);
        }
        array_push($raggruppamenti_materiali,"Nessuno");
    }

    $materie_prime=[];
    $q4="SELECT * FROM mi_db_tecnico.dbo.materie_prime";
    $r4=sqlsrv_query($conn,$q4);
    if($r4==FALSE)
    {
        die("error".$q4);
    }
    else
    {
        while($row4=sqlsrv_fetch_array($r4))
        {
            array_push($materie_prime,$row4["codice_materia_prima"]);
        }
        array_push($materie_prime,"Nessuna");
    }

    $q2="SELECT COLUMN_NAME, CASE WHEN DATA_TYPE = 'varchar' THEN 'text' ELSE 'numeric' END AS type
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE (TABLE_NAME = N'anagrafica_materiali_view') AND COLUMN_NAME <> 'commessa'";
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
                case 'famiglia':
                    $column["type"]="dropdown";
                    $column["source"]=$raggruppamenti_materiali;
                    $column["readOnly"]=false;
                break;
                case 'materia_prima':
                    $column["type"]="dropdown";
                    $column["source"]=$materie_prime;
                    $column["readOnly"]=false;
                break;
                case 'id_materiale':
                    $column["readOnly"]=true;
                break;
                default:
                    $column["readOnly"]=false;
                break;
            }

            array_push($columns,$column);
        }
    }

    $data=[];

    $q="SELECT * FROM anagrafica_materiali_view WHERE commessa = $id_commessa";
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
                if($column=="nome" || $column=="descrizione")
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