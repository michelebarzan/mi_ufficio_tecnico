<?php

    include "Session.php";
    include "connessione.php";

    $materie_prime=[];

    $q="SELECT * FROM mi_db_tecnico.dbo.materie_prime ORDER BY codice_materia_prima";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error");
    }
    else
    {
        while($row=sqlsrv_fetch_array($r))
        {
            $materia_prima["id_materia_prima"]=$row["id_materia_prima"];
            $materia_prima["codice_materia_prima"]=utf8_encode($row["codice_materia_prima"]);
            $materia_prima["descrizione"]=utf8_encode($row["descrizione"]);
            $materia_prima["um"]=$row["um"];
            $materia_prima["peso"]=$row["peso"];
            $materia_prima["note"]=utf8_encode($row["note"]);
            $materia_prima["confezione"]=$row["confezione"];
            
            array_push($materie_prime,$materia_prima);
        }
    }

    echo json_encode($materie_prime);

?>