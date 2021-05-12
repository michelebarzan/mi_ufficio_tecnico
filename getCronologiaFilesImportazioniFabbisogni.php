<?php

    include "Session.php";
    include "connessione.php";

    $nomeFile=$_REQUEST["nomeFile"];
    
    $files=[];

    $q="SELECT [id_file]
            ,[nomeFile]
            ,[utente]
            ,[dataOra]
            ,[versione]
        FROM [mi_webapp].[dbo].[storico_file_importazione_fabbisogni] WHERE nomeFile='$nomeFile'";
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
            $file["versione"]=$row["versione"];
            
            array_push($files,$file);
        }
    }


    echo json_encode($files);

?>