<?php

    include "connessione.php";

    $tabelle=[];

    $query2="SELECT * FROM mi_db_tecnico.dbo.tabelle ORDER BY ordine";	
    $result2=sqlsrv_query($conn,$query2);
    if($result2==TRUE)
    {
        while($row2=sqlsrv_fetch_array($result2))
        {
            array_push($tabelle,$row2['tabella_new']);
        }
    }

    echo json_encode($tabelle);

?>