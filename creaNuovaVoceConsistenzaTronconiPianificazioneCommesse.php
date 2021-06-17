<?php

    $database="mi_pianificazione";
    include "connessioneDb.php";

    $nome=str_replace("'","",$_REQUEST["nome"]);

    $q3="INSERT INTO [dbo].[voci_consistenza_tronconi] ([nome]) VALUES ('$nome')";
    $r3=sqlsrv_query($conn,$q3);
    if($r3==FALSE)
    {
        die("error");
    }
    else
    {
        $q2="SELECT id_voce FROM voci_consistenza_tronconi WHERE nome='$nome'";
        $r2=sqlsrv_query($conn,$q2);
        if($r2==FALSE)
        {
            die("error");
        }
        else
        {
            while($row2=sqlsrv_fetch_array($r2))
            {
                echo $row2["id_voce"];
            }
        }
    }
    
?>