<?php

    include "Session.php";
    include "connessione.php";

    $id_file=$_REQUEST["id_file"];
    
    $dati=[];

    $q="SELECT * FROM [mi_webapp].[dbo].[dati_importazioni_fabbisogni] WHERE [file]=$id_file";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error".$q);
    }
    else
    {
        while($row=sqlsrv_fetch_array($r))
        {
            $riga["id_importazione"]=$row["id_importazione"];
            $riga["commessa"]=$row["commessa"];
            $riga["gruppo"]=$row["gruppo"];
            $riga["materiale"]=$row["materiale"];
            $riga["qnt"]=$row["qnt"];
            $riga["um"]=$row["um"];
            $riga["note"]=$row["note"];
            
            array_push($dati,$riga);
        }
    }


    echo json_encode($dati);

?>