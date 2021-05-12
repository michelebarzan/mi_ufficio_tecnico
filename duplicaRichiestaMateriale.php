<?php

    include "Session.php";
    include "connessione.php";

    $id_richiesta=$_REQUEST["id_richiesta"];

    $q="INSERT INTO [dbo].[richieste_materiali_calcolo_fabbisogno]
            ([utente]
            ,[dataOra]
            ,[stato]
            ,[commessa]
            ,[tipo]
            ,[note])
        SELECT ".$_SESSION['id_utente']."
            ,GETDATE()
            ,'Aperta'
            ,[commessa]
            ,[tipo]
            ,[note] FROM richieste_materiali_calcolo_fabbisogno WHERE id_richiesta=$id_richiesta";
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
                $newId_richiesta=$row2["id_richiesta"];
            }
            $q3="INSERT INTO [dbo].[dettagli_richieste_materiali_calcolo_fabbisogno]
                    ([materiale]
                    ,[qnt]
                    ,[richiesta]
                    ,[gruppo]
                    ,[formato_1]
                    ,[qnt_formato_1]
                    ,[formato_2]
                    ,[qnt_formato_2])
                SELECT [materiale]
                    ,[qnt]
                    ,$newId_richiesta
                    ,[gruppo]
                    ,[formato_1]
                    ,[qnt_formato_1]
                    ,[formato_2]
                    ,[qnt_formato_2] FROM dettagli_richieste_materiali_calcolo_fabbisogno WHERE richiesta=$id_richiesta";
            $r3=sqlsrv_query($conn,$q3);
            if($r3==FALSE)
            {
                die("error".$q3);
            }
        }
    }

?>