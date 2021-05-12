<?php

    include "Session.php";
    include "connessione.php";

    $materiale=$_REQUEST['materiale'];
    $id_commessa=$_REQUEST['id_commessa'];

    $q="SELECT * FROM anagrafica_materiali WHERE nome='$materiale' AND commessa=$id_commessa ORDER BY nome";
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
                echo $row["id_materiale"];
            }
        }
        else 
            echo json_encode(false);
    }

?>