<?php

    include "Session.php";
    include "connessione.php";

    $gruppo=$_REQUEST['gruppo'];

    $q="SELECT * FROM anagrafica_gruppi WHERE nome='$gruppo' ORDER BY nome";
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
                echo $row["id_gruppo"];
            }
        }
        else 
            echo json_encode(false);
    }

?>