<?php

    include "Session.php";
    include "connessione.php";
    
    $excelFile=$_FILES["excelFile"];

    if (move_uploaded_file($excelFile["tmp_name"],'C:\\xampp\\htdocs\\mi_ufficio_tecnico\\files\\calcoloFabbisogno\\'.basename($excelFile["name"]))) 
    {
        $q4="DELETE FROM [materiali_calcolo_fabbisogno] WHERE [file]= (SELECT id_file FROM file_importazioni_fabbisogni WHERE [nomeFile]='".$excelFile['name']."')";
        $r4=sqlsrv_query($conn,$q4);
        if($r4==FALSE)
        {
            die("error1");
        }
        $q="DELETE FROM [file_importazioni_fabbisogni] WHERE [nomeFile]='".$excelFile['name']."'";
        $r=sqlsrv_query($conn,$q);
        if($r==FALSE)
        {
            die("error2");
        }
        else
        {
            $q2="INSERT INTO [file_importazioni_fabbisogni] ([nomeFile],[utente],[dataOra]) VALUES ('".$excelFile['name']."',".$_SESSION['id_utente'].",GETDATE())";
            $r2=sqlsrv_query($conn,$q2);
            if($r2==FALSE)
            {
                die("error3");
            }
            else
            {
                $q3="SELECT id_file,dataOra FROM [file_importazioni_fabbisogni] WHERE [nomeFile]='".$excelFile['name']."'";
                $r3=sqlsrv_query($conn,$q3);
                if($r3==FALSE)
                {
                    die("error4");
                }
                else
                {
                    while($row3=sqlsrv_fetch_array($r3))
                    {
                        $arrayResponse["id_file"]=$row3["id_file"];
                        $arrayResponse["dataOra"]=$row3["dataOra"];
                        echo json_encode($arrayResponse);
                    }
                }
            }
        }
    }
    else 
        die("error5");

?>