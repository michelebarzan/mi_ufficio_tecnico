<?php

    $database="mi_pianificazione";
    include "connessioneDb.php";

    $id_commessa=$_REQUEST["id_commessa"];

    $tronconi=[];

    $q="SELECT dbo.anagrafica_tronconi.id_troncone, dbo.anagrafica_tronconi.nome, dbo.anagrafica_tronconi.commessa, mi_webapp.dbo.anagrafica_commesse.color
        FROM dbo.anagrafica_tronconi INNER JOIN mi_webapp.dbo.anagrafica_commesse ON dbo.anagrafica_tronconi.commessa = mi_webapp.dbo.anagrafica_commesse.id_commessa
        WHERE (dbo.anagrafica_tronconi.commessa = $id_commessa)";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error");
    }
    else
    {
        while($row=sqlsrv_fetch_array($r))
        {
            $troncone["id_troncone"]=$row["id_troncone"];
            $troncone["nome"]=utf8_encode($row["nome"]);
            $troncone["commessa"]=$row["commessa"];
            $troncone["color"]=$row["color"];

            array_push($tronconi,$troncone);
        }
    }

    echo json_encode($tronconi);

?>