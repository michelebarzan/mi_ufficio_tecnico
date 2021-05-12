<?php

    include "Session.php";
    include "connessione.php";

    $valore=$_REQUEST["valore"];
    $id_dettaglio=$_REQUEST["id_dettaglio"];
    $colonna=$_REQUEST["colonna"];
    $commessa=$_REQUEST["commessa"];

    $q="UPDATE dbo.dettagli_richieste_materiali_calcolo_fabbisogno SET [$colonna]=$valore WHERE id_dettaglio=$id_dettaglio";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error".$q);
    }
    elseif($colonna=="materiale")
    {
        $q2="SELECT * FROM anagrafica_materiali WHERE [id_materiale]=$valore";
        $r2=sqlsrv_query($conn,$q2);
        if($r2==FALSE)
        {
            die("error".$q);
        }
        else
        {
            while($row2=sqlsrv_fetch_array($r2))
            {
                echo $row2["um"];
            }
        }
    }

?>