<?php

    include "Session.php";
	$database="mi_db_tecnico";
    include "connessioneDb.php";

    set_time_limit(3000);

    $codici=json_decode($_REQUEST["JSONcodiciInput"]);

	$codici_in="'".implode("','",$codici)."'";

    $data=[];

    $q="SELECT dbo.peso_qnt_cabine.codice_cabina, dbo.materie_prime.codice_materia_prima, dbo.materie_prime.descrizione, dbo.raggruppamenti_materie_prime.nome AS raggruppamento, dbo.materie_prime.peso
        FROM dbo.peso_qnt_cabine INNER JOIN dbo.materie_prime ON dbo.peso_qnt_cabine.id_materia_prima = dbo.materie_prime.id_materia_prima INNER JOIN dbo.raggruppamenti_materie_prime ON dbo.materie_prime.raggruppamento = dbo.raggruppamenti_materie_prime.id_raggruppamento
        WHERE (dbo.peso_qnt_cabine.codice_cabina IN ($codici_in)) AND (dbo.materie_prime.peso_validato = 'false')";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error\n\n".$q."\n\n".print_r(sqlsrv_errors(),TRUE));
    }
    else
    {
        while($row=sqlsrv_fetch_array($r))
        {
            $rowObj=$row;
            $n_cabine=getNCabine($codici,$row['codice_cabina']);
            $rowObj["n_cabine"]=$n_cabine;
            array_push($data,$rowObj);
        }
    }

    echo json_encode($data);

    function getNCabine($codici,$codice_cabina)
    {
        $n_cabine=0;
        foreach ($codici as $codice)
        {
            if($codice_cabina==$codice)
                $n_cabine++;
        }
        return $n_cabine;
    }

?>