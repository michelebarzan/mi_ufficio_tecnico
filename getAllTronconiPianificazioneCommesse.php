<?php

    $database="mi_pianificazione";
    include "connessioneDb.php";

    $tronconi=[];

    $q="SELECT dbo.anagrafica_tronconi.id_troncone, dbo.anagrafica_tronconi.nome AS nome_troncone, mi_webapp.dbo.anagrafica_commesse.id_commessa, mi_webapp.dbo.anagrafica_commesse.nome AS nome_commessa, mi_webapp.dbo.anagrafica_commesse.descrizione AS descrizione_commessa, mi_webapp.dbo.anagrafica_commesse.color
        FROM dbo.anagrafica_tronconi INNER JOIN mi_webapp.dbo.anagrafica_commesse ON dbo.anagrafica_tronconi.commessa = mi_webapp.dbo.anagrafica_commesse.id_commessa";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error");
    }
    else
    {
        while($row=sqlsrv_fetch_array($r))
        {
            $troncone["id_troncone"]=$row["id_troncone"];
            $troncone["nome_troncone"]=utf8_encode($row["nome_troncone"]);
            $troncone["id_commessa"]=$row["id_commessa"];
            $troncone["nome_commessa"]=$row["nome_commessa"];
            $troncone["descrizione_commessa"]=$row["descrizione_commessa"];
            $troncone["color"]=$row["color"];

            $troncone["milestones_principali"]=[];

            $q2="SELECT [id_milestone_principale],[nome],[descrizione],[troncone],[settimana],[anno]
                FROM [mi_pianificazione].[dbo].[milestones_principali]
                WHERE troncone=".$row['id_troncone'];
            $r2=sqlsrv_query($conn,$q2);
            if($r2==FALSE)
            {
                die("error");
            }
            else
            {
                while($row2=sqlsrv_fetch_array($r2))
                {
                    $milestone_principale["id_milestone_principale"]=$row2["id_milestone_principale"];
                    $milestone_principale["nome"]=utf8_encode($row2["nome"]);
                    $milestone_principale["descrizione"]=utf8_encode($row2["descrizione"]);
                    $milestone_principale["settimana"]=$row2["settimana"];
                    $milestone_principale["anno"]=$row2["anno"];

                    array_push($troncone["milestones_principali"],$milestone_principale);
                }
            }

            array_push($tronconi,$troncone);
        }
    }

    echo json_encode($tronconi);

?>