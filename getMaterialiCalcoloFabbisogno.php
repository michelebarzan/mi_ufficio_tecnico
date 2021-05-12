<?php

    include "Session.php";
    include "connessione.php";

    $id_commessa=$_REQUEST["id_commessa"];

    $materiali=[];

    /*$q="SELECT TOP (100) PERCENT dbo.anagrafica_materiali.id_materiale, dbo.anagrafica_materiali.nome, dbo.anagrafica_materiali.descrizione, dbo.anagrafica_materiali.um, dbo.anagrafica_materiali.materia_prima, 
            ISNULL(mi_db_tecnico.dbo.materie_prime.confezione, 1) AS confezione
        FROM dbo.anagrafica_materiali LEFT OUTER JOIN
            mi_db_tecnico.dbo.materie_prime ON dbo.anagrafica_materiali.materia_prima = mi_db_tecnico.dbo.materie_prime.id_materia_prima
        ORDER BY dbo.anagrafica_materiali.nome";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error");
    }
    else
    {
        while($row=sqlsrv_fetch_array($r))
        {
            $materiale["id_materiale"]=$row["id_materiale"];
            $materiale["nome"]=utf8_encode($row["nome"]);
            $materiale["descrizione"]=utf8_encode($row["descrizione"]);
            $materiale["um"]=$row["um"];
            $materiale["confezione"]=$row["confezione"];
            
            array_push($materiali,$materiale);
        }
    }*/

    $q="SELECT dbo.anagrafica_materiali.id_materiale, dbo.anagrafica_materiali.nome, dbo.anagrafica_materiali.descrizione, dbo.anagrafica_materiali.um, dbo.anagrafica_materiali.materia_prima, dbo.anagrafica_materiali.raggruppamento, dbo.anagrafica_materiali.commessa, dbo.raggruppamenti_materiali.nome AS nome_raggruppamento, dbo.raggruppamenti_materiali.calcolo_progettato_alternativo
        FROM dbo.anagrafica_materiali LEFT OUTER JOIN dbo.raggruppamenti_materiali ON dbo.anagrafica_materiali.raggruppamento = dbo.raggruppamenti_materiali.id_raggruppamento WHERE commessa=$id_commessa ORDER BY nome";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error");
    }
    else
    {
        while($row=sqlsrv_fetch_array($r))
        {
            $materiale["id_materiale"]=$row["id_materiale"];
            $materiale["nome"]=utf8_encode($row["nome"]);
            $materiale["descrizione"]=utf8_encode($row["descrizione"]);
            $materiale["nome_raggruppamento"]=utf8_encode($row["nome_raggruppamento"]);
            $materiale["calcolo_progettato_alternativo"]=$row["calcolo_progettato_alternativo"];
            $materiale["raggruppamento"]=$row["raggruppamento"];
            $materiale["um"]=$row["um"];
            
            array_push($materiali,$materiale);
        }
    }

    echo json_encode($materiali);

?>