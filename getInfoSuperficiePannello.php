<?php

    include "Session.php";
    //$database="viste_db_tecnico";
	$database="mi_db_tecnico";
    include "connessioneDb.php";

    set_time_limit(3000);

    $codici=json_decode($_REQUEST["JSONcodici"]);
    $mostraCodiciCabina=$_REQUEST["mostraCodiciCabina"];

    $subquery="";
    foreach ($codici as $codice)
    {
        $subquery.="SELECT '$codice' AS codcab UNION ALL ";
    }
    $subquery=substr($subquery, 0, -11);
	
	//$codici_in="'".implode("','",$codici)."'";

    $pannelli=[];
    $arrayResponse["totaliPannelli"]["qnt"]=0;
    $arrayResponse["totaliPannelli"]["mq"]=0;
    $arrayResponse["totaliPannelli"]["mq_totali"]=0;
    $arrayResponse["totaliPannelli"]["forati"]=0;
    
	if($mostraCodiciCabina=="true")
    {
        $qPannelli="SELECT        dbo.cabine.codice_cabina AS codcab, dbo.pannelli.codice_pannello AS codele, dbo.lamiere.lung1, dbo.lamiere.lung2, dbo.lamiere.halt, SUM(dbo.kit_cabine.qnt * dbo.pannelli_kit.qnt) AS qnt, dbo.lamiere.ang, 
                            (dbo.lamiere.lung1 + dbo.lamiere.lung2) * dbo.lamiere.halt / 1000000 AS mq, SUM(((dbo.lamiere.lung1 + dbo.lamiere.lung2) * dbo.lamiere.halt / 1000000) * (dbo.kit_cabine.qnt * dbo.pannelli_kit.qnt)) AS mq_totali, 
                            dbo.lamiere.fori as forati
                    FROM            dbo.pannelli INNER JOIN
                            dbo.pannelli_kit ON dbo.pannelli.id_pannello = dbo.pannelli_kit.id_pannello INNER JOIN
                            dbo.lamiere ON dbo.pannelli.id_lamiera = dbo.lamiere.id_lamiera INNER JOIN
                            dbo.sviluppi ON dbo.lamiere.id_sviluppo = dbo.sviluppi.id_sviluppo INNER JOIN
                            dbo.kit ON dbo.pannelli_kit.id_kit = dbo.kit.id_kit INNER JOIN
                            dbo.cabine INNER JOIN
                            dbo.kit_cabine ON dbo.cabine.id_cabina = dbo.kit_cabine.id_cabina ON dbo.kit.id_kit = dbo.kit_cabine.id_kit INNER JOIN
                                ($subquery) AS t ON dbo.cabine.codice_cabina = t.codcab
                    GROUP BY dbo.cabine.codice_cabina, dbo.pannelli.codice_pannello, dbo.lamiere.lung1, dbo.lamiere.lung2, dbo.lamiere.halt, dbo.lamiere.ang, dbo.lamiere.fori";
    }
    else
    {
        $qPannelli="SELECT        dbo.pannelli.codice_pannello AS codele, dbo.lamiere.lung1, dbo.lamiere.lung2, dbo.lamiere.halt, SUM(dbo.kit_cabine.qnt * dbo.pannelli_kit.qnt) AS qnt, dbo.lamiere.ang, (dbo.lamiere.lung1 + dbo.lamiere.lung2) 
                            * dbo.lamiere.halt / 1000000 AS mq, SUM(((dbo.lamiere.lung1 + dbo.lamiere.lung2) * dbo.lamiere.halt / 1000000) * (dbo.kit_cabine.qnt * dbo.pannelli_kit.qnt)) AS mq_totali, dbo.lamiere.fori as forati
                    FROM            dbo.pannelli INNER JOIN
                            dbo.pannelli_kit ON dbo.pannelli.id_pannello = dbo.pannelli_kit.id_pannello INNER JOIN
                            dbo.lamiere ON dbo.pannelli.id_lamiera = dbo.lamiere.id_lamiera INNER JOIN
                            dbo.sviluppi ON dbo.lamiere.id_sviluppo = dbo.sviluppi.id_sviluppo INNER JOIN
                            dbo.kit ON dbo.pannelli_kit.id_kit = dbo.kit.id_kit INNER JOIN
                            dbo.cabine INNER JOIN
                            dbo.kit_cabine ON dbo.cabine.id_cabina = dbo.kit_cabine.id_cabina ON dbo.kit.id_kit = dbo.kit_cabine.id_kit INNER JOIN
                                ($subquery) AS t ON dbo.cabine.codice_cabina = t.codcab
                    GROUP BY dbo.cabine.codice_cabina, dbo.pannelli.codice_pannello, dbo.lamiere.lung1, dbo.lamiere.lung2, dbo.lamiere.halt, dbo.lamiere.ang, dbo.lamiere.fori";
    }
    
    $rPannelli=sqlsrv_query($conn,$qPannelli);
    if($rPannelli==FALSE)
    {
        die("error\n\n".$qPannelli."\n\n".print_r(sqlsrv_errors(),TRUE));
    }
    else
    {
        while($rowPannelli=sqlsrv_fetch_array($rPannelli))
        {
            //$pannello["database"]=$rowPannelli["database"];
            if($mostraCodiciCabina=="true")
                $pannello["codcab"]=$rowPannelli["codcab"];
            $pannello["codele"]=$rowPannelli["codele"];
            $pannello["lung1"]=number_format($rowPannelli['lung1'],2,",",".");
            $pannello["lung2"]=number_format($rowPannelli["lung2"],2,",",".");
            $pannello["halt"]=number_format($rowPannelli["halt"],2,",",".");
            $pannello["qnt"]=number_format($rowPannelli["qnt"],2,",",".");
            $pannello["ang"]=number_format($rowPannelli["ang"],2,",",".");
            $pannello["mq"]=number_format($rowPannelli["mq"],2,",",".");
            $pannello["mq_totali"]=number_format($rowPannelli["mq_totali"],2,",",".");
            $pannello["forati"]=$rowPannelli["forati"];

            $arrayResponse["totaliPannelli"]["qnt"]+=floatval($rowPannelli["qnt"]);
            $arrayResponse["totaliPannelli"]["mq"]+=floatval($rowPannelli["mq"]);
            $arrayResponse["totaliPannelli"]["mq_totali"]+=floatval($rowPannelli["mq_totali"]);
            if($pannello["forati"]=="Si")
                $arrayResponse["totaliPannelli"]["forati"]++;
            
            array_push($pannelli,$pannello);
        }
    }

    //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    $kit=[];
    $arrayResponse["totaliKit"]["qnt"]=0;
    $arrayResponse["totaliKit"]["mq"]=0;
    $arrayResponse["totaliKit"]["mq_totali"]=0;
    
	if($mostraCodiciCabina=="true")
    {
        $qKit="SELECT        dbo.kit.codice_kit AS codkit, dbo.kit.lung, dbo.kit.halt, SUM(dbo.kit_cabine.qnt) AS qnt, dbo.kit.halt * dbo.kit.lung / 1000000 AS mq, SUM(dbo.kit.halt * dbo.kit.lung * dbo.kit_cabine.qnt / 1000000) AS mq_totali, t.codcab
        FROM            dbo.kit INNER JOIN
                                 dbo.cabine INNER JOIN
                                 dbo.kit_cabine ON dbo.cabine.id_cabina = dbo.kit_cabine.id_cabina ON dbo.kit.id_kit = dbo.kit_cabine.id_kit INNER JOIN
                                     ($subquery) AS t ON dbo.cabine.codice_cabina = t.codcab
        GROUP BY dbo.cabine.codice_cabina, dbo.kit.codice_kit, dbo.kit.lung, dbo.kit.halt, dbo.kit.halt * dbo.kit.lung / 1000000, t.codcab";
    }
    else
    {
        $qKit="SELECT        dbo.kit.codice_kit AS codkit, dbo.kit.lung, dbo.kit.halt, SUM(dbo.kit_cabine.qnt) AS qnt, dbo.kit.halt * dbo.kit.lung / 1000000 AS mq, SUM(dbo.kit.halt * dbo.kit.lung * dbo.kit_cabine.qnt / 1000000) AS mq_totali
        FROM            dbo.kit INNER JOIN
                                 dbo.cabine INNER JOIN
                                 dbo.kit_cabine ON dbo.cabine.id_cabina = dbo.kit_cabine.id_cabina ON dbo.kit.id_kit = dbo.kit_cabine.id_kit INNER JOIN
                                     ($subquery) AS t ON dbo.cabine.codice_cabina = t.codcab
        GROUP BY dbo.cabine.codice_cabina, dbo.kit.codice_kit, dbo.kit.lung, dbo.kit.halt, dbo.kit.halt * dbo.kit.lung / 1000000";
    }//echo "||||".$subquery."||||";
    
    $rKit=sqlsrv_query($conn,$qKit);
    if($rKit==FALSE)
    {
        die("error".$qKit);
    }
    else
    {
        while($rowKit=sqlsrv_fetch_array($rKit))
        {
            //$kitItem["database"]=$rowKit["database"];
            if($mostraCodiciCabina=="true")
                $kitItem["codcab"]=$rowKit["codcab"];
            $kitItem["codkit"]=$rowKit["codkit"];
            $kitItem["halt"]=number_format($rowKit["halt"],2,",",".");
            $kitItem["lung"]=number_format($rowKit["lung"],2,",",".");
            $kitItem["qnt"]=number_format($rowKit["qnt"],2,",",".");
            $kitItem["mq"]=number_format($rowKit["mq"],2,",",".");
            $kitItem["mq_totali"]=number_format($rowKit["mq_totali"],2,",",".");

            $arrayResponse["totaliKit"]["qnt"]+=floatval($rowKit["qnt"]);
            $arrayResponse["totaliKit"]["mq"]+=floatval($rowKit["mq"]);
            $arrayResponse["totaliKit"]["mq_totali"]+=floatval($rowKit["mq_totali"]);
            
            array_push($kit,$kitItem);
        }
    }

    $cabineTrovate=[];
    
						$qCabine="select codcab from (SELECT        dbo.cabine.codice_cabina AS codcab, dbo.pannelli.codice_pannello AS codele, dbo.lamiere.lung1, dbo.lamiere.lung2, dbo.lamiere.halt, SUM(dbo.kit_cabine.qnt * dbo.pannelli_kit.qnt) AS qnt, dbo.lamiere.ang, 
                        (dbo.lamiere.lung1 + dbo.lamiere.lung2) * dbo.lamiere.halt / 1000000 AS mq, SUM(((dbo.lamiere.lung1 + dbo.lamiere.lung2) * dbo.lamiere.halt / 1000000) * (dbo.kit_cabine.qnt * dbo.pannelli_kit.qnt)) AS mq_totali, 
                        dbo.lamiere.fori
                FROM            dbo.pannelli INNER JOIN
                        dbo.pannelli_kit ON dbo.pannelli.id_pannello = dbo.pannelli_kit.id_pannello INNER JOIN
                        dbo.lamiere ON dbo.pannelli.id_lamiera = dbo.lamiere.id_lamiera INNER JOIN
                        dbo.sviluppi ON dbo.lamiere.id_sviluppo = dbo.sviluppi.id_sviluppo INNER JOIN
                        dbo.kit ON dbo.pannelli_kit.id_kit = dbo.kit.id_kit INNER JOIN
                        dbo.cabine INNER JOIN
                        dbo.kit_cabine ON dbo.cabine.id_cabina = dbo.kit_cabine.id_cabina ON dbo.kit.id_kit = dbo.kit_cabine.id_kit INNER JOIN
                            ($subquery) AS t ON dbo.cabine.codice_cabina = t.codcab
                GROUP BY dbo.cabine.codice_cabina, dbo.pannelli.codice_pannello, dbo.lamiere.lung1, dbo.lamiere.lung2, dbo.lamiere.halt, dbo.lamiere.ang, dbo.lamiere.fori) as t union all
                          
                        select codcab from (SELECT        dbo.kit.codice_kit AS codkit, dbo.kit.lung, dbo.kit.halt, SUM(dbo.kit_cabine.qnt) AS qnt, dbo.kit.halt * dbo.kit.lung / 1000000 AS mq, SUM(dbo.kit.halt * dbo.kit.lung * dbo.kit_cabine.qnt / 1000000) AS mq_totali, t.codcab
        FROM            dbo.kit INNER JOIN
                                 dbo.cabine INNER JOIN
                                 dbo.kit_cabine ON dbo.cabine.id_cabina = dbo.kit_cabine.id_cabina ON dbo.kit.id_kit = dbo.kit_cabine.id_kit INNER JOIN
                                     ($subquery) AS t ON dbo.cabine.codice_cabina = t.codcab
        GROUP BY dbo.cabine.codice_cabina, dbo.kit.codice_kit, dbo.kit.lung, dbo.kit.halt, dbo.kit.halt * dbo.kit.lung / 1000000, t.codcab) as t2";					
    $rCabine=sqlsrv_query($conn,$qCabine);
    if($rCabine==FALSE)
    {
        die("error".$qCabine);
    }
    else
    {
        while($rowCabine=sqlsrv_fetch_array($rCabine))
        {
            array_push($cabineTrovate,$rowCabine["codcab"]);
        }
    }

    $arrayResponse["qPannelli"]=$qPannelli;
    $arrayResponse["qKit"]=$qKit;
    $arrayResponse["qCabine"]=$qCabine;

    $arrayResponse["pannelli"]=$pannelli;
    $arrayResponse["kit"]=$kit;
    $arrayResponse["cabineTrovate"]=$cabineTrovate;

    $arrayResponse["totaliPannelli"]["qnt"]=number_format($arrayResponse["totaliPannelli"]["qnt"],2,",",".");
    $arrayResponse["totaliPannelli"]["mq"]=number_format($arrayResponse["totaliPannelli"]["mq"],2,",",".");
    $arrayResponse["totaliPannelli"]["mq_totali"]=number_format($arrayResponse["totaliPannelli"]["mq_totali"],2,",",".");

    $arrayResponse["totaliKit"]["qnt"]=number_format($arrayResponse["totaliKit"]["qnt"],2,",",".");
    $arrayResponse["totaliKit"]["mq"]=number_format($arrayResponse["totaliKit"]["mq"],2,",",".");
    $arrayResponse["totaliKit"]["mq_totali"]=number_format($arrayResponse["totaliKit"]["mq_totali"],2,",",".");

    echo json_encode($arrayResponse);

?>