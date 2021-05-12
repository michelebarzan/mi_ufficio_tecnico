<?php

    include "Session.php";
    include "connessione.php";

    ini_set('memory_limit', '-1');

    $id_commessa=$_REQUEST["id_commessa"];

    $columns=["origine"];
    $q2="SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = N'consistenza_commesse' AND COLUMN_NAME<>'commessa' AND COLUMN_NAME<>'id_consistenza_commessa' AND COLUMN_NAME<>'origine'";
    $r2=sqlsrv_query($conn,$q2);
    if($r2==FALSE)
    {
        die("error".$q2);
    }
    else
    {
        while($row2=sqlsrv_fetch_array($r2))
        {
            array_push($columns,$row2["COLUMN_NAME"]);
        }
    }

    $data=[];
    $q="SELECT * FROM consistenza_commesse WHERE commessa = $id_commessa";
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
            foreach ($columns as $column)
            {
                $rowObj[$column]=$row[$column];
            }
            array_push($data,$rowObj);
        }
    }

    $arrayResponse["columns"]=$columns;
    $arrayResponse["data"]=$data;

    echo json_encode($arrayResponse);

?>