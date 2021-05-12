<?php

    include "Session.php";
    include "connessione.php";

    $id_commessa=$_REQUEST["id_commessa"];
    $id_gruppo=$_REQUEST["id_gruppo"];
    $id_materiale=$_REQUEST["id_materiale"];

    $responseObj["calcolato"]=0;
    $responseObj["richiesto"]=0;

    $q2="SELECT SUM(CONVERT(float, qnt)) AS qnt
        FROM dbo.materiali_calcolo_fabbisogno
        GROUP BY materiale, commessa, gruppo
        HAVING (gruppo = $id_gruppo) AND (materiale = $id_materiale) AND (commessa = $id_commessa)";
    $r2=sqlsrv_query($conn,$q2);
    if($r2==FALSE)
    {
        die("error");
    }
    else
    {
        while($row2=sqlsrv_fetch_array($r2))
        {
            $responseObj["calcolato"]=$row2["qnt"];
        }
    }

    $q="SELECT SUM(dbo.dettagli_richieste_materiali_calcolo_fabbisogno.qnt) AS qnt
        FROM dbo.dettagli_richieste_materiali_calcolo_fabbisogno INNER JOIN dbo.richieste_materiali_calcolo_fabbisogno ON dbo.dettagli_richieste_materiali_calcolo_fabbisogno.richiesta = dbo.richieste_materiali_calcolo_fabbisogno.id_richiesta
        GROUP BY dbo.dettagli_richieste_materiali_calcolo_fabbisogno.materiale, dbo.richieste_materiali_calcolo_fabbisogno.commessa, dbo.dettagli_richieste_materiali_calcolo_fabbisogno.gruppo
        HAVING (dbo.dettagli_richieste_materiali_calcolo_fabbisogno.materiale = $id_materiale) AND (dbo.richieste_materiali_calcolo_fabbisogno.commessa = $id_commessa) AND (dbo.dettagli_richieste_materiali_calcolo_fabbisogno.gruppo = $id_gruppo)";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error".$q);
    }
    else
    {
        while($row=sqlsrv_fetch_array($r))
        {
            $responseObj["richiesto"]=$row["qnt"];
        }
    }

    echo json_encode($responseObj);
    
?>