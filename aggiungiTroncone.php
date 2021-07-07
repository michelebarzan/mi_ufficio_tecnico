<?php

    $database="mi_pianificazione";
    include "connessioneDb.php";

    $id_commessa=$_REQUEST["id_commessa"];

    $tronconi=[];

    $milestones_principali=["TAGLIO FERRO","IMPOSTAZIONE","VARO","CONSEGNA"];

    $q="SELECT * FROM anagrafica_tronconi WHERE commessa=$id_commessa";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error");
    }
    else
    {
        while($row=sqlsrv_fetch_array($r))
        {
            array_push($tronconi,$row["id_troncone"]);
        }

        $q2="SELECT * FROM mi_webapp.dbo.anagrafica_commesse WHERE id_commessa=$id_commessa";
        $r2=sqlsrv_query($conn,$q2);
        if($r2==FALSE)
        {
            die("error");
        }
        else
        {
            while($row2=sqlsrv_fetch_array($r2))
            {
                $nome=$row2["nome"].'_nave';
            }
        }
        if(sizeof($tronconi)==1)
            $nome.="_troncone";
        if(sizeof($tronconi)>1)
            $nome.="_troncone_".(sizeof($tronconi)+1);
        $q3="INSERT INTO [mi_pianificazione].[dbo].[anagrafica_tronconi] ([nome],[commessa]) VALUES('$nome',$id_commessa)";
        $r3=sqlsrv_query($conn,$q3);
        if($r3==FALSE)
        {
            die("error".$q3);
        }
        else
        {
            $q4="SELECT id_troncone
                FROM dbo.anagrafica_tronconi
                WHERE (id_troncone NOT IN (SELECT DISTINCT anagrafica_tronconi_1.id_troncone FROM dbo.milestones_principali INNER JOIN dbo.anagrafica_tronconi AS anagrafica_tronconi_1 ON dbo.milestones_principali.troncone = anagrafica_tronconi_1.id_troncone WHERE (anagrafica_tronconi_1.commessa = $id_commessa)))
                AND (commessa = $id_commessa)";
            $r4=sqlsrv_query($conn,$q4);
            if($r4==FALSE)
            {
                die("error");
            }
            else
            {
                while($row4=sqlsrv_fetch_array($r4))
                {
                    $settimana_c=5;
                    foreach ($milestones_principali as $milestone_principale)
                    {
                        $q5="INSERT INTO [mi_pianificazione].[dbo].[milestones_principali] ([nome],[troncone],[settimana],[anno])
                            SELECT '$milestone_principale',".$row4['id_troncone'].",$settimana_c,DATEPART(year,GETDATE())";
                        $r5=sqlsrv_query($conn,$q5);
                        if($r5==FALSE)
                        {
                            die("error".$q5);
                        }
                        $settimana_c+=5;
                    }
                }
            }
        }
    }

?>