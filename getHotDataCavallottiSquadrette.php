<?php

    include "Session.php";
    $database="mi_webapp";
    include "connessioneDb.php";

    set_time_limit(120);

    $id_commessa=$_REQUEST["id_commessa"];

    $table="";

    $colHeaders=["commessa_numero_cabina", "codice_componente", "fase", "qnt", "val"];
    $columns=[];

    $commessa_numero_cabina_n_array=[];

    foreach ($colHeaders as $columnName)
    {
        array_push($colHeaders,$columnName);

        $column["data"]=$columnName;
        $column["readOnly"]=true;

        array_push($columns,$column);
    }

    $data=[];

    $q="SELECT        TOP (100) PERCENT commessa_numero_cabina, codice_componente, fase, SUM(qnt) AS qnt, val
FROM            (SELECT        TOP (100) PERCENT commessa_numero_cabina, codice_cabina AS codice_componente, fase, SUM(qnt) AS qnt, val
                          FROM            (SELECT        CASE WHEN codcabina_gestionale LIKE '+V%' THEN codcabina_gestionale WHEN codice_corridoio_ponte_zona LIKE '+V%' THEN codice_corridoio_ponte_zona END AS commessa_numero_cabina, 
                                                                              cabine_3.codice_cabina, '' AS fase, 1 AS qnt, 'qq' AS val
                                                    FROM            mi_db_tecnico.dbo.cabine AS cabine_3 INNER JOIN
                                                                              dbo.consistenza_commesse ON cabine_3.codice_cabina = dbo.consistenza_commesse.nr_codice_pareti_kit
                                                    WHERE        (cabine_3.codice_cabina IS NOT NULL) AND (dbo.consistenza_commesse.commessa = $id_commessa)
                                                    UNION
                                                    SELECT        CASE WHEN codcabina_gestionale LIKE '+V%' THEN codcabina_gestionale WHEN codice_corridoio_ponte_zona LIKE '+V%' THEN codice_corridoio_ponte_zona END AS Expr1, 
                                                                             mi_db_tecnico.dbo.materie_prime.codice_materia_prima, 'S020' AS fase, mi_db_tecnico.dbo.cavallotti.qnt, 'qq' AS Val
                                                    FROM            mi_db_tecnico.dbo.cavallotti INNER JOIN
                                                                             mi_db_tecnico.dbo.cabine AS cabine_1 ON mi_db_tecnico.dbo.cavallotti.id_cabina = cabine_1.id_cabina INNER JOIN
                                                                             mi_db_tecnico.dbo.materie_prime ON mi_db_tecnico.dbo.cavallotti.id_materia_prima = mi_db_tecnico.dbo.materie_prime.id_materia_prima INNER JOIN
                                                                             dbo.consistenza_commesse AS consistenza_commesse_1 ON cabine_1.codice_cabina = consistenza_commesse_1.nr_codice_pareti_kit
                                                    WHERE        (consistenza_commesse_1.commessa = $id_commessa) AND (cabine_1.codice_cabina IS NOT NULL)) AS t
                          GROUP BY commessa_numero_cabina, codice_cabina, fase, val
                          HAVING         (codice_cabina LIKE '+%') AND (commessa_numero_cabina IS NOT NULL) AND (NOT (codice_cabina LIKE '%CR%'))
                          UNION
                          SELECT        TOP (100) 
                                                   PERCENT CASE WHEN codcabina_gestionale LIKE '+V%' THEN codcabina_gestionale WHEN codice_corridoio_ponte_zona LIKE '+V%' THEN codice_corridoio_ponte_zona END AS commessa_numero_cabina, 
                                                   cabine.codice_kit, 'S020' AS fase, ISNULL(cabine.qnt, 0) - ISNULL(sottoinsiemi_corridoi.qnt, 0) AS qnt, 'qq' AS val
                          FROM            dbo.consistenza_commesse AS consistenza_commesse_2 INNER JOIN
                                                       (SELECT        cabine_1.codice_cabina, kit_1.codice_kit, mi_db_tecnico.dbo.kit_cabine.qnt
                                                         FROM            mi_db_tecnico.dbo.cabine AS cabine_1 INNER JOIN
                                                                                   mi_db_tecnico.dbo.kit_cabine ON cabine_1.id_cabina = mi_db_tecnico.dbo.kit_cabine.id_cabina INNER JOIN
                                                                                   mi_db_tecnico.dbo.kit AS kit_1 ON mi_db_tecnico.dbo.kit_cabine.id_kit = kit_1.id_kit) AS cabine ON consistenza_commesse_2.nr_codice_pareti_kit = cabine.codice_cabina LEFT OUTER JOIN
                                                       (SELECT        cabine_2.codice_cabina, mi_db_tecnico.dbo.kit.codice_kit, SUM(mi_db_tecnico.dbo.kit_sottoinsiemi_corridoi.qnt) AS qnt
                                                         FROM            mi_db_tecnico.dbo.kit INNER JOIN
                                                                                   mi_db_tecnico.dbo.kit_sottoinsiemi_corridoi ON mi_db_tecnico.dbo.kit.id_kit = mi_db_tecnico.dbo.kit_sottoinsiemi_corridoi.id_kit INNER JOIN
                                                                                   mi_db_tecnico.dbo.sottoinsiemi_corridoi AS sottoinsiemi_corridoi_1 ON 
                                                                                   mi_db_tecnico.dbo.kit_sottoinsiemi_corridoi.id_sottoinsieme_corridoio = sottoinsiemi_corridoi_1.id_sottoinsieme_corridoio INNER JOIN
                                                                                   mi_db_tecnico.dbo.cabine AS cabine_2 ON sottoinsiemi_corridoi_1.id_cabina = cabine_2.id_cabina
                                                         GROUP BY mi_db_tecnico.dbo.kit.codice_kit, cabine_2.codice_cabina) AS sottoinsiemi_corridoi ON cabine.codice_kit = sottoinsiemi_corridoi.codice_kit AND 
                                                   cabine.codice_cabina = sottoinsiemi_corridoi.codice_cabina
                          WHERE        (ISNULL(cabine.qnt, 0) - ISNULL(sottoinsiemi_corridoi.qnt, 0) > 0) AND (consistenza_commesse_2.commessa = $id_commessa) AND (consistenza_commesse_2.origine = 'tip_cor')) AS t
