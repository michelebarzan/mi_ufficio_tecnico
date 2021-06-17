<?php

    $database="mi_pianificazione";
    include "connessioneDb.php";

    $id_troncone=$_REQUEST["id_troncone"];

    $voci=[];

    $q3="SELECT id_voce, nome
        FROM dbo.voci_consistenza_tronconi
        WHERE (id_voce NOT IN
                            (SELECT DISTINCT voce_consistenza_troncone_1
                            FROM (SELECT voce_consistenza_troncone_1
                                                        FROM dbo.consistenza_tronconi
                                                        WHERE (troncone = $id_troncone)
                                                        UNION
                                                        SELECT voce_consistenza_troncone_2
                                                        FROM dbo.consistenza_tronconi AS consistenza_tronconi_1
                                                        WHERE (troncone = $id_troncone)) AS derivedtbl_1))
        ORDER BY id_voce";
    $r3=sqlsrv_query($conn,$q3);
    if($r3==FALSE)
    {
        die("error");
    }
    else
    {
        while($row3=sqlsrv_fetch_array($r3))
        {
            $voce["id_voce"]=$row3["id_voce"];
            $voce["nome"]=$row3["nome"];
            
            array_push($voci,$voce);
        }
    }
    
    echo json_encode($voci);

?>