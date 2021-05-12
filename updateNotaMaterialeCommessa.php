<?php

    include "Session.php";
    include "connessione.php";

    $testo=str_replace("'","''",$_REQUEST["testo"]);
    $id_nota=$_REQUEST["id_nota"];

    $q="UPDATE [dbo].[note_materiali_commesse] SET testo='$testo' WHERE id_nota=$id_nota";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error");
    }

?>