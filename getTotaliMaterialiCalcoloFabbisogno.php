<?php

    include "Session.php";
    include "connessione.php";

    set_time_limit(240);

    $materiali_statistiche=json_decode($_REQUEST["JSONmateriali_statistiche"]);
    $id_commessa=$_REQUEST["id_commessa"];
    $raggruppamentoMateriali=$_REQUEST["raggruppamentoMateriali"];

    $materiali_calcolo_progettato_alternativo=[];
    $materiali_calcolo_progettato_normale=[];

    $materiali_statistiche_in=implode(",",$materiali_statistiche);

    if($raggruppamentoMateriali=="true")
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

    if($raggruppamentoMateriali=="true")
    {
        $subQuery_materiali_calcolo_progettato_normale="";
        if(sizeof($materiali_calcolo_progettato_normale)>0)
        {
            /*$subQuery_materiali_calcolo_progettato_normale="UNION SELECT CONVERT(FLOAT,SUM(mi_db_tecnico.dbo.peso_qnt_cabine.qnt_lorda)/mi_db_tecnico.dbo.peso_qnt_cabine.confezione) AS qnt, dbo.anagrafica_materiali.raggruppamento, dbo.cabine_commesse_view.commessa, 'progettato' AS voce, '#DA6969' AS colore
                                                            FROM mi_db_tecnico.dbo.peso_qnt_cabine INNER JOIN dbo.anagrafica_materiali ON mi_db_tecnico.dbo.peso_qnt_cabine.id_materia_prima = dbo.anagrafica_materiali.materia_prima INNER JOIN dbo.cabine_commesse_view ON mi_db_tecnico.dbo.peso_qnt_cabine.codice_cabina = dbo.cabine_commesse_view.codice_cabina
                                                            GROUP BY dbo.anagrafica_materiali.raggruppamento, dbo.cabine_commesse_view.commessa,mi_db_tecnico.dbo.peso_qnt_cabine.confezione
                                                            HAVING (dbo.cabine_commesse_view.commessa = $id_commessa)  AND (dbo.anagrafica_materiali.raggruppamento IN ($materiali_calcolo_progettato_normale_in))";*/
															
			$subQuery_materiali_calcolo_progettato_normale="UNION SELECT SUM(qnt) AS qnt, raggruppamento, commessa, voce, colore
															FROM (SELECT CONVERT(FLOAT, mi_db_tecnico.dbo.peso_qnt_cabine.qnt_lorda / mi_db_tecnico.dbo.peso_qnt_cabine.confezione) AS qnt, anagrafica_materiali_2.raggruppamento, dbo.cabine_commesse_view.commessa, 
																												'progettato' AS voce, '#DA6969' AS colore
																					  FROM mi_db_tecnico.dbo.peso_qnt_cabine INNER JOIN
																												dbo.anagrafica_materiali AS anagrafica_materiali_2 ON mi_db_tecnico.dbo.peso_qnt_cabine.id_materia_prima = anagrafica_materiali_2.materia_prima INNER JOIN
																												dbo.cabine_commesse_view ON mi_db_tecnico.dbo.peso_qnt_cabine.codice_cabina = dbo.cabine_commesse_view.codice_cabina
																					  WHERE (dbo.cabine_commesse_view.commessa = $id_commessa) AND (anagrafica_materiali_2.raggruppamento IN ($materiali_calcolo_progettato_normale_in))) AS t
															GROUP BY raggruppamento, commessa, voce, colore";
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
                                                                                                                        (SELECT commessa, nr_codice_pareti_kit AS codice_cabina, finitura_pareti_a, finitura_pareti_b, finitura_pareti_c, finitura_pareti_d, finitura_pareti_e, n_cabina
                                                                                                                        FROM dbo.consistenza_commesse
                                                                                                                        WHERE (commessa = $id_commessa) AND cabine_sviluppate='s') AS t2 ON t.codice_cabina = t2.codice_cabina) AS t3 INNER JOIN
                                                                                            (SELECT id_materiale, nome, descrizione, um, materia_prima, raggruppamento, commessa
                                                                                            FROM dbo.anagrafica_materiali AS anagrafica_materiali_1
                                                                                            WHERE commessa=$id_commessa AND (raggruppamento IN ($materiali_calcolo_progettato_alternativo_in))) AS anagrafica_materiali ON t3.finitura = anagrafica_materiali.nome
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
            WHERE (commessa = $id_commessa) AND (raggruppamento IN ($materiali_statistiche_in))";
    }
    else
    {
        $subQuery_materiali_calcolo_progettato_normale="";
        if(sizeof($materiali_calcolo_progettato_normale)>0)
        {
            $subQuery_materiali_calcolo_progettato_normale="UNION SELECT CONVERT(FLOAT,SUM(mi_db_tecnico.dbo.peso_qnt_cabine.qnt_lorda)/mi_db_tecnico.dbo.peso_qnt_cabine.confezione) AS qnt, dbo.anagrafica_materiali.id_materiale AS materiale, dbo.cabine_commesse_view.commessa, 'progettato' AS voce, '#DA6969' AS colore
                                                            FROM mi_db_tecnico.dbo.peso_qnt_cabine INNER JOIN dbo.anagrafica_materiali ON mi_db_tecnico.dbo.peso_qnt_cabine.id_materia_prima = dbo.anagrafica_materiali.materia_prima INNER JOIN dbo.cabine_commesse_view ON mi_db_tecnico.dbo.peso_qnt_cabine.codice_cabina = dbo.cabine_commesse_view.codice_cabina
                                                            GROUP BY dbo.anagrafica_materiali.id_materiale, dbo.cabine_commesse_view.commessa,mi_db_tecnico.dbo.peso_qnt_cabine.confezione
                                                            HAVING (dbo.cabine_commesse_view.commessa = $id_commessa)  AND (dbo.anagrafica_materiali.id_materiale IN ($materiali_calcolo_progettato_normale_in))";
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
                                                                                                                        (SELECT commessa, nr_codice_pareti_kit AS codice_cabina, finitura_pareti_a, finitura_pareti_b, finitura_pareti_c, finitura_pareti_d, finitura_pareti_e, n_cabina
                                                                                                                        FROM dbo.consistenza_commesse
                                                                                                                        WHERE (commessa = $id_commessa) AND cabine_sviluppate='s') AS t2 ON t.codice_cabina = t2.codice_cabina) AS t3 INNER JOIN
                                                                                            (SELECT id_materiale, nome, descrizione, um, materia_prima, raggruppamento, commessa
                                                                                            FROM dbo.anagrafica_materiali AS anagrafica_materiali_1
                                                                                            WHERE commessa=$id_commessa AND (id_materiale IN ($materiali_calcolo_progettato_alternativo_in))) AS anagrafica_materiali ON t3.finitura = anagrafica_materiali.nome
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
            WHERE (commessa = $id_commessa) AND (materiale IN ($materiali_statistiche_in))";
    }
	
	//echo $q;
    
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error".$q);
    }
    else
    {
        while($row=sqlsrv_fetch_array($r))
        {
            $totale["qnt"]=$row["qnt"];
            if($raggruppamentoMateriali=="true")
                $totale["raggruppamento"]=$row["raggruppamento"];
            else
                $totale["materiale"]=$row["materiale"];
            $totale["commessa"]=$row["commessa"];
            $totale["voce"]=$row["voce"];
            $totale["colore"]=$row["colore"];
            
            array_push($totali,$totale);
        }
    }

    echo json_encode($totali);
    
?>