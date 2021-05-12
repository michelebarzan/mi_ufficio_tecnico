
<?php

    include "connessione.php";

    $id_utente=$_REQUEST["id_utente"];
    $username=$_REQUEST["username"];
    $nome=$_REQUEST["nome"];
    $cognome=$_REQUEST["cognome"];
    $usernamePC=$_REQUEST["usernamePC"];
    $mail=$_REQUEST["mail"];

    $query2="UPDATE utenti SET username='$username',nome='$nome',cognome='$cognome',usernamePC='$usernamePC',mail='$mail' WHERE id_utente=$id_utente";	
    $result2=sqlsrv_query($conn,$query2);
    if($result2==TRUE)
    {
        echo "ok";
    }
    else
        die("error1");

?>