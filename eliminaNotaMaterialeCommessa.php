<?php

    include "Session.php";
    include "connessione.php";

    $id_nota=$_REQUEST["id_nota"];

    $q="DELETE FROM [dbo].[note_materiali_commesse] WHERE id_nota=$id_nota";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error");
    }

?>