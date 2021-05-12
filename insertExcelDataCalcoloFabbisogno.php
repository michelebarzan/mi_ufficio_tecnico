<?php

    include "Session.php";
    include "connessione.php";

    $headers=json_decode($_REQUEST["JSONheaders"]);
    $data=json_decode($_REQUEST["JSONdata"]);
    $id_file=$_REQUEST["id_file"];
    $dataOra=$_REQUEST["dataOra"];

    foreach ($data as $JSONrow)
    {
        $row=json_decode(json_encode($JSONrow,true),true);

        $qnt=str_replace(",",".",$row['qnt']);
        if(!is_numeric($qnt))
            $qnt=0;
        else
            $qnt=$qnt;

        $q="INSERT INTO [dbo].[materiali_calcolo_fabbisogno]
                        ([commessa]
                        ,[gruppo]
                        ,[materiale]
                        ,[qnt]
                        ,[file]
						,[origine]
                        ,[dataOra]
                        ,[note]
                        ,[altezza_sviluppo])
                        VALUES
                        (".$row['commessa']."
                        ,".$row['gruppo']."
                        ,".$row['materiale']."
                        ,".$qnt."
                        ,$id_file
                        ,'file'
                        ,GETDATE()
                        ,'".$row['note']."'
                        ,'".$row['altezza_sviluppo']."')";
        $r=sqlsrv_query($conn,$q);
        if($r==FALSE)
        {
            die("error".$q);
        }
    }

?>