<?php

    include "Session.php";
    include "connessione.php";

    $nome=$_REQUEST["nome"];

    $q="SELECT COUNT(*) AS n, nome
        FROM dbo.anagrafica_commesse
        WHERE (nome = '$nome')
        GROUP BY nome";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error");
    }
    else
    {
        $rows = sqlsrv_has_rows( $r );
        if ($rows === true)
        {
            while($row=sqlsrv_fetch_array($r))
            {
                echo $row["n"];
            }
        }
        else 
            echo 0;
    }

?>