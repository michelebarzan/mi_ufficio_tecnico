<?php

    include "Session.php";
    include "connessione.php";

    $commessa=$_REQUEST["commessa"];
    $materiale=$_REQUEST["materiale"];

    $cronologia["commessa"]=$commessa;
    $cronologia["materiale"]=$materiale;
    $q2="SELECT um FROM anagrafica_materiali WHERE id_materiale=$materiale";
    $r2=sqlsrv_query($conn,$q2);
    if($r2==FALSE)
    {
        die("error".$q2);
    }
    else
    {
        while($row2=sqlsrv_fetch_array($r2))
        {
            $cronologia["um"]=$row2["um"];
        }
    }
    $q3="SELECT ISNULL(SUM(dbo.dettagli_richieste_materiali_calcolo_fabbisogno.qnt),0) AS qnt
        FROM dbo.dettagli_richieste_materiali_calcolo_fabbisogno INNER JOIN dbo.richieste_materiali_calcolo_fabbisogno ON dbo.dettagli_richieste_materiali_calcolo_fabbisogno.richiesta = dbo.richieste_materiali_calcolo_fabbisogno.id_richiesta
        WHERE (commessa = '$commessa') AND materiale='$materiale'";
    $r3=sqlsrv_query($conn,$q3);
    if($r3==FALSE)
    {
        die("error".$q3);
    }
    else
    {
        while($row3=sqlsrv_fetch_array($r3))
        {
            $cronologia["totaleRichieste"]=$row3["qnt"];
        }
    }
    $q4="SELECT ISNULL(SUM(CONVERT(float, qnt)),0) AS qnt
        FROM dbo.materiali_calcolo_fabbisogno
        WHERE (commessa = $commessa) AND materiale=$materiale";
    $r4=sqlsrv_query($conn,$q4);
    if($r4==FALSE)
    {
        die("error".$q4);
    }
    else
    {
        while($row4=sqlsrv_fetch_array($r4))
        {
            $cronologia["fabbisogno"]=$row4["qnt"];
        }
    }
    if($cronologia["fabbisogno"]==0)
        $cronologia["percentuale"]=100;
    else
        $cronologia["percentuale"]=($cronologia["totaleRichieste"]*100)/$cronologia["fabbisogno"];

    echo json_encode($cronologia);

?>