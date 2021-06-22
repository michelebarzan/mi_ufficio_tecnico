<?php

    $database="mi_pianificazione";
    include "connessioneDb.php";

    $anagrafica_andamenti=[];

    $q="SELECT * FROM anagrafica_andamenti";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error".$q);
    }
    else
    {
        while($row=sqlsrv_fetch_array($r))
        {
            $andamento["id_andamento"]=$row["id_andamento"];
            $andamento["nome"]=utf8_encode($row["nome"]);

            $dataPoints=[];
            
            for ($i=0; $i < 100; $i++)
            { 
                $andamento[$i]=$row[$i];

                $dataPoint["x"]=$i;
                $dataPoint["y"]=$row[$i];

                array_push($dataPoints,$dataPoint);
            }
            
            $andamento["dataPoints"]=$dataPoints;

            array_push($anagrafica_andamenti,$andamento);
        }
    }

    echo json_encode($anagrafica_andamenti);

?>