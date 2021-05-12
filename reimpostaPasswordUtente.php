
<?php

    include "connessione.php";

    $id_utente=$_REQUEST["id_utente"];
    $password=sha1($_REQUEST["password"]);

    $query2="UPDATE utenti SET password='$password' WHERE id_utente=$id_utente";	
    $result2=sqlsrv_query($conn,$query2);
    if($result2==TRUE)
    {
        echo "ok";
    }
    else
        die("error1");

?>