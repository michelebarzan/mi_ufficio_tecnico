
<?php

    include "connessione.php";

    $id_utente=$_REQUEST["id_utente"];
    $eliminato=$_REQUEST["eliminato"];

    $query2="UPDATE utenti SET eliminato='$eliminato' WHERE id_utente=$id_utente";	
    $result2=sqlsrv_query($conn,$query2);
    if($result2==TRUE)
    {
        echo "ok";
    }
    else
        die("error1");

?>