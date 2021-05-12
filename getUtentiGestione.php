<?php

    include "connessione.php";

    $eliminato=$_REQUEST["eliminato"];
    $orderBy=$_REQUEST["orderBy"];

    $utenti=[];

    $query2="SELECT * FROM dbo.utenti WHERE eliminato LIKE '%$eliminato%' ORDER BY $orderBy";	
    $result2=sqlsrv_query($conn,$query2);
    if($result2==TRUE)
    {
        while($row2=sqlsrv_fetch_array($result2))
        {
            $utente["id_utente"]=$row2['id_utente'];
            $utente["username"]=utf8_encode($row2['username']);
            $utente["nome"]=utf8_encode($row2['nome']);
            $utente["cognome"]=utf8_encode($row2['cognome']);
            $utente["eliminato"]=$row2['eliminato'];
            $utente["usernamePC"]=utf8_encode($row2['usernamePC']);
            $utente["mail"]=utf8_encode($row2['mail']);

            array_push($utenti,$utente);
        }
    }

    echo json_encode($utenti);

?>