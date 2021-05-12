<?php

    include "Session.php";
    include "connessione.php";

    $nome=str_replace("'","''",$_REQUEST["nome"]);
    $um=$_REQUEST["um"];

    $q="INSERT INTO dbo.raggruppamenti_materiali (nome,um) VALUES ('$nome','$um')";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error".$q);
    }
    else
    {
        $q2="SELECT MAX(id_raggruppamento) AS id_raggruppamento FROM raggruppamenti_materiali WHERE nome='$nome'";
        $r2=sqlsrv_query($conn,$q2);
        if($r2==FALSE)
        {
            die("error".$q2);
        }
        else
        {
            while($row2=sqlsrv_fetch_array($r2))
            {
                echo $row2["id_raggruppamento"];
            }
        }
    }

?>