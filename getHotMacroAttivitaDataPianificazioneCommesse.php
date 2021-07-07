<?php

    $database="mi_pianificazione";
    include "connessioneDb.php";

    $table=$_REQUEST["table"];
    $primaryKey="id";

    $columns=[];
    $colHeaders=["id","nome","descrizione","durata_unitaria(ore)","colore"];

    foreach ($colHeaders as $col)
    {
        $column["data"]=$col;

        switch ($col)
        {
            case "id_macro_attivita":
                $column["readOnly"]=true;
                $column["type"]="numeric";
            break;
            case "nome":
                $column["readOnly"]=false;
                $column["type"]="text";
            break;
            case "descrizione":
                $column["readOnly"]=false;
                $column["type"]="text";
            break;
            case "durata_unitaria(ore)":
                $column["readOnly"]=false;
                $column["type"]="numeric";
            break;
            case "colore":
                $column["readOnly"]=false;
                $column["type"]="text";
            break;
        }

        array_push($columns,$column);
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
                if($column=="nome" || $column=="descrizione")
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