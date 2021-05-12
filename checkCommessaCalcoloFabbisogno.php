<?php

    include "Session.php";
    include "connessione.php";

    $commessa=$_REQUEST['commessa'];

    $q="SELECT * FROM anagrafica_commesse WHERE nome='$commessa' ORDER BY nome";
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
                echo $row["id_commessa"];
            }
        }
        else 
            echo json_encode(false);
    }

?>