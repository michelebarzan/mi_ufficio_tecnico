<?php

    $database="mi_pianificazione";
    include "connessioneDb.php";

    $attivita=[];

    $q="SELECT dbo.anagrafica_attivita.id_attivita, dbo.anagrafica_attivita.nome, dbo.anagrafica_attivita.descrizione, dbo.macro_attivita.nome AS nome_macro_attivita, dbo.macro_attivita.id_macro_attivita FROM dbo.anagrafica_attivita LEFT OUTER JOIN dbo.macro_attivita ON dbo.anagrafica_attivita.macro_attivita = dbo.macro_attivita.id_macro_attivita ORDER BY nome";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error".$q);
    }
    else
    {
        while($row=sqlsrv_fetch_array($r))
        {
            $attivita_item["id_attivita"]=$row["id_attivita"];
            $attivita_item["nome"]=utf8_encode($row["nome"]);
            $attivita_item["descrizione"]=utf8_encode($row["descrizione"]);
            $attivita_item["id_macro_attivita"]=$row["id_macro_attivita"];
            $attivita_item["nome_macro_attivita"]=utf8_encode($row["nome_macro_attivita"]);
            
            array_push($attivita,$attivita_item);
        }
    }

    echo json_encode($attivita);

?>