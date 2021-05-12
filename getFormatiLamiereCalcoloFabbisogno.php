<?php

    include "Session.php";
    include "connessione.php";

    $formati_lamiere=[];

    $q="SELECT * FROM formati_lamiere";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error");
    }
    else
    {
        while($row=sqlsrv_fetch_array($r))
        {
            $riga["id_formato"]=$row["id_formato"];
            $riga["codice"]=$row["codice"];
            $riga["finitura"]=$row["finitura"];
            $riga["altezza"]=$row["altezza"];
            $riga["larghezza"]=$row["larghezza"];
            $riga["profondita"]=$row["profondita"];
            $riga["famiglia"]=$row["famiglia"];
            
            array_push($formati_lamiere,$riga);
        }
    }

    echo json_encode($formati_lamiere);

?>