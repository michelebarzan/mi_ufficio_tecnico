<?php

    include "Session.php";
    include "connessione.php";
    
    $fileName=$_REQUEST["fileName"];
    $copyFileName=str_replace(".xlsx","",$fileName);

    $q2="SELECT * FROM [file_importazioni_fabbisogni] WHERE [nomeFile]='".$fileName."'";
    $r2=sqlsrv_query($conn,$q2);
    if($r2==FALSE)
    {
        die("error3");
    }
    else
    {
        $rows = sqlsrv_has_rows( $r2 );
        if ($rows === true)
        {
            $q="SELECT ISNULL(MAX(versione), 0) + 1 AS versione
                FROM dbo.storico_file_importazione_fabbisogni
                WHERE (nomeFile = '$fileName')";
            $r=sqlsrv_query($conn,$q);
            if($r==FALSE)
            {
                die("error2");
            }
            else
            {
                while($row=sqlsrv_fetch_array($r))
                {
                    $versione=$row["versione"];
                }

                copy("C:\\xampp\\htdocs\\mi_ufficio_tecnico\\files\\calcoloFabbisogno\\".$fileName,"C:\\xampp\\htdocs\\mi_ufficio_tecnico\\files\\calcoloFabbisogno\\history\\".$copyFileName."_".$versione.".xlsx");

                $q3="INSERT INTO [dbo].[storico_file_importazione_fabbisogni]
                            ([nomeFile]
                            ,[utente]
                            ,[dataOra]
                            ,[versione])
                    VALUES 
                            ('$fileName'
                            ,".$_SESSION['id_utente']."
                            ,GETDATE()
                            ,$versione)";
                $r3=sqlsrv_query($conn,$q3);
                if($r3==FALSE)
                {
                    die("error4");
                }
            }
        }
    }

?>