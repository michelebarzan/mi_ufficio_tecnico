<?php

    include "Session.php";
    include "connessione.php";

    set_time_limit(240);

    $raggruppamentoMateriali=$_REQUEST["raggruppamentoMateriali"];
    if($raggruppamentoMateriali=="true")
        $id_raggruppamento=$_REQUEST["id"];
    else
        $id_materiale=$_REQUEST["id"];
    $id_commessa=$_REQUEST["id_commessa"];
    $voce=$_REQUEST["voce"];

    $totali=[];

    if($raggruppamentoMateriali=="true")
    {
        $q="SELECT        SUM(qnt) AS qnt, id_raggruppamento, commessa, id_gruppo, nome
        FROM            (SELECT        SUM(CONVERT(float, dbo.materiali_calcolo_fabbisogno.qnt)) AS qnt, dbo.materiali_calcolo_fabbisogno.commessa, 'calcolato' AS voce, dbo.anagrafica_gruppi.id_gruppo, dbo.anagrafica_gruppi.nome, 
                                                            dbo.raggruppamenti_materiali.id_raggruppamento
                                  FROM            dbo.materiali_calcolo_fabbisogno INNER JOIN
                                                            dbo.anagrafica_gruppi ON dbo.materiali_calcolo_fabbisogno.gruppo = dbo.anagrafica_gruppi.id_gruppo INNER JOIN
                                                            dbo.anagrafica_materiali ON dbo.materiali_calcolo_fabbisogno.materiale = dbo.anagrafica_materiali.id_materiale INNER JOIN
                                                            dbo.raggruppamenti_materiali ON dbo.anagrafica_materiali.raggruppamento = dbo.raggruppamenti_materiali.id_raggruppamento
                                  GROUP BY dbo.materiali_calcolo_fabbisogno.commessa, dbo.anagrafica_gruppi.id_gruppo, dbo.anagrafica_gruppi.nome, dbo.raggruppamenti_materiali.id_raggruppamento
                                  UNION ALL
                                  SELECT        SUM(dbo.dettagli_richieste_materiali_calcolo_fabbisogno.qnt) AS qnt, dbo.richieste_materiali_calcolo_fabbisogno.commessa, 'richiesto' AS voce, anagrafica_gruppi_1.id_gruppo, anagrafica_gruppi_1.nome, 
                         raggruppamenti_materiali_1.id_raggruppamento
FROM            dbo.dettagli_richieste_materiali_calcolo_fabbisogno INNER JOIN
                         dbo.richieste_materiali_calcolo_fabbisogno ON dbo.dettagli_richieste_materiali_calcolo_fabbisogno.richiesta = dbo.richieste_materiali_calcolo_fabbisogno.id_richiesta INNER JOIN
                         dbo.anagrafica_materiali AS anagrafica_materiali_1 ON dbo.dettagli_richieste_materiali_calcolo_fabbisogno.materiale = anagrafica_materiali_1.id_materiale INNER JOIN
                         dbo.raggruppamenti_materiali AS raggruppamenti_materiali_1 ON anagrafica_materiali_1.raggruppamento = raggruppamenti_materiali_1.id_raggruppamento INNER JOIN
                         dbo.anagrafica_gruppi AS anagrafica_gruppi_1 ON dbo.dettagli_richieste_materiali_calcolo_fabbisogno.gruppo = anagrafica_gruppi_1.id_gruppo
GROUP BY dbo.richieste_materiali_calcolo_fabbisogno.commessa, anagrafica_gruppi_1.id_gruppo, anagrafica_gruppi_1.nome, raggruppamenti_materiali_1.id_raggruppamento) AS t
        WHERE        (voce LIKE '$voce')
        GROUP BY id_raggruppamento, commessa, id_gruppo, nome
        HAVING        (commessa = $id_commessa) AND (id_raggruppamento = $id_raggruppamento)";
    }
    else
    {
        $q="SELECT SUM(qnt) AS qnt, materiale, commessa, id_gruppo, nome
        FROM (SELECT SUM(CONVERT(float, dbo.materiali_calcolo_fabbisogno.qnt)) AS qnt, dbo.materiali_calcolo_fabbisogno.materiale, dbo.materiali_calcolo_fabbisogno.commessa, 'calcolato' AS voce, dbo.anagrafica_gruppi.id_gruppo, 
                                                            dbo.anagrafica_gruppi.nome
                                FROM            dbo.materiali_calcolo_fabbisogno INNER JOIN
                                                            dbo.anagrafica_gruppi ON dbo.materiali_calcolo_fabbisogno.gruppo = dbo.anagrafica_gruppi.id_gruppo
                                GROUP BY dbo.materiali_calcolo_fabbisogno.materiale, dbo.materiali_calcolo_fabbisogno.commessa, dbo.anagrafica_gruppi.id_gruppo, dbo.anagrafica_gruppi.nome
                                UNION ALL
                                SELECT        SUM(dbo.dettagli_richieste_materiali_calcolo_fabbisogno.qnt) AS qnt, dbo.dettagli_richieste_materiali_calcolo_fabbisogno.materiale, dbo.richieste_materiali_calcolo_fabbisogno.commessa, 'richiesto' AS voce, 
                         anagrafica_gruppi_1.id_gruppo, anagrafica_gruppi_1.nome
FROM            dbo.dettagli_richieste_materiali_calcolo_fabbisogno INNER JOIN
                         dbo.richieste_materiali_calcolo_fabbisogno ON dbo.dettagli_richieste_materiali_calcolo_fabbisogno.richiesta = dbo.richieste_materiali_calcolo_fabbisogno.id_richiesta INNER JOIN
                         dbo.anagrafica_gruppi AS anagrafica_gruppi_1 ON dbo.dettagli_richieste_materiali_calcolo_fabbisogno.gruppo = anagrafica_gruppi_1.id_gruppo
GROUP BY dbo.dettagli_richieste_materiali_calcolo_fabbisogno.materiale, dbo.richieste_materiali_calcolo_fabbisogno.commessa, anagrafica_gruppi_1.id_gruppo, anagrafica_gruppi_1.nome) AS t
        WHERE (voce LIKE '$voce')
        GROUP BY materiale, commessa, id_gruppo, nome
        HAVING (commessa = $id_commessa) AND (materiale = $id_materiale)";
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
            $totale["qnt"]=$row["qnt"];
            if($raggruppamentoMateriali=="true")
                $totale["raggruppamento"]=$row["id_raggruppamento"];
            else
                $totale["materiale"]=$row["materiale"];
            $totale["commessa"]=$row["commessa"];
            //$totale["voce"]=$row["voce"];
            $totale["id_gruppo"]=$row["id_gruppo"];
            $totale["nome"]=$row["nome"];
            
            array_push($totali,$totale);
        }
    }

    echo json_encode($totali);

?>