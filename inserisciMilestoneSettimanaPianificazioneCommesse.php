<?php

    $database="mi_pianificazione";
    include "connessioneDb.php";

    $nome=str_replace("'","",$_REQUEST["nome"]);
    $descrizione=str_replace("'","''",$_REQUEST["descrizione"]);
    $milestone_principale=$_REQUEST["milestone_principale"];

    $q="INSERT INTO [dbo].[anagrafica_milestones] ([nome],[descrizione],[settimane],[prima_dopo],[milestone_principale])
        OUTPUT Inserted.id_milestone
        VALUES ('$nome','$descrizione',1,'dopo',$milestone_principale)";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error".$q);
    }
    else
    {
        while($row=sqlsrv_fetch_array($r))
        {
            $id_milestone=$row["id_milestone"];
        }
        $anno=explode("_",$_REQUEST["settimana"])[0];
        $settimana=explode("_",$_REQUEST["settimana"])[1];

        $settimana_lcl=strval($settimana);
        if(strlen($settimana_lcl)==1)
            $settimana_lcl="0".$settimana_lcl;

        $settimana_milestone_int=intval($anno.$settimana_lcl);
        $settimana_milestone_string=$anno."_".$settimana;

        $q7="SELECT * FROM milestones_principali WHERE id_milestone_principale = (SELECT milestone_principale FROM anagrafica_milestones WHERE id_milestone=$id_milestone)";
        $r7=sqlsrv_query($conn,$q7);
        if($r7==FALSE)
        {
            die("error".$q7);
        }
        else
        {
            while($row7=sqlsrv_fetch_array($r7))
            {
                $settimana_lcl=strval($row7["settimana"]);
                if(strlen($settimana_lcl)==1)
                    $settimana_lcl="0".$settimana_lcl;

                $settimana_milestone_principale_int=intval($row7["anno"].$settimana_lcl);
                $settimana_milestone_principale_string=$row7["anno"].'_'.$row7["settimana"];
            }
            if($settimana_milestone_principale_int>$settimana_milestone_int)
                $prima_dopo="prima";
            else
                $prima_dopo="dopo";
        }

        $q3="UPDATE dbo.anagrafica_milestones
            SET settimane=(SELECT CASE WHEN prima_dopo = 'dopo' THEN DATEDIFF(dd, data_milestone_principale, data_milestone) ELSE DATEDIFF(dd, data_milestone, data_milestone_principale) END / 7 AS settimane
                            FROM (SELECT dbo.lunedi_settimane.data AS data_milestone, t_1.settimana_milestone, t_1.settimana_milestone_principale, lunedi_settimane_1.data AS data_milestone_principale, t_1.prima_dopo
                                FROM dbo.lunedi_settimane INNER JOIN
                                (SELECT '$prima_dopo' AS prima_dopo, '$settimana_milestone_string' AS settimana_milestone, '$settimana_milestone_principale_string' AS settimana_milestone_principale) AS t_1 ON dbo.lunedi_settimane.settimana = t_1.settimana_milestone INNER JOIN dbo.lunedi_settimane AS lunedi_settimane_1 ON t_1.settimana_milestone_principale = lunedi_settimane_1.settimana) AS t),prima_dopo='$prima_dopo'
            WHERE (id_milestone = $id_milestone)";
        $r3=sqlsrv_query($conn,$q3);
        if($r3==FALSE)
        {
            die("error");
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
    }
    
?>