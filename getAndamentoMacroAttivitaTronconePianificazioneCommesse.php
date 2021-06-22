<?php

    $database="mi_pianificazione";
    include "connessioneDb.php";

    $id_troncone=$_REQUEST["id_troncone"];
    $id_macro_attivita=$_REQUEST["id_macro_attivita"];

    $andamento["id_andamento"]=null;
    $andamento["nome"]=null;
    $andamento["id_macro_attivita_andamento"]=null;

    $q="SELECT dbo.anagrafica_andamenti.id_andamento, dbo.anagrafica_andamenti.nome, dbo.macro_attivita_andamenti.id_macro_attivita_andamento
        FROM dbo.anagrafica_andamenti INNER JOIN dbo.macro_attivita_andamenti ON dbo.anagrafica_andamenti.id_andamento = dbo.macro_attivita_andamenti.andamento
        WHERE (dbo.macro_attivita_andamenti.troncone = $id_troncone) AND (dbo.macro_attivita_andamenti.macro_attivita = $id_macro_attivita)";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error".$q);
    }
    else
    {
        while($row=sqlsrv_fetch_array($r))
        {
            $andamento["id_andamento"]=$row["id_andamento"];
            $andamento["nome"]=utf8_encode($row["nome"]);
            $andamento["id_macro_attivita_andamento"]=$row["id_macro_attivita_andamento"];
        }
    }

    echo json_encode($andamento);

?>