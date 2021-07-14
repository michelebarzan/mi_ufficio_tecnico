<?php

    include "Session.php";
    include "connessione.php";

    $nome=str_replace("'","''",$_REQUEST["nome"]);
    $descrizione=str_replace("'","''",$_REQUEST["descrizione"]);
    $tronconi=$_REQUEST["tronconi"];
    $n_tronconi=$_REQUEST["n_tronconi"];

    $q="INSERT INTO [dbo].[anagrafica_commesse] ([nome],[descrizione],color) VALUES('$nome','$descrizione','#000000')";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error".$q);
    }
    else
    {
        $q2="SELECT MAX(id_commessa) AS id_commessa FROM anagrafica_commesse WHERE nome='$nome'";
        $r2=sqlsrv_query($conn,$q2);
        if($r==FALSE)
        {
            die("error".$q2);
        }
        else
        {
            while($row2=sqlsrv_fetch_array($r2))
            {
                $id_commessa = $row2["id_commessa"];
            }
            if($tronconi=="true")
            {
                $milestones_principali=["TAGLIO FERRO","IMPOSTAZIONE","VARO","CONSEGNA"];

                for ($i=0; $i < $n_tronconi; $i++)
                {
                    if($i==0)
                        $nome_troncone=$nome."_nave";
                    else
                    {
                        if($i==1)
                            $nome_troncone=$nome."_troncone";
                        else
                            $nome_troncone=$nome."_troncone_".($i+1);
                    }
                    $q3="INSERT INTO [mi_pianificazione].[dbo].[anagrafica_tronconi] ([nome],[commessa]) VALUES('".$nome_troncone."',$id_commessa)";
                    $r3=sqlsrv_query($conn,$q3);
                    if($r3==FALSE)
                    {
                        die("error".$q3);
                    }
                }
                $q4="SELECT id_troncone
                    FROM [mi_pianificazione].dbo.anagrafica_tronconi
                    WHERE (id_troncone NOT IN (SELECT DISTINCT anagrafica_tronconi_1.id_troncone FROM [mi_pianificazione].dbo.milestones_principali INNER JOIN [mi_pianificazione].dbo.anagrafica_tronconi AS anagrafica_tronconi_1 ON [mi_pianificazione].dbo.milestones_principali.troncone = anagrafica_tronconi_1.id_troncone WHERE (anagrafica_tronconi_1.commessa = $id_commessa)))
                    AND (commessa = $id_commessa)";
                $r4=sqlsrv_query($conn,$q4);
                if($r4==FALSE)
                {
                    die("error".$q4);
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
            echo $id_commessa;
        }
    }

?>