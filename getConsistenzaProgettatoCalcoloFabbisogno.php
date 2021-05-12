<?php

    include "Session.php";
    include "connessione.php";

    set_time_limit(240);

    $id_materiale=$_REQUEST["id_materiale"];
    $id_commessa=$_REQUEST["id_commessa"];

    $dataPoints=[];

    $q="SELECT qnt, materiale, commessa, voce, colore
            FROM (SELECT qnt, materiale, commessa, voce, '#E9A93A' AS colore
                                    FROM dbo.materiale_calcolato
                                    UNION ALL
                                    SELECT qnt, materiale, commessa, voce, '#70B085' AS colore
                                    FROM dbo.materiale_richiesto
                                    UNION ALL
                                    SELECT CONVERT(INT,SUM(mi_db_tecnico.dbo.peso_qnt_cabine.qnt_lorda)/mi_db_tecnico.dbo.peso_qnt_cabine.confezione) AS qnt, dbo.anagrafica_materiali.id_materiale AS materiale, dbo.cabine_commesse_view.commessa, 'progettato' AS voce, '#DA6969' AS colore
        FROM mi_db_tecnico.dbo.peso_qnt_cabine INNER JOIN
                            dbo.anagrafica_materiali ON mi_db_tecnico.dbo.peso_qnt_cabine.id_materia_prima = dbo.anagrafica_materiali.materia_prima INNER JOIN
                            dbo.cabine_commesse_view ON mi_db_tecnico.dbo.peso_qnt_cabine.codice_cabina = dbo.cabine_commesse_view.codice_cabina
        GROUP BY dbo.anagrafica_materiali.id_materiale, dbo.cabine_commesse_view.commessa,mi_db_tecnico.dbo.peso_qnt_cabine.confezione
        HAVING (dbo.cabine_commesse_view.commessa = $id_commessa)  AND (dbo.anagrafica_materiali.id_materiale IN ($materiali_in))

                                    ) AS derivedtbl_1
            WHERE (commessa = $id_commessa) AND (materiale IN ($materiali_in))";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error".$q);
    }
    else
    {
        while($row=sqlsrv_fetch_array($r))
        {
            $dataPoint["qnt"]=$row["qnt"];
            $dataPoint["materiale"]=$row["materiale"];
            $dataPoint["commessa"]=$row["commessa"];
            $dataPoint["voce"]=$row["voce"];
            $dataPoint["colore"]=$row["colore"];
            
            array_push($dataPoints,$dataPoint);
        }
    }

    echo json_encode($dataPoints);

?>