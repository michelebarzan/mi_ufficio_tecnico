<?php

    include "Session.php";
    include "connessione.php";

    $materiale=$_REQUEST["materiale"];
    $qnt=$_REQUEST["qnt"];
    $richiesta=$_REQUEST["richiesta"];
    $gruppo=$_REQUEST["gruppo"];
    $formato_1=$_REQUEST["formato_1"];
    $qnt_formato_1=$_REQUEST["qnt_formato_1"];
    $formato_2=$_REQUEST["formato_2"];
    $qnt_formato_2=$_REQUEST["qnt_formato_2"];

    $q="INSERT INTO [dbo].[dettagli_richieste_materiali_calcolo_fabbisogno] ([materiale],[qnt],[richiesta],[gruppo],[formato_1],[qnt_formato_1],[formato_2],[qnt_formato_2])
        VALUES ($materiale,$qnt,$richiesta,$gruppo,$formato_1,$qnt_formato_1,$formato_2,$qnt_formato_2)";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error".$q);
    }
    else
    {
        $q2="SELECT MAX(id_dettaglio) AS id_dettaglio FROM dettagli_richieste_materiali_calcolo_fabbisogno WHERE richiesta=".$richiesta;
        $r2=sqlsrv_query($conn,$q2);
        if($r==FALSE)
        {
            die("error".$q2);
        }
        else
        {
            while($row2=sqlsrv_fetch_array($r2))
            {
                echo $row2["id_dettaglio"];
            }
        }
    }

?>