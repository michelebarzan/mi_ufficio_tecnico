<?php

    include "Session.php";
    include "connessione.php";

    $id_commessa=$_REQUEST["id_commessa"];

    $q="SELECT COUNT(*) AS n_cabine
        FROM dbo.consistenza_commesse INNER JOIN
                                    (SELECT id_cabina, codice_cabina, descrizione, utente, um, importazione
                                    FROM mi_db_tecnico.dbo.cabine AS cabine_1
                                    WHERE (codice_cabina <> '') AND (codice_cabina IS NOT NULL)) AS cabine ON dbo.consistenza_commesse.nr_codice_pareti_kit = cabine.codice_cabina
        WHERE (dbo.consistenza_commesse.commessa = $id_commessa) AND (dbo.consistenza_commesse.cabine_sviluppate='s')";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error".$q);
    }
    else
    {
        while($row=sqlsrv_fetch_array($r))
        {
            $totaleCommessa["n_cabine"]=$row["n_cabine"];
        }
        $q2="SELECT COUNT(*) AS cabine_totali
            FROM dbo.consistenza_commesse
            WHERE (commessa = $id_commessa)";
        $r2=sqlsrv_query($conn,$q2);
        if($r2==FALSE)
        {
            die("error".$q2);
        }
        else
        {
            while($row2=sqlsrv_fetch_array($r2))
            {
                $totaleCommessa["cabine_totali"]=$row2["cabine_totali"];
            }
        }
    }

    echo json_encode($totaleCommessa);

?>