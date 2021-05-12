<?php

    include "Session.php";
    include "connessione.php";

    $commessa=$_REQUEST["commessa"];

    $materiali=[];

    $q="SELECT        dbo.dati_importazioni_fabbisogni.materiale, MAX(dbo.dati_importazioni_fabbisogni.um) AS um, dbo.anagrafica_commesse.id_commessa
    FROM            dbo.dati_importazioni_fabbisogni INNER JOIN
                             dbo.anagrafica_commesse ON dbo.dati_importazioni_fabbisogni.commessa = dbo.anagrafica_commesse.nome
    GROUP BY dbo.dati_importazioni_fabbisogni.materiale, dbo.anagrafica_commesse.id_commessa
    HAVING        (dbo.anagrafica_commesse.id_commessa = $commessa)";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error");
    }
    else
    {
        while($row=sqlsrv_fetch_array($r))
        {
            $materiale["materiale"]=$row["materiale"];
            $materiale["um"]=$row["um"];
            
            array_push($materiali,$materiale);
        }
    }

    echo json_encode($materiali);

?>