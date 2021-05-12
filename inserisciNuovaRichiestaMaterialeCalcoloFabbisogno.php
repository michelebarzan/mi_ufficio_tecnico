<?php

    include "Session.php";
    include "connessione.php";

    $note=str_replace("'","''",$_REQUEST["note"]);
    $commessa=$_REQUEST["commessa"];
    $tipo=$_REQUEST["tipo"];
    $righe_dettagli_richieste_materiali_calcolo_fabbisogno=json_decode($_REQUEST["JSONrighe_dettagli_richieste_materiali_calcolo_fabbisogno"]);

    $q="INSERT INTO [dbo].[richieste_materiali_calcolo_fabbisogno]
            ([utente]
            ,[dataOra]
            ,[stato]
            ,[commessa]
            ,[note]
            ,[tipo])
        VALUES
            (".$_SESSION['id_utente']."
            ,GETDATE()
            ,'Aperta'
            ,'$commessa'
            ,'$note'
            ,'$tipo')";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error".$q);
    }
    else
    {
        $q2="SELECT MAX(id_richiesta) AS id_richiesta FROM richieste_materiali_calcolo_fabbisogno WHERE utente=".$_SESSION['id_utente'];
        $r2=sqlsrv_query($conn,$q2);
        if($r==FALSE)
        {
            die("error".$q2);
        }
        else
        {
            while($row2=sqlsrv_fetch_array($r2))
            {
                $id_richiesta=$row2["id_richiesta"];
            }
            foreach($righe_dettagli_richieste_materiali_calcolo_fabbisogno as $JSONriga_dettagli_richieste_materiali_calcolo_fabbisogno)
            {
                $riga_dettagli_richieste_materiali_calcolo_fabbisogno=json_decode(json_encode($JSONriga_dettagli_richieste_materiali_calcolo_fabbisogno,true),true);
                $q3="INSERT INTO [dbo].[dettagli_richieste_materiali_calcolo_fabbisogno]
                        ([materiale]
                        ,[qnt]
                        ,[richiesta]
                        ,[gruppo]
                        ,[formato_1]
                        ,[qnt_formato_1]
                        ,[formato_2]
                        ,[qnt_formato_2])
                    VALUES
                        (".$riga_dettagli_richieste_materiali_calcolo_fabbisogno['id_materiale']."
                        ,".$riga_dettagli_richieste_materiali_calcolo_fabbisogno['qnt']."
                        ,$id_richiesta
                        ,".$riga_dettagli_richieste_materiali_calcolo_fabbisogno['id_gruppo']."
                        ,".$riga_dettagli_richieste_materiali_calcolo_fabbisogno['formato_1']."
                        ,".$riga_dettagli_richieste_materiali_calcolo_fabbisogno['qnt_formato_1']."
                        ,".$riga_dettagli_richieste_materiali_calcolo_fabbisogno['formato_2']."
                        ,".$riga_dettagli_richieste_materiali_calcolo_fabbisogno['qnt_formato_2'].")";
                $r3=sqlsrv_query($conn,$q3);
                if($r3==FALSE)
                {
                    die("error".$q3);
                }
            }
            echo $id_richiesta;
        }
    }

?>