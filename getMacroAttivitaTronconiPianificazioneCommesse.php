<?php

    $database="mi_pianificazione";
    include "connessioneDb.php";

    $id_troncone=$_REQUEST["id_troncone"];
    $id_macro_attivita=$_REQUEST["id_macro_attivita"];

    $macro_attivita_tronconi=[];

    $q="SELECT dbo.macro_attivita_tronconi.id_macro_attivita_troncone, dbo.macro_attivita_tronconi.macro_attivita, dbo.macro_attivita_tronconi.consistenza_troncone
        FROM dbo.macro_attivita_tronconi INNER JOIN dbo.consistenza_tronconi ON dbo.macro_attivita_tronconi.consistenza_troncone = dbo.consistenza_tronconi.id_consistenza_troncone
        WHERE (dbo.macro_attivita_tronconi.macro_attivita = $id_macro_attivita) AND (dbo.consistenza_tronconi.troncone = $id_troncone)";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error");
    }
    else
    {
        while($row=sqlsrv_fetch_array($r))
        {
            $macro_attivita_troncone["id_macro_attivita_troncone"]=$row["id_macro_attivita_troncone"];
            $macro_attivita_troncone["macro_attivita"]=$row["macro_attivita"];
            $macro_attivita_troncone["consistenza_troncone"]=$row["consistenza_troncone"];

            array_push($macro_attivita_tronconi,$macro_attivita_troncone);
        }
    }

    echo json_encode($macro_attivita_tronconi);

?>