<?php

    include "Session.php";
    include "connessione.php";

    $commessa=$_REQUEST["commessa"];
    $utente=$_REQUEST["utente"];
    $orderBy=$_REQUEST["orderBy"];
    
    $files=[];

    if($utente=="*")
        $q="SELECT DISTINCT 
                    dbo.file_importazioni_fabbisogni.id_file, dbo.file_importazioni_fabbisogni.nomeFile, dbo.file_importazioni_fabbisogni.utente, dbo.file_importazioni_fabbisogni.dataOra, dbo.dati_importazioni_fabbisogni.commessa, 
                    dbo.anagrafica_commesse.id_commessa, MAX(ISNULL(dbo.storico_file_importazione_fabbisogni.versione, 0)) AS versioni
            FROM            dbo.file_importazioni_fabbisogni INNER JOIN
                    dbo.dati_importazioni_fabbisogni ON dbo.file_importazioni_fabbisogni.id_file = dbo.dati_importazioni_fabbisogni.[file] INNER JOIN
                    dbo.anagrafica_commesse ON dbo.dati_importazioni_fabbisogni.commessa = dbo.anagrafica_commesse.nome LEFT OUTER JOIN
                    dbo.storico_file_importazione_fabbisogni ON dbo.file_importazioni_fabbisogni.nomeFile = dbo.storico_file_importazione_fabbisogni.nomeFile
            GROUP BY dbo.file_importazioni_fabbisogni.id_file, dbo.file_importazioni_fabbisogni.nomeFile, dbo.file_importazioni_fabbisogni.utente, dbo.file_importazioni_fabbisogni.dataOra, dbo.dati_importazioni_fabbisogni.commessa, 
                    dbo.anagrafica_commesse.id_commessa
            HAVING (dbo.anagrafica_commesse.id_commessa = $commessa) ORDER BY $orderBy DESC";
    else
        $q="SELECT DISTINCT 
                    dbo.file_importazioni_fabbisogni.id_file, dbo.file_importazioni_fabbisogni.nomeFile, dbo.file_importazioni_fabbisogni.utente, dbo.file_importazioni_fabbisogni.dataOra, dbo.dati_importazioni_fabbisogni.commessa, 
                    dbo.anagrafica_commesse.id_commessa, MAX(ISNULL(dbo.storico_file_importazione_fabbisogni.versione, 0)) AS versioni
            FROM            dbo.file_importazioni_fabbisogni INNER JOIN
                    dbo.dati_importazioni_fabbisogni ON dbo.file_importazioni_fabbisogni.id_file = dbo.dati_importazioni_fabbisogni.[file] INNER JOIN
                    dbo.anagrafica_commesse ON dbo.dati_importazioni_fabbisogni.commessa = dbo.anagrafica_commesse.nome LEFT OUTER JOIN
                    dbo.storico_file_importazione_fabbisogni ON dbo.file_importazioni_fabbisogni.nomeFile = dbo.storico_file_importazione_fabbisogni.nomeFile
            GROUP BY dbo.file_importazioni_fabbisogni.id_file, dbo.file_importazioni_fabbisogni.nomeFile, dbo.file_importazioni_fabbisogni.utente, dbo.file_importazioni_fabbisogni.dataOra, dbo.dati_importazioni_fabbisogni.commessa, 
                    dbo.anagrafica_commesse.id_commessa
            HAVING (dbo.file_importazioni_fabbisogni.utente = $utente) AND (dbo.anagrafica_commesse.id_commessa = $commessa) ORDER BY $orderBy DESC";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error".$q);
    }
    else
    {
        while($row=sqlsrv_fetch_array($r))
        {
            $file["id_file"]=$row["id_file"];
            $file["nomeFile"]=$row["nomeFile"];
            $file["utente"]=$row["utente"];
            $file["dataOra"]=$row["dataOra"]->format('d/m/Y H:i:s');
            $file["commessa"]=$row["commessa"];
            $file["versioni"]=$row["versioni"];
            
            array_push($files,$file);
        }
    }


    echo json_encode($files);

?>