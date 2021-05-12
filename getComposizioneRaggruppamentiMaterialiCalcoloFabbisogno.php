<?php

    include "Session.php";
    include "connessione.php";

    $id_commessa=$_REQUEST["id_commessa"];

    $raggruppamenti=[];

    $q="SELECT dbo.raggruppamenti_materiali.nome, dbo.raggruppamenti_materiali.um, COUNT(dbo.anagrafica_materiali.id_materiale) AS n_materiali, dbo.raggruppamenti_materiali.id_raggruppamento, dbo.anagrafica_materiali.commessa
        FROM dbo.raggruppamenti_materiali INNER JOIN dbo.anagrafica_materiali ON dbo.raggruppamenti_materiali.id_raggruppamento = dbo.anagrafica_materiali.raggruppamento
        GROUP BY dbo.raggruppamenti_materiali.nome, dbo.raggruppamenti_materiali.um, dbo.raggruppamenti_materiali.id_raggruppamento, dbo.anagrafica_materiali.commessa
        HAVING (dbo.anagrafica_materiali.commessa = $id_commessa)";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error".$q);
    }
    else
    {
        while($row=sqlsrv_fetch_array($r))
        {
            $raggruppamento["id_raggruppamento"]=$row["id_raggruppamento"];
            $raggruppamento["nome"]=$row["nome"];
            $raggruppamento["um"]=$row["um"];
            $raggruppamento["n_materiali"]=$row["n_materiali"];

            $materiali=[];

            $q2="SELECT id_materiale, nome, descrizione, um, materia_prima, raggruppamento
                FROM dbo.anagrafica_materiali
                WHERE (raggruppamento = ".$row['id_raggruppamento'].") AND commessa=$id_commessa";
            $r2=sqlsrv_query($conn,$q2);
            if($r2==FALSE)
            {
                die("error".$q2);
            }
            else
            {
                while($row2=sqlsrv_fetch_array($r2))
                {
                    $materiale["id_materiale"]=$row2["id_materiale"];
                    $materiale["nome"]=$row2["nome"];
                    $materiale["descrizione"]=utf8_encode($row2["descrizione"]);
                    $materiale["um"]=$row2["um"];
                    $materiale["materia_prima"]=$row2["materia_prima"];
                    $materiale["raggruppamento"]=$row2["raggruppamento"];
                    
                    array_push($materiali,$materiale);
                }
            }
            
            $raggruppamento["materiali"]=$materiali;

            array_push($raggruppamenti,$raggruppamento);
        }
    }

    echo json_encode($raggruppamenti);

?>