GROUP BY commessa_numero_cabina, codice_componente, fase, val
ORDER BY commessa_numero_cabina, codice_componente DESC";
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

    $q2="SELECT       DISTINCT commessa_numero_cabina, COUNT(commessa_numero_cabina) AS n
    FROM            (SELECT        TOP (100) PERCENT commessa_numero_cabina, codice_cabina AS codice_componente, fase, SUM(qnt) AS qnt, val
                              FROM            (SELECT        CASE WHEN codcabina_gestionale LIKE '+V%' THEN codcabina_gestionale WHEN codice_corridoio_ponte_zona LIKE '+V%' THEN codice_corridoio_ponte_zona END AS commessa_numero_cabina, 
                                                                                  cabine_3.codice_cabina, '' AS fase, 1 AS qnt, 'qq' AS val
                                                        FROM            mi_db_tecnico.dbo.cabine AS cabine_3 INNER JOIN
                                                                                  dbo.consistenza_commesse ON cabine_3.codice_cabina = dbo.consistenza_commesse.nr_codice_pareti_kit
                                                        WHERE        (cabine_3.codice_cabina IS NOT NULL) AND (dbo.consistenza_commesse.commessa = $id_commessa)
                                                        UNION
                                                        SELECT        CASE WHEN codcabina_gestionale LIKE '+V%' THEN codcabina_gestionale WHEN codice_corridoio_ponte_zona LIKE '+V%' THEN codice_corridoio_ponte_zona END AS Expr1, 
                                                                                 mi_db_tecnico.dbo.materie_prime.codice_materia_prima, 'S020' AS fase, mi_db_tecnico.dbo.cavallotti.qnt, 'qq' AS Val
                                                        FROM            mi_db_tecnico.dbo.cavallotti INNER JOIN
                                                                                 mi_db_tecnico.dbo.cabine AS cabine_1 ON mi_db_tecnico.dbo.cavallotti.id_cabina = cabine_1.id_cabina INNER JOIN
                                                                                 mi_db_tecnico.dbo.materie_prime ON mi_db_tecnico.dbo.cavallotti.id_materia_prima = mi_db_tecnico.dbo.materie_prime.id_materia_prima INNER JOIN
                                                                                 dbo.consistenza_commesse AS consistenza_commesse_1 ON cabine_1.codice_cabina = consistenza_commesse_1.nr_codice_pareti_kit
                                                        WHERE        (consistenza_commesse_1.commessa = $id_commessa) AND (cabine_1.codice_cabina IS NOT NULL)) AS t_1
                              GROUP BY commessa_numero_cabina, codice_cabina, fase, val
                              HAVING         (codice_cabina LIKE '+%') AND (commessa_numero_cabina IS NOT NULL) AND (NOT (codice_cabina LIKE '%CR%'))
                              UNION
                              SELECT        TOP (100) 
                                                       PERCENT CASE WHEN codcabina_gestionale LIKE '+V%' THEN codcabina_gestionale WHEN codice_corridoio_ponte_zona LIKE '+V%' THEN codice_corridoio_ponte_zona END AS commessa_numero_cabina, 
                                                       cabine.codice_kit, 'S020' AS fase, ISNULL(cabine.qnt, 0) - ISNULL(sottoinsiemi_corridoi.qnt, 0) AS qnt, 'qq' AS val
                              FROM            dbo.consistenza_commesse AS consistenza_commesse_2 INNER JOIN
                                                           (SELECT        cabine_1.codice_cabina, kit_1.codice_kit, mi_db_tecnico.dbo.kit_cabine.qnt
                                                             FROM            mi_db_tecnico.dbo.cabine AS cabine_1 INNER JOIN
                                                                                       mi_db_tecnico.dbo.kit_cabine ON cabine_1.id_cabina = mi_db_tecnico.dbo.kit_cabine.id_cabina INNER JOIN
                                                                                       mi_db_tecnico.dbo.kit AS kit_1 ON mi_db_tecnico.dbo.kit_cabine.id_kit = kit_1.id_kit) AS cabine ON consistenza_commesse_2.nr_codice_pareti_kit = cabine.codice_cabina LEFT OUTER JOIN
                                                           (SELECT        cabine_2.codice_cabina, mi_db_tecnico.dbo.kit.codice_kit, SUM(mi_db_tecnico.dbo.kit_sottoinsiemi_corridoi.qnt) AS qnt
                                                             FROM            mi_db_tecnico.dbo.kit INNER JOIN
                                                                                       mi_db_tecnico.dbo.kit_sottoinsiemi_corridoi ON mi_db_tecnico.dbo.kit.id_kit = mi_db_tecnico.dbo.kit_sottoinsiemi_corridoi.id_kit INNER JOIN
                                                                                       mi_db_tecnico.dbo.sottoinsiemi_corridoi AS sottoinsiemi_corridoi_1 ON 
                                                                                       mi_db_tecnico.dbo.kit_sottoinsiemi_corridoi.id_sottoinsieme_corridoio = sottoinsiemi_corridoi_1.id_sottoinsieme_corridoio INNER JOIN
                                                                                       mi_db_tecnico.dbo.cabine AS cabine_2 ON sottoinsiemi_corridoi_1.id_cabina = cabine_2.id_cabina
                                                             GROUP BY mi_db_tecnico.dbo.kit.codice_kit, cabine_2.codice_cabina) AS sottoinsiemi_corridoi ON cabine.codice_kit = sottoinsiemi_corridoi.codice_kit AND 
                                                       cabine.codice_cabina = sottoinsiemi_corridoi.codice_cabina
                              WHERE        (ISNULL(cabine.qnt, 0) - ISNULL(sottoinsiemi_corridoi.qnt, 0) > 0) AND (consistenza_commesse_2.commessa = $id_commessa) AND (consistenza_commesse_2.origine = 'tip_cor')) AS t
    GROUP BY commessa_numero_cabina";
    $r2=sqlsrv_query($conn,$q2);
    if($r2==FALSE)
    {
        die("error".$q2);
    }
    else
    {
        while($row2=sqlsrv_fetch_array($r2))
        {
            $commessa_numero_cabina_n_obj["commessa_numero_cabina"]=$row2["commessa_numero_cabina"];
            $commessa_numero_cabina_n_obj["n"]=$row2["n"];
            
            array_push($commessa_numero_cabina_n_array,$commessa_numero_cabina_n_obj);
        }
    }

    $arrayResponse["commessa_numero_cabina_n_array"]=$commessa_numero_cabina_n_array;
    $arrayResponse["columns"]=$columns;
    $arrayResponse["colHeaders"]=$colHeaders;
    $arrayResponse["data"]=$data;

    echo json_encode($arrayResponse);

?>