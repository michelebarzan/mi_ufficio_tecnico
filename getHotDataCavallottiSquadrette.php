<?php

    include "Session.php";
    $database="mi_webapp";
    include "connessioneDb.php";

    set_time_limit(120);

    $id_commessa=$_REQUEST["id_commessa"];

    $table="";

    $colHeaders=["commessa_numero_cabina", "codice_cabina", "fase", "qnt", "val"];
    $columns=[];

    foreach ($colHeaders as $columnName)
    {
        array_push($colHeaders,$columnName);

        $column["data"]=$columnName;
        $column["readOnly"]=true;

        array_push($columns,$column);
    }

    $data=[];

    $q="SELECT        TOP (100) PERCENT commessa_numero_cabina, codice_cabina, fase, SUM(qnt) AS qnt, val
FROM            (SELECT        CASE WHEN codcabina_gestionale LIKE '+V%' THEN codcabina_gestionale WHEN codice_corridoio_ponte_zona LIKE '+V%' THEN codice_corridoio_ponte_zona END AS commessa_numero_cabina, 
                                                    mi_db_tecnico.dbo.cabine.codice_cabina, '' AS fase, 1 AS qnt, 'qq' AS val
                          FROM            mi_db_tecnico.dbo.cabine INNER JOIN
                                                    dbo.consistenza_commesse ON mi_db_tecnico.dbo.cabine.codice_cabina = dbo.consistenza_commesse.nr_codice_pareti_kit
                          WHERE        (mi_db_tecnico.dbo.cabine.codice_cabina IS NOT NULL) AND (dbo.consistenza_commesse.commessa = $id_commessa)
                          UNION
                          SELECT        CASE WHEN codcabina_gestionale LIKE '+V%' THEN codcabina_gestionale WHEN codice_corridoio_ponte_zona LIKE '+V%' THEN codice_corridoio_ponte_zona END AS Expr1, 
                                                   mi_db_tecnico.dbo.materie_prime.codice_materia_prima, 'S020' AS fase, mi_db_tecnico.dbo.cavallotti.qnt, 'qq' AS Val
                          FROM            mi_db_tecnico.dbo.cavallotti INNER JOIN
                                                   mi_db_tecnico.dbo.cabine AS cabine_1 ON mi_db_tecnico.dbo.cavallotti.id_cabina = cabine_1.id_cabina INNER JOIN
                                                   mi_db_tecnico.dbo.materie_prime ON mi_db_tecnico.dbo.cavallotti.id_materia_prima = mi_db_tecnico.dbo.materie_prime.id_materia_prima INNER JOIN
                                                   dbo.consistenza_commesse AS consistenza_commesse_1 ON cabine_1.codice_cabina = consistenza_commesse_1.nr_codice_pareti_kit
                          WHERE        (consistenza_commesse_1.commessa = $id_commessa) AND (cabine_1.codice_cabina IS NOT NULL)) AS t
GROUP BY commessa_numero_cabina, codice_cabina, fase, val
HAVING        (codice_cabina LIKE '+%') AND (commessa_numero_cabina IS NOT NULL) AND (NOT (codice_cabina LIKE '%K2CR%'))
ORDER BY commessa_numero_cabina, codice_cabina DESC";
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