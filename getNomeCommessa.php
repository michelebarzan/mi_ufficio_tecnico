<?php

    include "Session.php";
    include "connessione.php";

    $id_commessa=$_REQUEST["id_commessa"];
    
    $q="SELECT * FROM anagrafica_commesse WHERE [id_commessa]=$id_commessa";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error".$q);
    }
    else
    {
        while($row=sqlsrv_fetch_array($r))
        {
            echo $row["nome"];
        }
    }

?>