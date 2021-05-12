<?php

    include "Session.php";
    include "connessione.php";

    $materiale=$_REQUEST["materiale"];
    $commessa=$_REQUEST["commessa"];

    $q="INSERT INTO [dbo].[note_materiali_commesse] ([commessa],[utente],[dataOra],[materiale])
        SELECT (SELECT MAX(id_commessa) AS commessa FROM dbo.anagrafica_commesse WHERE (nome = '$commessa')) AS commessa, ".$_SESSION['id_utente']." AS utente, GETDATE() AS dataOra, (SELECT MAX(id_materiale) AS id_materiale FROM dbo.anagrafica_materiali WHERE (nome = '$materiale') AND commessa=(SELECT id_commessa FROM anagrafica_commesse WHERE nome='$commessa')) AS materiale";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error");
    }
    else
    {
        $q2="SELECT dbo.note_materiali_commesse.id_nota, dbo.note_materiali_commesse.testo, dbo.note_materiali_commesse.dataOra, dbo.utenti.username, dbo.utenti.id_utente
            FROM dbo.note_materiali_commesse INNER JOIN dbo.anagrafica_commesse ON dbo.note_materiali_commesse.commessa = dbo.anagrafica_commesse.id_commessa INNER JOIN dbo.utenti ON dbo.note_materiali_commesse.utente = dbo.utenti.id_utente INNER JOIN dbo.anagrafica_materiali ON dbo.note_materiali_commesse.materiale = dbo.anagrafica_materiali.id_materiale
            WHERE dbo.note_materiali_commesse.id_nota=(SELECT MAX(id_nota) FROM note_materiali_commesse WHERE utente=".$_SESSION['id_utente'].")";
        $r2=sqlsrv_query($conn,$q2);
        if($r2==FALSE)
        {
            die("error");
        }
        else
        {
            while($row2=sqlsrv_fetch_array($r2))
            {
                $nota["id_nota"]=$row2["id_nota"];
                $nota["testo"]=utf8_encode($row2["testo"]);
                $nota["dataOra"]=$row2["dataOra"]->format('d/m/Y H:i:s');
                $nota["username"]=$row2["username"];
                $nota["id_utente"]=$row2["id_utente"];
                
                echo json_encode($nota);
            }
        }
    }

?>