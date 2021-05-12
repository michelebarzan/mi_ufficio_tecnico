<?php

    include "Session.php";
    include "connessione.php";

    $nome=str_replace("'","''",$_REQUEST["nome"]);
    $descrizione=str_replace("'","''",$_REQUEST["descrizione"]);

    $q="INSERT INTO [dbo].[anagrafica_commesse] ([nome],[descrizione]) VALUES('$nome','$descrizione')";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error".$q);
    }
    else
    {
        $q2="SELECT MAX(id_commessa) AS id_commessa FROM anagrafica_commesse WHERE nome='$nome'";
        $r2=sqlsrv_query($conn,$q2);
        if($r==FALSE)
        {
            die("error".$q2);
        }
        else
        {
            while($row2=sqlsrv_fetch_array($r2))
            {
                echo $row2["id_commessa"];
            }
        }
    }

?>