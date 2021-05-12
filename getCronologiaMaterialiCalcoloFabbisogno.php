<?php

    include "Session.php";
    include "connessione.php";

    $materiali_statistiche=json_decode($_REQUEST["JSONmateriali_statistiche"]);
    $id_commessa=$_REQUEST["id_commessa"];
    $raggruppamentoMateriali=$_REQUEST["raggruppamentoMateriali"];

    $materiali_in=implode(",",$materiali_statistiche);

    $cronologiaMateriali=[];

    if($raggruppamentoMateriali=="true")
    {
        $q="SELECT        TOP (100) PERCENT qnt, anno, mese, giorno, id_raggruppamento, nome, um, colore, voce
        FROM            (SELECT        qnt, anno, CASE WHEN len(mese) = 1 THEN concat('0', mese) ELSE mese END AS mese, CASE WHEN len(giorno) = 1 THEN concat('0', giorno) ELSE giorno END AS giorno, id_raggruppamento, nome, um, colore, 
                                                            voce
                                  FROM            (SELECT        TOP (100) PERCENT SUM(qnt) AS qnt, CONVERT(varchar(MAX), DATEPART(yy, dataOra)) AS anno, CONVERT(varchar(MAX), DATEPART(mm, dataOra)) AS mese, CONVERT(varchar(MAX), DATEPART(dd, 
                                                                                      dataOra)) AS giorno, id_raggruppamento, nome, um, colore, voce
                                                            FROM            (SELECT        dbo.dettagli_richieste_materiali_calcolo_fabbisogno.qnt, dbo.richieste_materiali_calcolo_fabbisogno.dataOra, '#70B085' AS colore, 'richiesto' AS voce, dbo.raggruppamenti_materiali.nome, 
                                                                                                                dbo.raggruppamenti_materiali.um, dbo.raggruppamenti_materiali.id_raggruppamento
                                                                                      FROM            dbo.dettagli_richieste_materiali_calcolo_fabbisogno INNER JOIN
                                                                                                                dbo.richieste_materiali_calcolo_fabbisogno ON dbo.dettagli_richieste_materiali_calcolo_fabbisogno.richiesta = dbo.richieste_materiali_calcolo_fabbisogno.id_richiesta INNER JOIN
                                                                                                                dbo.anagrafica_materiali ON dbo.dettagli_richieste_materiali_calcolo_fabbisogno.materiale = dbo.anagrafica_materiali.id_materiale INNER JOIN
                                                                                                                dbo.raggruppamenti_materiali ON dbo.anagrafica_materiali.raggruppamento = dbo.raggruppamenti_materiali.id_raggruppamento
                                                                                      WHERE        (dbo.richieste_materiali_calcolo_fabbisogno.commessa = $id_commessa) AND (dbo.raggruppamenti_materiali.id_raggruppamento IN ($materiali_in))
                                                                                      UNION ALL
                                                                                      SELECT        dbo.materiali_calcolo_fabbisogno.qnt, CASE WHEN dbo.materiali_calcolo_fabbisogno.[file] IS NULL 
                                                                                                               THEN dbo.materiali_calcolo_fabbisogno.dataOra ELSE dbo.file_importazioni_fabbisogni.dataOra END AS dataOra, '#E9A93A' AS colore, 'calcolato' AS voce, raggruppamenti_materiali_1.nome,
                                                                                                                raggruppamenti_materiali_1.um, raggruppamenti_materiali_1.id_raggruppamento
                                                                                      FROM            dbo.materiali_calcolo_fabbisogno INNER JOIN
                                                                                                               dbo.anagrafica_materiali AS anagrafica_materiali_1 ON dbo.materiali_calcolo_fabbisogno.materiale = anagrafica_materiali_1.id_materiale INNER JOIN
                                                                                                               dbo.raggruppamenti_materiali AS raggruppamenti_materiali_1 ON anagrafica_materiali_1.raggruppamento = raggruppamenti_materiali_1.id_raggruppamento LEFT OUTER JOIN
                                                                                                               dbo.file_importazioni_fabbisogni ON dbo.materiali_calcolo_fabbisogno.[file] = dbo.file_importazioni_fabbisogni.id_file
                                                                                      WHERE        (dbo.materiali_calcolo_fabbisogno.commessa = $id_commessa) AND (raggruppamenti_materiali_1.id_raggruppamento IN ($materiali_in))) AS t
                                                            GROUP BY CONVERT(varchar(MAX), DATEPART(yy, dataOra)), id_raggruppamento, nome, um, colore, voce, CONVERT(varchar(MAX), DATEPART(mm, dataOra)), CONVERT(varchar(MAX), DATEPART(dd, dataOra))) 
                                                            AS derivedtbl_1) AS derivedtbl_2
        ORDER BY anno ASC, mese ASC, giorno ASC";
    }
    else
    {
        $q="SELECT        qnt, anno, mese, giorno, materiale, nome, um, colore, voce
        FROM            (SELECT        qnt, anno, CASE WHEN len(mese) = 1 THEN concat('0', mese) ELSE mese END AS mese, CASE WHEN len(giorno) = 1 THEN concat('0', giorno) ELSE giorno END AS giorno, materiale, nome, um, colore, voce
                                  FROM            (SELECT        TOP (100) PERCENT SUM(qnt) AS qnt, CONVERT(varchar(MAX), DATEPART(yy, dataOra)) AS anno, CONVERT(varchar(MAX), DATEPART(mm, dataOra)) AS mese, CONVERT(varchar(MAX), DATEPART(dd, 
                                                                                      dataOra)) AS giorno, materiale, nome, um, colore, voce
                                                            FROM            (SELECT        dbo.dettagli_richieste_materiali_calcolo_fabbisogno.qnt, dbo.richieste_materiali_calcolo_fabbisogno.dataOra, dbo.dettagli_richieste_materiali_calcolo_fabbisogno.materiale, 
                                                                                                                dbo.anagrafica_materiali.nome, dbo.anagrafica_materiali.um, '#70B085' AS colore, 'richiesto' AS voce
                                                                                      FROM            dbo.dettagli_richieste_materiali_calcolo_fabbisogno INNER JOIN
                                                                                                                dbo.richieste_materiali_calcolo_fabbisogno ON dbo.dettagli_richieste_materiali_calcolo_fabbisogno.richiesta = dbo.richieste_materiali_calcolo_fabbisogno.id_richiesta INNER JOIN
                                                                                                                dbo.anagrafica_materiali ON dbo.dettagli_richieste_materiali_calcolo_fabbisogno.materiale = dbo.anagrafica_materiali.id_materiale
                                                                                      WHERE        (dbo.richieste_materiali_calcolo_fabbisogno.commessa = $id_commessa) AND (dbo.dettagli_richieste_materiali_calcolo_fabbisogno.materiale IN ($materiali_in))
                                                                                      UNION ALL
                                                                                      SELECT        dbo.materiali_calcolo_fabbisogno.qnt, CASE WHEN dbo.materiali_calcolo_fabbisogno.[file] IS NULL 
                                                                                                               THEN dbo.materiali_calcolo_fabbisogno.dataOra ELSE dbo.file_importazioni_fabbisogni.dataOra END AS dataOra, dbo.materiali_calcolo_fabbisogno.materiale, anagrafica_materiali_1.nome, 
                                                                                                               anagrafica_materiali_1.um, '#E9A93A' AS colore, 'calcolato' AS voce
                                                                                      FROM            dbo.materiali_calcolo_fabbisogno INNER JOIN
                                                                                                               dbo.anagrafica_materiali AS anagrafica_materiali_1 ON dbo.materiali_calcolo_fabbisogno.materiale = anagrafica_materiali_1.id_materiale LEFT OUTER JOIN
                                                                                                               dbo.file_importazioni_fabbisogni ON dbo.materiali_calcolo_fabbisogno.[file] = dbo.file_importazioni_fabbisogni.id_file
                                                                                      WHERE        (dbo.materiali_calcolo_fabbisogno.commessa = $id_commessa) AND (dbo.materiali_calcolo_fabbisogno.materiale IN ($materiali_in))) AS t
                                                            GROUP BY CONVERT(varchar(MAX), DATEPART(yy, dataOra)), materiale, nome, um, colore, voce, CONVERT(varchar(MAX), DATEPART(mm, dataOra)), CONVERT(varchar(MAX), DATEPART(dd, dataOra))) 
                                                            AS derivedtbl_1) AS derivedtbl_2 ORDER BY anno ASC , mese ASC , giorno ASC";
    }
    
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error".$q);
    }
    else
    {
        while($row=sqlsrv_fetch_array($r))
        {
            $cronologiaMateriale["qnt"]=$row["qnt"];
            //$cronologiaMateriale["dataOra"]=$row["dataOra"];
            $cronologiaMateriale["dataOraString"]=$row["giorno"].'/'.$row["mese"].'/'.$row["anno"];
            $cronologiaMateriale["giorno"]=$row["giorno"];
            $cronologiaMateriale["mese"]=$row["mese"];
            $cronologiaMateriale["anno"]=$row["anno"];
            if($raggruppamentoMateriali=="true")
                $cronologiaMateriale["id_raggruppamento"]=$row["id_raggruppamento"];
            else
                $cronologiaMateriale["materiale"]=$row["materiale"];
            $cronologiaMateriale["nome"]=$row["nome"];
            $cronologiaMateriale["um"]=$row["um"];
            $cronologiaMateriale["colore"]=$row["colore"];
            $cronologiaMateriale["voce"]=$row["voce"];
            
            array_push($cronologiaMateriali,$cronologiaMateriale);
        }
    }

    echo json_encode($cronologiaMateriali);

?>