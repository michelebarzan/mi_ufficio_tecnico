<?php

    $database="mi_pianificazione";
    include "connessioneDb.php";

    $id_troncone=$_REQUEST["id_troncone"];

    $q0="SELECT SUM(quantita) AS totale
        FROM dbo.consistenza_tronconi
        WHERE (troncone = $id_troncone)";
    $r0=sqlsrv_query($conn,$q0);
    if($r0==FALSE)
    {
        die("error");
    }
    else
    {
        while($row0=sqlsrv_fetch_array($r0))
        {
            $consistenza_troncone["totale"]=$row0["totale"];
        }
    }

    $grouped=[];

    $q="SELECT dbo.consistenza_tronconi.id_consistenza_troncone, dbo.consistenza_tronconi.voce_consistenza_troncone_1 AS id_voce_consistenza_troncone_1, dbo.consistenza_tronconi.voce_consistenza_troncone_2 AS id_voce_consistenza_troncone_2, dbo.consistenza_tronconi.troncone, dbo.consistenza_tronconi.quantita, voci_consistenza_tronconi_1.nome AS voce_consistenza_troncone_1, dbo.voci_consistenza_tronconi.nome AS voce_consistenza_troncone_2
        FROM dbo.consistenza_tronconi INNER JOIN dbo.voci_consistenza_tronconi AS voci_consistenza_tronconi_1 ON dbo.consistenza_tronconi.voce_consistenza_troncone_1 = voci_consistenza_tronconi_1.id_voce INNER JOIN dbo.voci_consistenza_tronconi ON dbo.consistenza_tronconi.voce_consistenza_troncone_2 = dbo.voci_consistenza_tronconi.id_voce
        WHERE troncone = $id_troncone";
    $r=sqlsrv_query($conn,$q);
    if($r==FALSE)
    {
        die("error");
    }
    else
    {
        while($row=sqlsrv_fetch_array($r))
        {
            $consistenza_row["id_consistenza_troncone"]=$row["id_consistenza_troncone"];
            $consistenza_row["id_voce_consistenza_troncone_1"]=$row["id_voce_consistenza_troncone_1"];
            $consistenza_row["id_voce_consistenza_troncone_2"]=$row["id_voce_consistenza_troncone_2"];
            $consistenza_row["voce_consistenza_troncone_1"]=$row["voce_consistenza_troncone_1"];
            $consistenza_row["voce_consistenza_troncone_2"]=$row["voce_consistenza_troncone_2"];
            $consistenza_row["quantita"]=$row["quantita"];
            
            array_push($grouped,$consistenza_row);
        }
    }

    $consistenza_troncone["grouped"]=$grouped;

    $tabled=[];

    $q1="SELECT dbo.consistenza_tronconi.id_consistenza_troncone, dbo.consistenza_tronconi.voce_consistenza_troncone_1 AS id_voce_consistenza_troncone_1, dbo.consistenza_tronconi.voce_consistenza_troncone_2 AS id_voce_consistenza_troncone_2, dbo.consistenza_tronconi.troncone, dbo.consistenza_tronconi.quantita, voci_consistenza_tronconi_1.nome AS voce_consistenza_troncone_1, dbo.voci_consistenza_tronconi.nome AS voce_consistenza_troncone_2
        FROM dbo.consistenza_tronconi INNER JOIN dbo.voci_consistenza_tronconi AS voci_consistenza_tronconi_1 ON dbo.consistenza_tronconi.voce_consistenza_troncone_1 = voci_consistenza_tronconi_1.id_voce INNER JOIN dbo.voci_consistenza_tronconi ON dbo.consistenza_tronconi.voce_consistenza_troncone_2 = dbo.voci_consistenza_tronconi.id_voce
        WHERE troncone = $id_troncone";
    $r1=sqlsrv_query($conn,$q1);
    if($r1==FALSE)
    {
        die("error");
    }
    else
    {
        while($row1=sqlsrv_fetch_array($r1))
        {
            $consistenza_row["id_consistenza_troncone"]=$row1["id_consistenza_troncone"];
            $consistenza_row["id_voce_consistenza_troncone_1"]=$row1["id_voce_consistenza_troncone_1"];
            $consistenza_row["id_voce_consistenza_troncone_2"]=$row1["id_voce_consistenza_troncone_2"];
            $consistenza_row["voce_consistenza_troncone_1"]=$row1["voce_consistenza_troncone_1"];
            $consistenza_row["voce_consistenza_troncone_2"]=$row1["voce_consistenza_troncone_2"];
            $consistenza_row["quantita"]=$row1["quantita"];
            $consistenza_row["troncone"]=$row1["troncone"];
            
            array_push($tabled,$consistenza_row);
        }
    }

    $consistenza_troncone["tabled"]=$tabled;

    $voci_1=[];

    $q2="SELECT dbo.consistenza_tronconi.voce_consistenza_troncone_1 AS id_voce_consistenza_troncone_1, voci_consistenza_tronconi_1.nome AS voce_consistenza_troncone_1, SUM(dbo.consistenza_tronconi.quantita) AS quantita, 
            t.id_consistenza_troncone
        FROM dbo.consistenza_tronconi INNER JOIN
            dbo.voci_consistenza_tronconi AS voci_consistenza_tronconi_1 ON dbo.consistenza_tronconi.voce_consistenza_troncone_1 = voci_consistenza_tronconi_1.id_voce INNER JOIN
            dbo.voci_consistenza_tronconi ON dbo.consistenza_tronconi.voce_consistenza_troncone_2 = dbo.voci_consistenza_tronconi.id_voce INNER JOIN
                (SELECT voce_consistenza_troncone_1, MAX(id_consistenza_troncone) AS id_consistenza_troncone
                FROM dbo.consistenza_tronconi AS consistenza_tronconi_1
                WHERE (troncone = $id_troncone)
                GROUP BY voce_consistenza_troncone_1) AS t ON dbo.consistenza_tronconi.voce_consistenza_troncone_1 = t.voce_consistenza_troncone_1
        WHERE (dbo.consistenza_tronconi.troncone = $id_troncone)
        GROUP BY dbo.consistenza_tronconi.voce_consistenza_troncone_1, voci_consistenza_tronconi_1.nome, t.id_consistenza_troncone
        ORDER BY t.id_consistenza_troncone";
    $r2=sqlsrv_query($conn,$q2);
    if($r2==FALSE)
    {
        die("error");
    }
    else
    {
        while($row2=sqlsrv_fetch_array($r2))
        {
            $voce_1_row["id_voce_consistenza_troncone_1"]=$row2["id_voce_consistenza_troncone_1"];
            $voce_1_row["voce_consistenza_troncone_1"]=$row2["voce_consistenza_troncone_1"];
            $voce_1_row["quantita"]=$row2["quantita"];
            
            array_push($voci_1,$voce_1_row);
        }
    }

    $consistenza_troncone["voci_1"]=$voci_1;

    $voci_2=[];

    $q3="SELECT dbo.consistenza_tronconi.voce_consistenza_troncone_2 AS id_voce_consistenza_troncone_2, voci_consistenza_tronconi_2.nome AS voce_consistenza_troncone_2, SUM(dbo.consistenza_tronconi.quantita) AS quantita, 
            t.id_consistenza_troncone
        FROM dbo.consistenza_tronconi INNER JOIN
            dbo.voci_consistenza_tronconi AS voci_consistenza_tronconi_2 ON dbo.consistenza_tronconi.voce_consistenza_troncone_2 = voci_consistenza_tronconi_2.id_voce INNER JOIN
            dbo.voci_consistenza_tronconi ON dbo.consistenza_tronconi.voce_consistenza_troncone_2 = dbo.voci_consistenza_tronconi.id_voce INNER JOIN
                (SELECT voce_consistenza_troncone_2, MAX(id_consistenza_troncone) AS id_consistenza_troncone
                FROM dbo.consistenza_tronconi AS consistenza_tronconi_2
                WHERE (troncone = $id_troncone)
                GROUP BY voce_consistenza_troncone_2) AS t ON dbo.consistenza_tronconi.voce_consistenza_troncone_2 = t.voce_consistenza_troncone_2
        WHERE (dbo.consistenza_tronconi.troncone = $id_troncone)
        GROUP BY dbo.consistenza_tronconi.voce_consistenza_troncone_2, voci_consistenza_tronconi_2.nome, t.id_consistenza_troncone
        ORDER BY t.id_consistenza_troncone";
    $r3=sqlsrv_query($conn,$q3);
    if($r3==FALSE)
    {
        die("error");
    }
    else
    {
        while($row3=sqlsrv_fetch_array($r3))
        {
            $voce_2_row["id_voce_consistenza_troncone_2"]=$row3["id_voce_consistenza_troncone_2"];
            $voce_2_row["voce_consistenza_troncone_2"]=$row3["voce_consistenza_troncone_2"];
            $voce_2_row["quantita"]=$row3["quantita"];
            
            array_push($voci_2,$voce_2_row);
        }
    }

    $consistenza_troncone["voci_2"]=$voci_2;

    $q4="SELECT nome,anno,settimana
        FROM dbo.milestones_principali
        WHERE (troncone = $id_troncone)";
    $r4=sqlsrv_query($conn,$q4);
    if($r4==FALSE)
    {
        die("error");
    }
    else
    {
        while($row4=sqlsrv_fetch_array($r4))
        {
            $consistenza_troncone[$row4["nome"]]=$row4["anno"].'_'.$row4["settimana"];
        }
    }
    
    echo json_encode($consistenza_troncone);

?>