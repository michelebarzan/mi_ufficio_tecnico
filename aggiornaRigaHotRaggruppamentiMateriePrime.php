<?php

    include "Session.php";
    $database="mi_db_tecnico";
    include "connessioneDb.php";

    $id=$_REQUEST["id"];
    $colonna=$_REQUEST["colonna"];
    $valore=$_REQUEST["valore"];
    $table=$_REQUEST["table"];
    $primaryKey=$_REQUEST["primaryKey"];

    $q="UPDATE $table SET [$colonna]='$valore' WHERE [$primaryKey] = $id";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error".$q);
    }
    else
    {
        $q2="SELECT COUNT(*) AS n FROM dbo.raggruppamenti_materie_prime WHERE (calcolo_fabbisogno_progettato = 'true')";
        $r2=sqlsrv_query($conn,$q2);
        if($r2==FALSE)
        {
            die("error".$q2);
        }
        else
        {
            while($row2=sqlsrv_fetch_array($r2))
            {
                echo $row2["n"];
            }
        }
    }

?>