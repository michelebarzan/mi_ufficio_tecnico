<?php

    include "Session.php";
    include "connessione.php";

    set_time_limit(120);

    //$materiali_statistiche=json_decode($_REQUEST["JSONmateriali_statistiche"]);
    $raggruppamentoMateriali=json_decode($_REQUEST["JSONraggruppamentoMaterialiRiepilogoCommesse"]);
    $materiali_statistiche=[];
    if($raggruppamentoMateriali)
    {
        $q8="SELECT id_raggruppamento FROM raggruppamenti_materiali";
        $r8=sqlsrv_query($conn,$q8);
        if($r8==FALSE)
        {
            die("error".$q8);
        }
        else
        {
            while($row8=sqlsrv_fetch_array($r8))
            {
                array_push($materiali_statistiche,$row8["id_raggruppamento"]);
            }
        }
    }
    else
    {
        $q8="SELECT id_materiale FROM anagrafica_materiali";
        $r8=sqlsrv_query($conn,$q8);
        if($r8==FALSE)
        {
            die("error".$q8);
        }
        else
        {
            while($row8=sqlsrv_fetch_array($r8))
            {
                array_push($materiali_statistiche,$row8["id_materiale"]);
            }
        }
    }

    $materiali_statistiche_in=implode(",",$materiali_statistiche);

    $columns=[];
    $colHeaders=[];
    $viewColumns=[];

    if($raggruppamentoMateriali)
    {
        $viewColumn["COLUMN_NAME"]="commessa";
        $viewColumn["type"]="text";
        $viewColumn["readOnly"]=true;
        array_push($viewColumns,$viewColumn);
        
        $viewColumn["COLUMN_NAME"]="famiglia";
        $viewColumn["type"]="text";
        $viewColumn["readOnly"]=true;
        array_push($viewColumns,$viewColumn);

        $viewColumn["COLUMN_NAME"]="um";
        $viewColumn["type"]="text";
        $viewColumn["readOnly"]=true;
        array_push($viewColumns,$viewColumn);

        $viewColumn["COLUMN_NAME"]="materiali";
        $viewColumn["type"]="text";
        $viewColumn["readOnly"]=true;
        array_push($viewColumns,$viewColumn);

        $viewColumn["COLUMN_NAME"]="calcolato";
        $viewColumn["type"]="numeric";
        $viewColumn["readOnly"]=true;
        array_push($viewColumns,$viewColumn);

        $viewColumn["COLUMN_NAME"]="richiesto";
        $viewColumn["type"]="numeric";
        $viewColumn["readOnly"]=true;
        array_push($viewColumns,$viewColumn);

        $viewColumn["COLUMN_NAME"]="progettato";
        $viewColumn["type"]="numeric";
        $viewColumn["readOnly"]=true;
        array_push($viewColumns,$viewColumn);

        $viewColumn["COLUMN_NAME"]="delta_richiesto-calcolato";
        $viewColumn["type"]="numeric";
        $viewColumn["readOnly"]=true;
        array_push($viewColumns,$viewColumn);

        $viewColumn["COLUMN_NAME"]="delta_calcolato-progettato";
        $viewColumn["type"]="numeric";
        $viewColumn["readOnly"]=true;
        array_push($viewColumns,$viewColumn);
    }
    else
    {
        $viewColumn["COLUMN_NAME"]="commessa";
        $viewColumn["type"]="text";
        $viewColumn["readOnly"]=true;
        array_push($viewColumns,$viewColumn);

        $viewColumn["COLUMN_NAME"]="materiale";
        $viewColumn["type"]="text";
        $viewColumn["readOnly"]=true;
        array_push($viewColumns,$viewColumn);

        $viewColumn["COLUMN_NAME"]="um";
        $viewColumn["type"]="text";
        $viewColumn["readOnly"]=true;
        array_push($viewColumns,$viewColumn);

        $viewColumn["COLUMN_NAME"]="famiglia";
        $viewColumn["type"]="text";
        $viewColumn["readOnly"]=true;
        array_push($viewColumns,$viewColumn);

        $viewColumn["COLUMN_NAME"]="calcolato";
        $viewColumn["type"]="numeric";
        $viewColumn["readOnly"]=true;
        array_push($viewColumns,$viewColumn);

        $viewColumn["COLUMN_NAME"]="richiesto";
        $viewColumn["type"]="numeric";
        $viewColumn["readOnly"]=true;
        array_push($viewColumns,$viewColumn);

        $viewColumn["COLUMN_NAME"]="progettato";
        $viewColumn["type"]="numeric";
        $viewColumn["readOnly"]=true;
        array_push($viewColumns,$viewColumn);

        $viewColumn["COLUMN_NAME"]="delta_richiesto-calcolato";
        $viewColumn["type"]="numeric";
        $viewColumn["readOnly"]=true;
        array_push($viewColumns,$viewColumn);

        $viewColumn["COLUMN_NAME"]="delta_calcolato-progettato";
        $viewColumn["type"]="numeric";
        $viewColumn["readOnly"]=true;
        array_push($viewColumns,$viewColumn);

        $viewColumn["COLUMN_NAME"]="note";
        $viewColumn["type"]="numeric";
        $viewColumn["readOnly"]=true;
        array_push($viewColumns,$viewColumn);
    }

    foreach ($viewColumns as $viewColumn)
    {
        array_push($colHeaders,$viewColumn["COLUMN_NAME"]);

        $column["data"]=$viewColumn["COLUMN_NAME"];
        $column["type"]=$viewColumn["type"];
        $column["readOnly"]=true;

        array_push($columns,$column);
    }

    $data=[];

    $materiali_calcolo_progettato_alternativo=[];
    $materiali_calcolo_progettato_normale=[];

    $materiali_statistiche_in=implode(",",$materiali_statistiche);

    if($raggruppamentoMateriali)
    {
        $q2="SELECT ISNULL(calcolo_progettato_alternativo, 'false') AS calcolo_progettato_alternativo, id_raggruppamento
            FROM dbo.raggruppamenti_materiali
            WHERE (id_raggruppamento IN ($materiali_statistiche_in))";
        $r2=sqlsrv_query($conn,$q2);
        if($r2==FALSE)
        {
            die("error");
        }
        else
        {
            while($row2=sqlsrv_fetch_array($r2))
            {
                if($row2["calcolo_progettato_alternativo"]=="true")
                    array_push($materiali_calcolo_progettato_alternativo,$row2["id_raggruppamento"]);
                else
                    array_push($materiali_calcolo_progettato_normale,$row2["id_raggruppamento"]);
            }
        }
    }
    else
    {
        $q2="SELECT dbo.anagrafica_materiali.id_materiale, ISNULL(dbo.raggruppamenti_materiali.calcolo_progettato_alternativo, 'false') AS calcolo_progettato_alternativo
            FROM dbo.anagrafica_materiali LEFT OUTER JOIN dbo.raggruppamenti_materiali ON dbo.anagrafica_materiali.raggruppamento = dbo.raggruppamenti_materiali.id_raggruppamento
            WHERE (dbo.anagrafica_materiali.id_materiale IN ($materiali_statistiche_in))";
        $r2=sqlsrv_query($conn,$q2);
        if($r2==FALSE)
        {
            die("error");
        }
        else
        {
            while($row2=sqlsrv_fetch_array($r2))
            {
                if($row2["calcolo_progettato_alternativo"]=="true")
                    array_push($materiali_calcolo_progettato_alternativo,$row2["id_materiale"]);
                else
                    array_push($materiali_calcolo_progettato_normale,$row2["id_materiale"]);
            }
        }
    }   

    $materiali_calcolo_progettato_alternativo_in=implode(",",$materiali_calcolo_progettato_alternativo);
    $materiali_calcolo_progettato_normale_in=implode(",",$materiali_calcolo_progettato_normale);

    $totali=[];

    if($raggruppamentoMateriali)
    {
        $subQuery_materiali_calcolo_progettato_normale="";
        if(sizeof($materiali_calcolo_progettato_normale)>0)
        {
            $subQuery_materiali_calcolo_progettato_normale="UNION SELECT CONVERT(FLOAT,SUM(mi_db_tecnico.dbo.peso_qnt_cabine.qnt_lorda)/mi_db_tecnico.dbo.peso_qnt_cabine.confezione) AS qnt, dbo.anagrafica_materiali.raggruppamento, dbo.cabine_commesse_view.commessa, 'progettato' AS voce, '#DA6969' AS colore
                                                            FROM mi_db_tecnico.dbo.peso_qnt_cabine INNER JOIN dbo.anagrafica_materiali ON mi_db_tecnico.dbo.peso_qnt_cabine.id_materia_prima = dbo.anagrafica_materiali.materia_prima INNER JOIN dbo.cabine_commesse_view ON mi_db_tecnico.dbo.peso_qnt_cabine.codice_cabina = dbo.cabine_commesse_view.codice_cabina
                                                            GROUP BY dbo.anagrafica_materiali.raggruppamento, dbo.cabine_commesse_view.commessa,mi_db_tecnico.dbo.peso_qnt_cabine.confezione
                                                            HAVING (dbo.anagrafica_materiali.raggruppamento IN ($materiali_calcolo_progettato_normale_in))";
        }
        
        $subQuery_materiali_calcolo_progettato_alternativo="";
        if(sizeof($materiali_calcolo_progettato_alternativo)>0)
        {
            $subQuery_materiali_calcolo_progettato_alternativo="UNION SELECT SUM(t3.qnt) AS qnt, anagrafica_materiali.raggruppamento, t3.commessa, 'progettato' AS voce, '#DA6969' AS colore
                                                                FROM (SELECT t2.commessa, t.qnt, 
                                                                                                                    CASE WHEN colonna_finitura = 1 THEN finitura_pareti_a WHEN colonna_finitura = 2 THEN finitura_pareti_b WHEN colonna_finitura = 3 THEN finitura_pareti_c WHEN colonna_finitura = 4 THEN finitura_pareti_d WHEN
                                                                                                                    colonna_finitura = 5 THEN finitura_pareti_e END AS finitura
                                                                                        FROM (SELECT mi_db_tecnico.dbo.peso_qnt_cabine.codice_cabina, RIGHT(mi_db_tecnico.dbo.materie_prime.codice_materia_prima, 1) AS colonna_finitura, 
                                                                                                                                            SUM(mi_db_tecnico.dbo.peso_qnt_cabine.qnt_lorda / mi_db_tecnico.dbo.peso_qnt_cabine.confezione) AS qnt, mi_db_tecnico.dbo.peso_qnt_cabine.confezione
                                                                                                                    FROM mi_db_tecnico.dbo.peso_qnt_cabine INNER JOIN
                                                                                                                                            mi_db_tecnico.dbo.materie_prime ON mi_db_tecnico.dbo.peso_qnt_cabine.id_materia_prima = mi_db_tecnico.dbo.materie_prime.id_materia_prima INNER JOIN
                                                                                                                                            mi_db_tecnico.dbo.raggruppamenti_materie_prime ON mi_db_tecnico.dbo.materie_prime.raggruppamento = mi_db_tecnico.dbo.raggruppamenti_materie_prime.id_raggruppamento
                                                                                                                    WHERE (mi_db_tecnico.dbo.raggruppamenti_materie_prime.calcolo_fabbisogno_progettato = 'true')
                                                                                                                    GROUP BY mi_db_tecnico.dbo.peso_qnt_cabine.codice_cabina, RIGHT(mi_db_tecnico.dbo.materie_prime.codice_materia_prima, 1), mi_db_tecnico.dbo.peso_qnt_cabine.confezione) AS t INNER JOIN
                                                                                                                        (SELECT commessa, nr_codice_pareti_kit AS codice_cabina, finitura_pareti_a, finitura_pareti_b, finitura_pareti_c, finitura_pareti_d, finitura_pareti_e
                                                                                                                        FROM dbo.consistenza_commesse) AS t2 ON t.codice_cabina = t2.codice_cabina) AS t3 INNER JOIN
                                                                                            (SELECT id_materiale, nome, descrizione, um, materia_prima, raggruppamento, commessa
                                                                                            FROM dbo.anagrafica_materiali AS anagrafica_materiali_1
                                                                                            WHERE (raggruppamento IN ($materiali_calcolo_progettato_alternativo_in))) AS anagrafica_materiali ON t3.finitura = anagrafica_materiali.nome
                                                                    GROUP BY anagrafica_materiali.raggruppamento, t3.commessa";
        }

        $q="SELECT qnt, commessa, voce, colore, raggruppamento
            FROM (SELECT qnt, raggruppamento, commessa, voce, '#E9A93A' AS colore
                    FROM dbo.raggruppamenti_materiale_calcolato
                    UNION
                    SELECT qnt, raggruppamento, commessa, voce, '#70B085' AS colore
                    FROM dbo.raggruppamenti_materiale_richiesto
                    $subQuery_materiali_calcolo_progettato_normale
                    $subQuery_materiali_calcolo_progettato_alternativo) AS derivedtbl_1
            WHERE (raggruppamento IN ($materiali_statistiche_in))";
    }
    else
    {
        $subQuery_materiali_calcolo_progettato_normale="";
        if(sizeof($materiali_calcolo_progettato_normale)>0)
        {
            $subQuery_materiali_calcolo_progettato_normale="UNION SELECT CONVERT(FLOAT,SUM(mi_db_tecnico.dbo.peso_qnt_cabine.qnt_lorda)/mi_db_tecnico.dbo.peso_qnt_cabine.confezione) AS qnt, dbo.anagrafica_materiali.id_materiale AS materiale, dbo.cabine_commesse_view.commessa, 'progettato' AS voce, '#DA6969' AS colore
                                                            FROM mi_db_tecnico.dbo.peso_qnt_cabine INNER JOIN dbo.anagrafica_materiali ON mi_db_tecnico.dbo.peso_qnt_cabine.id_materia_prima = dbo.anagrafica_materiali.materia_prima INNER JOIN dbo.cabine_commesse_view ON mi_db_tecnico.dbo.peso_qnt_cabine.codice_cabina = dbo.cabine_commesse_view.codice_cabina
                                                            GROUP BY dbo.anagrafica_materiali.id_materiale, dbo.cabine_commesse_view.commessa,mi_db_tecnico.dbo.peso_qnt_cabine.confezione
                                                            HAVING (dbo.anagrafica_materiali.id_materiale IN ($materiali_calcolo_progettato_normale_in))";
        }
        
        $subQuery_materiali_calcolo_progettato_alternativo="";
        if(sizeof($materiali_calcolo_progettato_alternativo)>0)
        {
            $subQuery_materiali_calcolo_progettato_alternativo="UNION SELECT SUM(t3.qnt) AS qnt, anagrafica_materiali.id_materiale, t3.commessa, 'progettato' AS voce, '#DA6969' AS colore
                                                                FROM (SELECT t2.commessa, t.qnt, 
                                                                                                                    CASE WHEN colonna_finitura = 1 THEN finitura_pareti_a WHEN colonna_finitura = 2 THEN finitura_pareti_b WHEN colonna_finitura = 3 THEN finitura_pareti_c WHEN colonna_finitura = 4 THEN finitura_pareti_d WHEN
                                                                                                                    colonna_finitura = 5 THEN finitura_pareti_e END AS finitura
                                                                                        FROM (SELECT mi_db_tecnico.dbo.peso_qnt_cabine.codice_cabina, RIGHT(mi_db_tecnico.dbo.materie_prime.codice_materia_prima, 1) AS colonna_finitura, 
                                                                                                                                            SUM(mi_db_tecnico.dbo.peso_qnt_cabine.qnt_lorda / mi_db_tecnico.dbo.peso_qnt_cabine.confezione) AS qnt, mi_db_tecnico.dbo.peso_qnt_cabine.confezione
                                                                                                                    FROM mi_db_tecnico.dbo.peso_qnt_cabine INNER JOIN
                                                                                                                                            mi_db_tecnico.dbo.materie_prime ON mi_db_tecnico.dbo.peso_qnt_cabine.id_materia_prima = mi_db_tecnico.dbo.materie_prime.id_materia_prima INNER JOIN
                                                                                                                                            mi_db_tecnico.dbo.raggruppamenti_materie_prime ON mi_db_tecnico.dbo.materie_prime.raggruppamento = mi_db_tecnico.dbo.raggruppamenti_materie_prime.id_raggruppamento
                                                                                                                    WHERE (mi_db_tecnico.dbo.raggruppamenti_materie_prime.calcolo_fabbisogno_progettato = 'true')
                                                                                                                    GROUP BY mi_db_tecnico.dbo.peso_qnt_cabine.codice_cabina, RIGHT(mi_db_tecnico.dbo.materie_prime.codice_materia_prima, 1), mi_db_tecnico.dbo.peso_qnt_cabine.confezione) AS t INNER JOIN
                                                                                                                        (SELECT commessa, nr_codice_pareti_kit AS codice_cabina, finitura_pareti_a, finitura_pareti_b, finitura_pareti_c, finitura_pareti_d, finitura_pareti_e
                                                                                                                        FROM dbo.consistenza_commesse) AS t2 ON t.codice_cabina = t2.codice_cabina) AS t3 INNER JOIN
                                                                                            (SELECT id_materiale, nome, descrizione, um, materia_prima, raggruppamento, commessa
                                                                                            FROM dbo.anagrafica_materiali AS anagrafica_materiali_1
                                                                                            WHERE (id_materiale IN ($materiali_calcolo_progettato_alternativo_in))) AS anagrafica_materiali ON t3.finitura = anagrafica_materiali.nome
                                                                    GROUP BY anagrafica_materiali.id_materiale, t3.commessa";
        }

        $q="SELECT qnt, materiale, commessa, voce, colore
            FROM (SELECT qnt, materiale, commessa, voce, '#E9A93A' AS colore
                    FROM dbo.materiale_calcolato
                    UNION
                    SELECT qnt, materiale, commessa, voce, '#70B085' AS colore
                    FROM dbo.materiale_richiesto
                    $subQuery_materiali_calcolo_progettato_normale
                    $subQuery_materiali_calcolo_progettato_alternativo) AS derivedtbl_1 
            WHERE (materiale IN ($materiali_statistiche_in))";
    }

    if($raggruppamentoMateriali)
    {
        $query="SELECT commessa, famiglia,id_raggruppamento,um,SUM(calcolato) AS calcolato,SUM(richiesto) AS richiesto,SUM(progettato) AS progettato ,SUM([delta_richiesto-calcolato]) AS [delta_richiesto-calcolato],SUM([delta_calcolato-progettato]) AS [delta_calcolato-progettato]
        FROM (
        SELECT anagrafica_commesse.nome AS commessa,raggruppamenti_materiali.nome as famiglia,raggruppamenti_materiali.id_raggruppamento,raggruppamenti_materiali.um,convert(float,isnull(PivotTable.calcolato,0)) as calcolato,convert(float,isnull(PivotTable.richiesto,0)) as richiesto,convert(float,isnull(PivotTable.progettato,0)) as progettato , convert(float,isnull(richiesto,0) - isnull(calcolato,0)) as [delta_richiesto-calcolato], convert(float,isnull(calcolato,0)-isnull(progettato,0)) as [delta_calcolato-progettato]
                FROM 
                ($q) AS SourceTable  
                PIVOT  
                (
                sum(qnt)
                FOR voce IN ([calcolato],[richiesto],[progettato])  
                ) AS PivotTable INNER JOIN dbo.raggruppamenti_materiali ON PivotTable.raggruppamento = dbo.raggruppamenti_materiali.id_raggruppamento,anagrafica_commesse WHERE anagrafica_commesse.id_commessa=PivotTable.commessa) AS t GROUP BY commessa, famiglia,id_raggruppamento,um
                ORDER BY commessa";
    }
    else
    {
        $query="SELECT id_raggruppamento,commessa,id_materiale,materiale,um, famiglia,SUM(calcolato) AS calcolato,SUM(richiesto) AS richiesto,SUM(progettato) AS progettato ,SUM([delta_richiesto-calcolato]) AS [delta_richiesto-calcolato], SUM([delta_calcolato-progettato]) AS [delta_calcolato-progettato]
    FROM (SELECT dbo.raggruppamenti_materiali.id_raggruppamento,anagrafica_commesse.nome AS commessa,anagrafica_materiali.id_materiale,anagrafica_materiali.nome as materiale,anagrafica_materiali.um,raggruppamenti_materiali.nome as famiglia,convert(float,isnull(PivotTable.calcolato,0)) as calcolato,convert(float,isnull(PivotTable.richiesto,0)) as richiesto,convert(float,isnull(PivotTable.progettato,0)) as progettato , convert(float,isnull(richiesto,0) - isnull(calcolato,0)) as [delta_richiesto-calcolato], convert(float,isnull(calcolato,0)-isnull(progettato,0)) as [delta_calcolato-progettato]
                FROM 
                ($q) AS SourceTable  
                PIVOT  
                (
                sum(qnt)
                FOR voce IN ([calcolato],[richiesto],[progettato])  
                ) AS PivotTable INNER JOIN dbo.anagrafica_materiali ON PivotTable.materiale = dbo.anagrafica_materiali.id_materiale LEFT OUTER JOIN dbo.raggruppamenti_materiali ON dbo.anagrafica_materiali.raggruppamento = dbo.raggruppamenti_materiali.id_raggruppamento,anagrafica_commesse WHERE anagrafica_materiali.commessa=PivotTable.commessa AND anagrafica_commesse.id_commessa=PivotTable.commessa) AS t
                GROUP BY id_raggruppamento,commessa,id_materiale,materiale,um, famiglia ORDER BY commessa,materiale";
    
    }

    $r=sqlsrv_query($conn,$query);
    if($r==FALSE)
    {
        die("error".$query);
    }
    else
    {
        while($row=sqlsrv_fetch_array($r))
        {
            foreach ($colHeaders as $column)
            {
                if($column!="materiali" && $column!="note")
                {
                    $rowObj[$column]=$row[$column];
                }
            }
            if($raggruppamentoMateriali)
            {
                $rowObj["materiali"]=getMaterialiRaggruppamento($conn,$row["id_raggruppamento"],$row["commessa"]);
            }
            else
            {
                $rowObj["note"]=getNumeroNoteMaterialeCommessa($conn,$row["id_materiale"],$row["commessa"]);
            }
            array_push($data,$rowObj);
        }
    }

    function getMaterialiRaggruppamento($conn,$id_raggruppamento,$commessa)
    {
        $materiali=[];
        $q3="SELECT dbo.anagrafica_materiali.nome
            FROM dbo.raggruppamenti_materiali INNER JOIN dbo.anagrafica_materiali ON dbo.raggruppamenti_materiali.id_raggruppamento = dbo.anagrafica_materiali.raggruppamento INNER JOIN dbo.anagrafica_commesse ON dbo.anagrafica_materiali.commessa = dbo.anagrafica_commesse.id_commessa
            WHERE (dbo.anagrafica_commesse.nome = '$commessa') AND (dbo.raggruppamenti_materiali.id_raggruppamento = $id_raggruppamento)";
        $r3=sqlsrv_query($conn,$q3);
        if($r3==FALSE)
        {
            die("error".$q3);
        }
        else
        {
            while($row3=sqlsrv_fetch_array($r3))
            {
                array_push($materiali,$row3["nome"]);
            }
            return implode(", ",$materiali);
        }
    }
    function getNumeroNoteMaterialeCommessa($conn,$id_materiale,$commessa)
    {
        $q3="SELECT COUNT(dbo.note_materiali_commesse.id_nota) AS note
            FROM dbo.note_materiali_commesse INNER JOIN dbo.anagrafica_commesse ON dbo.note_materiali_commesse.commessa = dbo.anagrafica_commesse.id_commessa
            WHERE (materiale = $id_materiale) AND (dbo.anagrafica_commesse.nome = '$commessa')
            GROUP BY dbo.anagrafica_commesse.nome";
        $r3=sqlsrv_query($conn,$q3);
        if($r3==FALSE)
        {
            die("error".$q3);
        }
        else
        {
            $rows = sqlsrv_has_rows( $r3 );
            if ($rows === true)
            {
                while($row3=sqlsrv_fetch_array($r3))
                {
                    return $row3["note"];
                }
            }
            else
                return 0;            
        }
    }

    $arrayResponse["query"]=$query;
    $arrayResponse["columns"]=$columns;
    $arrayResponse["colHeaders"]=$colHeaders;
    $arrayResponse["data"]=$data;

    echo json_encode($arrayResponse);

?>