<?php

    include "Session.php";
    include "connessione.php";

    $materiale=$_REQUEST["materiale"];
    $commessa=$_REQUEST["commessa"];

    $note=[];

    $q="SELECT dbo.note_materiali_commesse.id_nota, dbo.note_materiali_commesse.testo, dbo.note_materiali_commesse.dataOra, dbo.utenti.username, dbo.utenti.id_utente
        FROM dbo.note_materiali_commesse INNER JOIN dbo.anagrafica_commesse ON dbo.note_materiali_commesse.commessa = dbo.anagrafica_commesse.id_commessa INNER JOIN dbo.utenti ON dbo.note_materiali_commesse.utente = dbo.utenti.id_utente INNER JOIN dbo.anagrafica_materiali ON dbo.note_materiali_commesse.materiale = dbo.anagrafica_materiali.id_materiale
        WHERE (dbo.anagrafica_materiali.nome = '$materiale') AND (dbo.anagrafica_materiali.commessa = (SELECT id_commessa FROM anagrafica_commesse WHERE nome='$commessa')) AND (dbo.anagrafica_commesse.nome = '$commessa')
        ORDER BY dataOra DESC";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error");
    }
    else
    {
        while($row=sqlsrv_fetch_array($r))
        {
            $nota["id_nota"]=$row["id_nota"];
            $nota["testo"]=utf8_encode($row["testo"]);
            $nota["dataOra"]=$row["dataOra"]->format('d/m/Y H:i:s');
            $nota["username"]=$row["username"];
            $nota["id_utente"]=$row["id_utente"];
            
            array_push($note,$nota);
        }
    }

    echo json_encode($note);

?>