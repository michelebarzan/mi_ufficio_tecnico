<?php

    include "Session.php";
    include "connessione.php";

    $materiale=str_replace("'","''",$_REQUEST["materiale"]);
    $um=str_replace("'","''",$_REQUEST["um"]);
    $id_commessa=$_REQUEST["id_commessa"];
    $id_raggruppamento=$_REQUEST["id_raggruppamento"];

    $q="INSERT INTO dbo.[anagrafica_materiali] ([nome],[um],commessa,raggruppamento) VALUES ('$materiale','$um',$id_commessa,$id_raggruppamento)";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error".$q);
    }

?>