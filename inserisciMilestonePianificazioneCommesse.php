<?php

    $database="mi_pianificazione";
    include "connessioneDb.php";

    $prima_dopo=$_REQUEST["prima_dopo"];
    $milestone_principale=$_REQUEST["milestone_principale"];
    $settimane=$_REQUEST["settimane"];
    $nome=str_replace("'","",$_REQUEST["nome"]);
    $descrizione=str_replace("'","''",$_REQUEST["descrizione"]);

    $q7="INSERT INTO [dbo].[anagrafica_milestones] ([nome],[descrizione],[settimane],[prima_dopo],[milestone_principale])
        VALUES ('$nome','$descrizione',$settimane,'$prima_dopo',$milestone_principale)";
    $r7=sqlsrv_query($conn,$q7);
    if($r7==FALSE)
    {
        die("error".$q7);
    }

    $q8="SELECT id_milestone, nome, descrizione, troncone, id_milestone_principale, anno_settimana, anno, settimana
            FROM dbo.milestones
            WHERE (id_milestone IN (SELECT MAX(id_milestone) AS id_milestone FROM dbo.anagrafica_milestones AS anagrafica_milestones_1 WHERE (nome = '$nome')))";
        $r8=sqlsrv_query($conn,$q8);
        if($r8==FALSE)
        {
            die("error".$q8);
        }
        else
        {
            while($row8=sqlsrv_fetch_array($r8))
            {
                $arrayResponse["nome"]=$row8["nome"];
                $arrayResponse["id_milestone"]=$row8["id_milestone"];
                $arrayResponse["anno"]=$row8["anno"];
                $arrayResponse["settimana"]=$row8["settimana"];
            }
            echo json_encode($arrayResponse);
        }
    
?>