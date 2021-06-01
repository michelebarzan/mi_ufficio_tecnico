<?php

    include "Session.php";
    include "connessione.php";

    $id_commessa=$_REQUEST["id_commessa"];
    $id_gruppo=$_REQUEST["id_gruppo"];
    $id_materiale=$_REQUEST["id_materiale"];

    $data=[];

    $q2="SELECT altezza_sviluppo as altezza,isnull(calcolato,0) AS calcolato,isnull(richiesto,0) AS richiesto
        FROM  
        (
            SELECT qnt, voce, altezza_sviluppo
            FROM (SELECT SUM(CONVERT(float, qnt)) AS qnt, 'calcolato' AS voce, altezza_sviluppo
                                FROM dbo.materiali_calcolo_fabbisogno
                                GROUP BY materiale, commessa, gruppo, altezza_sviluppo
                                HAVING (gruppo = $id_gruppo) AND (materiale = $id_materiale) AND (commessa = $id_commessa)
                                UNION
                                SELECT SUM(dbo.dettagli_richieste_materiali_calcolo_fabbisogno.qnt) AS qnt, 'richiesto' AS voce, dbo.formati_lamiere.altezza
                                FROM dbo.dettagli_richieste_materiali_calcolo_fabbisogno INNER JOIN
                                                        dbo.richieste_materiali_calcolo_fabbisogno ON dbo.dettagli_richieste_materiali_calcolo_fabbisogno.richiesta = dbo.richieste_materiali_calcolo_fabbisogno.id_richiesta LEFT OUTER JOIN
                                                        dbo.formati_lamiere ON dbo.dettagli_richieste_materiali_calcolo_fabbisogno.formato_1 = dbo.formati_lamiere.id_formato
                                GROUP BY dbo.dettagli_richieste_materiali_calcolo_fabbisogno.materiale, dbo.richieste_materiali_calcolo_fabbisogno.commessa, dbo.dettagli_richieste_materiali_calcolo_fabbisogno.gruppo, 
                                                        dbo.formati_lamiere.altezza
                                                        HAVING (dbo.dettagli_richieste_materiali_calcolo_fabbisogno.materiale = $id_materiale) AND (dbo.richieste_materiali_calcolo_fabbisogno.commessa = $id_commessa) AND (dbo.dettagli_richieste_materiali_calcolo_fabbisogno.gruppo = $id_gruppo)) AS t
        ) AS SourceTable  
        PIVOT  
        (  
            sum(qnt)  
            FOR voce IN ([calcolato], [richiesto])  
        ) AS PivotTable";
    $r2=sqlsrv_query($conn,$q2);
    if($r2==FALSE)
    {
        die("error");
    }
    else
    {
        while($row2=sqlsrv_fetch_array($r2))
        {
            $row["altezza"]=$row2["altezza"];
            $row["calcolato"]=$row2["calcolato"];
            $row["richiesto"]=$row2["richiesto"];

            array_push($data,$row);
        }
    }

    echo json_encode($data);

?>